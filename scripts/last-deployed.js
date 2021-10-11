const fs = require("fs");

/**
 * Keeping this more flexible in order to be used by frontend projects within a hardhat project
 *
 * @param {*} baseDir
 * @param {*} networkName
 * @param {*} contractName
 * @param {*} verbose
 *
 * @returns {contractAddress, blockNumber, txHash}
 */
const getDeploymentInfo = (
  baseDir,
  networkName,
  contractName,
  verbose = false
) => {
  try {
    const fileData = fs.readFileSync(
      `${baseDir}/${networkName}/${contractName}_deployed.json`,
      { encoding: "utf8", flag: "r" }
    );
    const deployments = JSON.parse(fileData);
    const deploymentInfo = deployments[deployments.length - 1];

    if (verbose) {
      console.log(`Found ${contractName} at: `);
      console.log(deploymentInfo);
    }
    return deploymentInfo;
  } catch (e) {
    console.error("Deployment log retrieval error: ", e);
  }
};

const getDeployment = async (hre, contractName, verbose = false) => {
  try {
    const networkName = await hre.network.name;
    const baseDir = "my-deployments";
    const { contractAddress, blockNumber, txHash } = getDeploymentInfo(
      baseDir,
      networkName,
      contractName,
      verbose
    );
    const contract = await hre.ethers.getContractAt(
      contractName,
      contractAddress
    );
    contract.deployment = { txHash, blockNumber };
    return contract;
  } catch (e) {
    console.error(e);
    console.error("====== No deployment was found");
  }
};

module.exports = {
  getDeployment,
  getDeploymentInfo,
};
