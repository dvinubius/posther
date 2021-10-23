const { task } = require("hardhat/config");

const { colAddrContract, colAddrEOA } = require("../scripts/utils");

module.exports = () => {
  task(
    "accounts",
    "Prints the list of accounts and their balances",
    async (taskArgs, hre) => {
      const accounts = await hre.ethers.getSigners();
      const balances = [];
      for (const acc of accounts) {
        balances.push(await hre.ethers.provider.getBalance(acc.address));
      }
      const printBal = (balance) => hre.ethers.utils.formatEther(balance);

      const all = [];
      for (let i = 0; i < accounts.length; i++) {
        const addr = accounts[i].address;
        const bal = await hre.ethers.provider.getBalance(addr);
        all.push({ address: addr, balance: printBal(bal) });
      }
      console.table(all);
    }
  );

  const deploy = require("../scripts/deploy");
  task("deploy", "Deploys given contract")
    .addParam("contract", "Name of the contract")
    .setAction(async (taskArgs, hre) => {
      await deploy(hre, taskArgs.contract);
    });

  const { getDeployment } = require("../scripts/last-deployed");
  task("last-deployed", "Shows latest deployment of EthPoster and its balance")
    .addParam("contract", "Name of the contract")
    .setAction(async (taskArgs, hre) => {
      const contractName = taskArgs.contract;
      const contract = await getDeployment(hre, contractName, true);
      if (!contract) return;
      console.log(`= = = Contract ${contractName} = = =`);
      console.log("Deployed at: " + colAddrContract(contract.address));
      console.log("Owner: " + colAddrEOA(await contract.owner()));
    });

  const getReason = require("../scripts/get_revert_reason");
  task("get-revert-reason", async (taskArgs, hre) => {
    await getReason(hre);
  });
};
