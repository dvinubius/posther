const fs = require("fs");

module.exports = (contractName) => {
  try {
    fs.copyFileSync(
      `../artifacts/contracts/${contractName}.sol/${contractName}.json`,
      "./web3-integration/contract.json"
    );
    console.log("copied contract abi json");
  } catch (err) {
    console.error(err);
  }
};
