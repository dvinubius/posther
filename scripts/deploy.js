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
  const { creates, hash, blockNumber } = ctrct.deployTransaction;

  console.log("EthPoster deployed to:", colAddrContract(ethPoster.address));
  console.log("Owner is ", colAddrEOA(await ethPoster.owner()));
  logDeployment(hre.network.name, "EthPoster", [creates, blockNumber, hash]);
};

const fs = require("fs");
const logDeployment = async (
  networkName,
  contractName,
  [contractAddress, blockNumber, txHash]
) => {
  try {
    const dirPath = `artifacts/contracts/deployed/${networkName}`;
    fs.mkdirSync(dirPath, { recursive: true }, () => {});
    const filePath = `${dirPath}/${contractName}.txt`;
    fs.writeFileSync(
      filePath,
      `${contractAddress};${blockNumber};${txHash}\n`,
      { flag: "a+" },
      () => {}
    );
    console.log("Saved deployment address to ", colPath(filePath));
  } catch (err) {
    console.error(err);
  }
};
