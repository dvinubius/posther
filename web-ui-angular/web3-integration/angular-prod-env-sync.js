const updateEnv = require("./update-angular-env");
const { getDeploymentInfo } = require("../../scripts/last-deployed");
const syncAbi = require("./sync-contract-abi.js");
const fs = require("fs");

const getProviderUrl = (networkName) => {
  try {
    const envFile = fs.readFileSync(`../.env`).toString();
    const m = `PROVIDER_URL_${networkName.toUpperCase()}`;
    const providerLine = envFile.split("\n").find((l) => l.includes(m));
    const equalsIdx = providerLine.indexOf("=");
    return providerLine.substr(equalsIdx + 1);
  } catch (e) {
    console.error(e);
  }
};

const setProdEnv = async () => {
  try {
    // get deployment info
    const {
      contractNetwork,
      chainId,
      etherscanUrl,
      contractName,
    } = require("./web3.config");
    const baseDir = "../my-deployments/";
    const { contractAddress, blockNumber } = await getDeploymentInfo(
      baseDir,
      contractNetwork,
      contractName,
      true
    );

    const defaultProviderUrl =
      getProviderUrl(contractNetwork) || "https://cloudflare-eth.com/";

    // update prod env
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

    // update contract abi
    syncAbi(contractName);
  } catch (e) {
    console.error(e);
  }
};

setProdEnv();
