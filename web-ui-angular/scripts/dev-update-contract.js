const fs = require("fs");
const updateEnv = require("./update-contract-info");
const providers = require("../providers");

const update = () => {
  // get deploymentInfo
  const deployments = JSON.parse(
    fs.readFileSync("./eth/deployed/ganache/EthPoster_deployed.json").toString()
  );
  const lastDeployment = deployments[deployments.length - 1];
  const { contractAddress, blockNumber, chainId } = lastDeployment;
  console.log("Contract Address: ", contractAddress);
  // update dev-env
  const envPath = "./src/environments/environment.ts";
  const providerUrl = providers[chainId];
  updateEnv(envPath, contractAddress, blockNumber, providerUrl);
};

update();
