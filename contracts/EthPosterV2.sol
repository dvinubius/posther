
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/* String utility library */
library Tools {
    /**
    * Encodes @param _value in base36 and returns it as a string
    * We use an encoding based on 
    * 1..9
    * all english letters in lowercase
    * 
    * => 10 + 25 = 35
    */
    function toBase36(uint256 _value, uint8 _maxLength) internal pure returns (string memory) {
        string memory availableCharsStr = "0123456789abcdefghijkmnopqrstuvwxyz";
        bytes memory availableChars = bytes(availableCharsStr);
        uint8 base = 36;
        uint8 len = 0;
        uint256 rem = 0;
        bool shouldBreak = false;
        bytes memory bytesRev = bytes(new string(_maxLength));

        for (uint8 i = 0; i < _maxLength; i++) {
            if(_value < base){
                shouldBreak = true;
            }
            rem = _value % base;
            _value = uint256(_value / base);
            bytesRev[i] = availableChars[rem];
            len++;
            if(shouldBreak){
                break;
            }
        }

        // Reverse
        bytes memory result = bytes(new string(len));
        for (uint i = 0; i < len; i++) {
            result[i] = bytesRev[len - i - 1];
        }
        return string(result);
    }

    function isValidStorageJson(string memory _json) internal pure returns (bool) {
        string memory jsonID = "\"id\":\"CDS\"";
        uint8 jsonMinLength = 32;

        bytes memory json = bytes(_json);
        bytes memory id = bytes(jsonID);
        if (json.length < jsonMinLength) {
            return false;
        } else {
            uint len = 0;
            if (json[1] == id[0]) {
                len = 1;
                while (len < id.length && (1 + len) < json.length && json[1 + len] == id[len]) {
                    len++;
                }
                if (len == id.length) {
                    return true;
                }
            }
        }
        return false;
    }
}

/**
 * The contract allows users to post text and have it permanently persisted on Ethereum,
 * but without persisting it in the actual storage.
 * We rely on calldata alone for storing the post text.
 * Event emission is minimal, for convenience.
 * The on-chain storage is minimimal, for convenience.
 *
 * Posts are kept in the calldata of the post transactions and can be retrieved
 * later from there. 
 * Post transactions are also logged, in order to enable easier retrieval and real-time
 * front-end functionality.
 * The contract only stores the blockNumber and the address of
 * the account that makes a particular post. 
 * A functional limitation: An account is only allowed one post transaction to be mined 
 * in a given block. Due to this, having the block number and the address makes it possible
 * to identify the transaction and hence the calldata that contains the posted text.
 *
 * When a new post is made, the contract generates a post code based on the current 
 * block number and the signer's address. This encoding is enough to prevent collisions when
 * several post transactions made by different accounts should be included in the same block.
 * The greater the block number, the longer the post code will be.
 * However, the post code can only ever have a maximum of 11 digits related to the block number. 
 * The post code also serves the end user in terms of viewing the post via a short link url.
 * The post code should be easier to remember and nicer to read than a transaction id.
 *
 * Short link URLs will have the format https://<domain>/<post_code>
 * 
 * We use this particular approach rather than something randomized with fixed length
 * in order to both ensure scalability *and* keep the post code length as small as possible. 
 * It starts small and only grows in time. This way the short links will be as short as possible.
 * 
 */
contract EthPosterV2 is Ownable {
    // Reserved for misc configs
    mapping(string => uint256) private calldataStorageConfig;

    // Registered service accounts
    mapping (address => bool) private svcAcct;

    // Storage viewer URL
    string public calldataStorageUrl;

    // Who receives the fees
    address payable private feeReceiver;

    // storage entry
    struct Entry {
        uint256 timestamp; 
        string json; 
        address sender;
    }

    // actual storage
    mapping (string => Entry) private calldataStorage;

    event CDSShortLinkCreated(uint256 timestamp, string code);

   /**
     * @param _blockOffset The closer to the current latest block, the shorter 
     * generated post codes will initially be.
     */
    constructor(uint256 _blockOffset) {
        setConfig("fee", 0);
        // set the block offset to 1000000 to use contract in testnet
        // set the block offset to 2000000 to use contract in mainnet
        setConfig("blockoffset", _blockOffset);
        setCalldataStorageURL("https://storage-viewer.now.sh/");
        setFeeReceiver(payable(msg.sender)); // the owner and contract creator
    }

    function setCalldataStorageURL(string memory _url) public onlyOwner {
        calldataStorageUrl = _url;
    }
    function setConfig(string memory _key, uint256 _value) public onlyOwner {
        calldataStorageConfig[_key] = _value;
    }
    function getConfig(string memory _key) public view returns (uint256 _value) {
        return calldataStorageConfig[_key];
    }
    function isServiceAccount(address _address) public view returns(bool) {
        return svcAcct[_address];
    }
    function setServiceAccount(address _address, bool _value) public onlyOwner {
        svcAcct[_address] = _value;
    }
    function setFeeReceiver(address payable _address) public onlyOwner {
        feeReceiver = _address;
    }

    // owner sends themselves the funds
    function releaseFunds() public onlyOwner {
        address payable _owner = payable(owner());
        if(!_owner.send(address(this).balance)) {
            revert("Funds could not be released");
        }
    }

    // Store data from @param json if json is formatted correctly
    function addCalldataStorageEntry(string memory json) public {
        checkFormat(json);
        string memory code = generateRecordCode();
        if (_recordExists(code)) revert("Record already exists");
        processFee();
        calldataStorage[code] = Entry(
            block.timestamp,
            json,
            msg.sender
        );

        // Fire event
        string memory urlToView = string(abi.encodePacked(calldataStorageUrl, code));
        emit CDSShortLinkCreated(block.timestamp, urlToView);
    }

    function _recordExists(string memory code) internal view returns (bool) {
        return calldataStorage[code].timestamp > 0;
    }
    function getRecordTimestamp(string memory code) public view returns (uint256) {
        return calldataStorage[code].timestamp;
    }
    function getCalldataStorageEntry(string memory code) public view returns (string memory) {
        return calldataStorage[code].json;
    }
    function getCalldataStorageSender(string memory code) public view returns (address) {
        return calldataStorage[code].sender;
    }

    // Reverts if not enough fee provided
    function processFee() internal {
        uint256 fee = getConfig("fee");
        if (svcAcct[msg.sender] || (fee == 0)) return; // service account doesn't have to pay fees
        if (msg.value < fee) revert("Fee is higher than amount");
        if (!feeReceiver.send(fee)) revert("Could not send fee to receiver");
    }

    // Checks if provided string has valid format
    function checkFormat(string memory json) internal pure {
        if (!Tools.isValidStorageJson(json)) revert("JSON is invalid");
    }

    /**
    * Generates a string code based on current block timestamp and the signer's address.
    * This is used to prevent collisions if several attempts to store should be made 
    * by different signers within the same block.
    * 
    * This code is used
    * - as a key for a storage entry internally, in this contract
    * - as a part of the URL where the stored data can be viewed by end-users
    */
    function generateRecordCode() internal view returns (string memory) {
        string memory s1 = Tools.toBase36(block.number - getConfig("blockoffset"), 11);
        string memory s2 = Tools.toBase36(uint256(uint160(address(msg.sender))), 2); 
        return string(abi.encodePacked(s1, s2));
    }

    function kill() public onlyOwner {
        // don't selfdestruct if funds can't be taken out 
        // (might happen when owner is a contract with no fallback fn, 
        // or expensive fallback fn, 
        // or fallback fn that throws)
        if (address(this).balance > 0 && !payable(msg.sender).send(address(this).balance)) {
            revert("could not transfer funds");
        }
        // now rest in peace
        selfdestruct(payable(msg.sender));
    }
}