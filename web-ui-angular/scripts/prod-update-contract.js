const fs = require("fs");
const updateEnv = require("./update-contract-info");
const { getDeploymentInfo } = require("../../scripts/last-deployed");

const setAddressInProdEnv = async () => {
  try {
    const network = process.argv[2];
    if (!network) {
      throw "ERROR: Specify the network where the contract is deployed";
    }

    const baseDir = "src/eth-deployments";
    const { contractAddress } = await getDeploymentInfo(
      baseDir,
      network,
      "EthPoster",
      true
    );
    const envPath = "src/environments/environment.prod.ts";
    updateEnv(envPath, contractAddress);
  } catch (e) {
    console.error(e);
  }
};

setAddressInProdEnv();
