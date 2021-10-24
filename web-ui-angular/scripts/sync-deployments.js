const fs = require("fs");
const ncp = require("ncp").ncp;
ncp.limit = 3;

fs.mkdirSync(`./eth/deployed`, { recursive: true }, () => {});

ncp("../my-deployments/", "./eth/deployed/", function (err) {
  if (err) return console.error(err);
  console.log("copied deployment info");
});

const { contractName } = require("./prod-deployment.config");

try {
  fs.copyFileSync(
    `../artifacts/contracts/${contractName}.sol/${contractName}.json`,
    "./eth/deployed/contract.json"
  );
  console.log("copied contract abi json");
} catch (err) {
  console.error(err);
}
