require("dotenv").config();
const { colAddrEOA, colAddrContract, colPath } = require("./utils");

module.exports = async function main(hre) {
  const EthPoster = await hre.ethers.getContractFactory("EthPoster");

  console.log("Network: ", hre.network.name);

  console.log(" = = = Deploying EthPoster ...");
  const ethPoster = await EthPoster.deploy(
    hre.ethers.utils.parseUnits(hre.network.config.fee)
  );
  const ctrct = await ethPoster.deployed();
  const { creates, hash, blockNumber, chainId } = ctrct.deployTransaction;

  console.log("EthPoster deployed to:", colAddrContract(ethPoster.address));
  console.log("Owner is ", colAddrEOA(await ethPoster.owner()));
  logDeployment(hre.network.name, "EthPoster", [
    chainId,
    creates,
    blockNumber,
    hash,
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

    // const dirPath = `artifacts/contracts/deployed/${networkName}`; // would have made more sense, but files on this path are deleted when running npx hardhat console
    const dirPath = `my-deployments/${networkName}`;
    fs.mkdirSync(dirPath, { recursive: true }, () => {});
    const filePath = `${dirPath}/${contractName}_deployed.json`;
    const allLogs = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath))
      : [];
    allLogs.push(entry);

    fs.writeFileSync(
      filePath,
      JSON.stringify(allLogs),
      { flag: "w" },
      () => {}
    );
    console.log("Saved deployment address to ", colPath(filePath));
  } catch (err) {
    console.error(err);
  }
};
