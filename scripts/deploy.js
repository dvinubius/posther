require("dotenv").config();
const { colAddrEOA, colAddrContract, colPath } = require("./utils");

module.exports = async function main(hre, contractName) {
  const Factory = await hre.ethers.getContractFactory(contractName);

  console.log("Network: ", hre.network.name);

  console.log(` = = = Deploying ${contractName} = = =\n...`);
  const contract = await Factory.deploy(
    hre.ethers.utils.parseUnits(hre.network.config.fee)
  );
  const chainId = contract.deployTransaction.chainId;
  const receipt = await contract.deployTransaction.wait();
  const { contractAddress, transactionHash, blockNumber } = receipt;

  console.log(
    `${contractName} deployed to: ${colAddrContract(contract.address)}`
  );
  console.log("Owner is ", colAddrEOA(await contract.owner()));
  logDeployment(hre.network.name, contractName, [
    chainId,
    contractAddress,
    blockNumber,
    transactionHash,
  ]);
};

const fs = require("fs");
const logDeployment = async (
  networkName,
  contractName,
  [chainId, contractAddress, blockNumber, txHash]
) => {
  try {
    const entry = { chainId, contractAddress, blockNumber, txHash };

    const dirPath = `my-deployments`;
    fs.mkdirSync(dirPath, { recursive: true }, () => {});
    const filePath = `${dirPath}/${contractName}_deployed.json`;

    const allLogs = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : {};

    if (!allLogs[networkName]) {
      allLogs[networkName] = [];
    }
    allLogs[networkName].push(entry);

    fs.writeFileSync(
      filePath,
      JSON.stringify(allLogs),
      { flag: "w" },
      () => {}
    );
    console.log("Saved deployment info to ", colPath(filePath));
  } catch (err) {
    console.error(err);
  }
};
