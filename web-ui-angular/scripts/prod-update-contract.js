const fs = require("fs");
const updateEnv = require("./update-contract-info");
const providerUrls = require("../providers");
const { getDeploymentInfo } = require("../../scripts/last-deployed");
const getDefaultProviderUrl = require("./default-provider-url");

const setProdEnv = async () => {
  try {
    const network = process.argv[2];
    if (!network) {
      throw "ERROR: Specify the network where the contract is deployed";
    }

    const baseDir = "src/eth-deployments";
    const { contractAddress, blockNumber } = await getDeploymentInfo(
      baseDir,
      network,
      "EthPoster",
      true
    );
    const envPath = "src/environments/environment.prod.ts";
    const providerUrl = providerUrls[network.id];
    updateEnv(envPath, contractAddress, blockNumber, providerUrl);
  } catch (e) {
    console.error(e);
  }
};

setProdEnv();
