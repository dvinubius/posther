const updateEnv = require("./update-angular-env");
const syncAbi = require("./sync-contract-abi.js");
const { getDeploymentInfo } = require("../../scripts/last-deployed");

const setDevEnv = async () => {
  try {
    // get deploymentInfo
    const { contractName } = require("./web3.config");

    const baseDir = "../my-deployments/";
    const { contractAddress, blockNumber, chainId } = await getDeploymentInfo(
      baseDir,
      "ganache",
      contractName,
      true
    );

    // update dev-env
    updateEnv({
      filePath: "./src/environments/environment.ts",
      contractNetwork: "local ganache",
      contractAddress,
      blockNumber,
      defaultProviderUrl: "http://localhost:8545",
      chainId,
      etherscanUrl: "",
    });

    // update contract abi
    syncAbi(contractName);
  } catch (e) {
    console.error(e);
  }
};

setDevEnv();
