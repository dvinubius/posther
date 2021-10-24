const fs = require("fs");
const updateEnv = require("./update-contract-info");

const update = () => {
  // get deploymentInfo
  const { contractName } = require("./prod-deployment.config");

  const deployments = JSON.parse(
    fs
      .readFileSync(`./eth/deployed/ganache/${contractName}_deployed.json`)
      .toString()
  );
  const lastDeployment = deployments[deployments.length - 1];
  const { contractAddress, blockNumber, chainId } = lastDeployment;
  console.log("Contract Address: ", contractAddress);
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
};

update();
