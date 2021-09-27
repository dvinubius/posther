require("dotenv").config();
const { colAddrEOA, colAddrContract, colPath } = require("./utils");

module.exports = async function main(hre) {
  const Poster = await hre.ethers.getContractFactory("PosterMinGas");

  console.log("Network: ", hre.network.name);

  console.log(" = = = Deploying PosterMinGas ...");
  const poster = await Poster.deploy(
    hre.ethers.utils.parseUnits(hre.network.config.fee)
  );
  const ctrct = await poster.deployed();
  const { creates, hash, blockNumber } = ctrct.deployTransaction;

  console.log("PosterMinGas deployed to:", colAddrContract(poster.address));
  console.log("Owner is ", colAddrEOA(await poster.owner()));
  logDeployment(hre.network.name, "PosterMinGas", [creates, blockNumber, hash]);
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
