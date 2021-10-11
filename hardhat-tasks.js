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
  task("deploy", "Deploys EthPoster", async (taskArgs, hre) => {
    await deploy(hre);
  });

  const { getDeployment } = require("./scripts/last-deployed");
  task(
    "last-deployed",
    "Shows latest deployment of EthPoster and its balance",
    async (taskArgs, hre) => {
      const ethPoster = await getDeployment(hre, "EthPoster", true);
      if (!ethPoster) return;
      console.log("====== Contract EthPoster ======= ");
      console.log("Deployed at: " + colAddrContract(ethPoster.address));
      console.log("Owner: " + colAddrEOA(await ethPoster.owner()));
      console.log("==================================== ");
    }
  );

  task("do-post", "Posts given text")
    .addParam("text", "Text to be posted")
    .setAction(async (taskArgs, hre) => {
      const ethPoster = await getDeployment(hre, "EthPoster");
      const text = taskArgs.text;
      const fee = await ethPoster.fee();
      const tx = await ethPoster.post(text, {
        value: fee,
      });
      console.log("Post TX sent with: ", text);
      await tx.wait();
      console.log("TX mined: ", tx.hash);
    });

  task(
    "do-post-ten-signers",
    "Posts given text ten times, with different accounts"
  ).setAction(async (taskArgs, hre) => {
    const ethPoster = await getDeployment(hre, "EthPoster");
    const baseText = "This is a test of the post functionality - no. ";
    const fee = await ethPoster.fee();
    const signers = (await hre.ethers.getSigners()).slice(0, 10);
    const postings = signers.map(async (signer, idx) => {
      const text = `${baseText}${idx}`;
      const tx = await ethPoster.connect(signer).post(text, {
        value: fee,
      });
      console.log("Post TX sent with: ", text);
      await tx.wait();
      console.log("TX mined: ", tx.hash);
    });
    await Promise.all(postings);
  });

  task("get-post")
    .addParam("txid", "Post transaction id")
    .setAction(async (taskArgs, hre) => {
      const tx = await ethers.provider.getTransaction(taskArgs.txid);
      const EthPoster = await hre.ethers.getContractFactory("EthPoster");
      const postText = EthPoster.interface.decodeFunctionData("post", tx.data);
      console.log(postText[0]);
    });

  const { printPosts } = require("./scripts/posts-from");
  task("get-posts-from")
    .addParam("account", "Account whose posts we query")
    .setAction(async (taskArgs, hre) => {
      await printPosts(hre, taskArgs.account);
    });

  const getReason = require("./scripts/get_reason");
  task("get-reason", async (taskArgs, hre) => {
    await getReason(hre);
  });
};
