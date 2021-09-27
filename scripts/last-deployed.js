const utils = require("./utils");
const fs = require("fs");
module.exports = async function getLatestDeployment(
  hre,
  contractName,
  verbose = false
) {
  const networkName = await hre.network.name;
  try {
    const fileData = fs.readFileSync(
      `artifacts/contracts/deployed/${networkName}/${contractName}.txt`,
      { encoding: "utf8", flag: "r" }
    );
    const lines = fileData.substr(0, fileData.length - 1).split("\n");
    const lastLine = lines[lines.length - 1];
    const [address, blockNumber, hash] = lastLine.split(";");
    if (verbose) {
      console.log(
        `Found ${contractName} at: ${utils.colAddrContract(address)}`
      );
    }
    const contract = await hre.ethers.getContractAt(contractName, address);
    return {
      ...contract,
      deployment: { hash, blockNumber },
    };
  } catch (e) {
    console.error(e);
    console.log("No deployment was found");
  }
};
