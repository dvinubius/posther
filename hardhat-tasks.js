const { task } = require("hardhat/config");

const {
  colTX,
  colAmt,
  colAddrContract,
  colAddrEOA,
  printBalance,
} = require("./scripts/utils");

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

  const deploy = require("./scripts/deploy");
  task("deploy", "Deploys PosterMinGas", async (taskArgs, hre) => {
    await deploy(hre);
  });

  const getDeployment = require("./scripts/last-deployed");
  task(
    "last-deployed",
    "Shows latest deployment of PosterMinGas and its balance",
    async (taskArgs, hre) => {
      const poster = await getDeployment(hre, "PosterMinGas", true);
      if (!poster) return;
      console.log("====== Contract PosterMinGas ======= ");
      console.log("Deployed at: " + colAddrContract(poster.address));
      console.log("Owner: " + colAddrEOA(await poster.owner()));
      console.log("==================================== ");
    }
  );

  task("post", "Posts given text")
    .addParam("text", "Text to be posted")
    .setAction(async (taskArgs, hre) => {
      const poster = await getDeployment(hre, "PosterMinGas");
      const text = taskArgs.text;
      const fee = await poster.fee();
      const tx = await poster.post(text, {
        value: fee,
      });
      console.log("Post TX sent with: ", text);
      await tx.wait();
      console.log("TX mined: ", tx.hash);
    });

  task("post-of-tx")
    .addParam("txid", "Post transaction id")
    .setAction(async (taskArgs, hre) => {
      const tx = await ethers.provider.getTransaction(taskArgs.txid);
      const PosterMinGas = await hre.ethers.getContractFactory("PosterMinGas");
      const postText = PosterMinGas.interface.decodeFunctionData(
        "post",
        tx.data
      );
      console.log(postText[0]);
    });

  const { printPosts } = require("./scripts/scan-posts");
  task("posts-from")
    .addParam("account", "Account whose posts we query")
    .setAction(async (taskArgs, hre) => {
      await printPosts(hre, taskArgs.account);
    });
};
