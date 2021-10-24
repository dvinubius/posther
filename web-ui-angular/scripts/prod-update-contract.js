const updateEnv = require("./update-contract-info");

const { getDeploymentInfo } = require("../../scripts/last-deployed");
const getProviderUrl = require("./get-provider");

const setProdEnv = async () => {
  try {
    const {
      contractNetwork,
      chainId,
      etherscanUrl,
      contractName,
    } = require("./prod-deployment.config");
    const baseDir = "./eth/deployed";
    const { contractAddress, blockNumber } = await getDeploymentInfo(
      baseDir,
      contractNetwork,
      contractName,
      true
    );

    const defaultProviderUrl = getProviderUrl(contractNetwork);
    const filePath = "src/environments/environment.prod.ts";
    updateEnv({
      filePath,
      contractNetwork,
      contractAddress,
      blockNumber,
      defaultProviderUrl,
      chainId,
      etherscanUrl,
    });
  } catch (e) {
    console.error(e);
  }
};

setProdEnv();
