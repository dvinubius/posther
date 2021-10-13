
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * The contract allows users to post text and have it permanently persisted on ethereum,
 * but without persisting it in the actual storage.
 * This is a minimum-gas solution, difficult to use for a front-end, but showcasing how 
 * you would rely on calldata alone for storing posts, with 
 * - minimal storage
 * - no events
 * 
 * The contract is completely agnostic of front-end specifics.
 * Users (front-ends) need to keep track of successful post transactions and the ids.
 * The posts themselves and the associated poster accounts are the only data stored
 * immutably on-chain. The rest is up to the fron-end developer.
 *
 * Posts are kept in the calldata of the post transactions and can be retrieved
 * later from there. The contract only stores the blockNumber and the address of
 * the account that makes a particular post. Due to the funcional limitation mentioned
 * above, having the block number and the address makes it possible to identify the
 * transaction and hence the calldata that contains the posted text.
 *
 * 
 * This contract can be configured to take fees from posters.
 */
contract EthPoster is Ownable {

    // Registered service accounts
    mapping (address => bool) private svcAcct;

    // Storage viewer URL
    string public viewerUrl;

    // Who receives the posting fees
    address payable private feeReceiver;
    uint256 public fee;

    constructor(uint256 _fee) {
        setFee(_fee);
        setFeeReceiver(payable(msg.sender)); // the owner and contract creator
    }

    function setFee(uint256 _value) public onlyOwner {
        fee = _value;
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

    function post(string memory text) public payable {
        text = "";
        processFee();
    }

    // Reverts if payment is less than the fee
    function processFee() internal {
        if (svcAcct[msg.sender] || (fee == 0)) return; // service account doesn't have to pay fees
        if (msg.value < fee) revert("Fee is higher than amount");
        if (!feeReceiver.send(fee)) revert("Could not send fee to receiver");
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