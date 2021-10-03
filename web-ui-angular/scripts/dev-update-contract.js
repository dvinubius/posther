const fs = require("fs");
const updateEnv = require("./update-contract-info");

const update = () => {
  // get deploymentInfo
  const deployments = JSON.parse(
    fs.readFileSync("./eth/deployed/ganache/EthPoster_deployed.json").toString()
  );
  const lastDeployment = deployments[deployments.length - 1];
  const { contractAddress, blockNumber } = lastDeployment;
  console.log("Contract Address: ", contractAddress);
  // update dev-env
  const envPath = "./src/environments/environment.ts";
  updateEnv(envPath, contractAddress, blockNumber);
};

update();
