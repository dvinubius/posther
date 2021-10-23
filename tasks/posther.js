const { task } = require("hardhat/config");

module.exports = () => {
  const { getDeployment } = require("../scripts/last-deployed");
  const contractName = "Posther";

  task("do-post", "Posts given text")
    .addParam("text", "Text to be posted")
    .setAction(async (taskArgs, hre) => {
      const contract = await getDeployment(hre, contractName);
      const text = taskArgs.text;
      const fee = await contract.fee();
      const tx = await contract.post(text, {
        value: fee,
      });
      console.log("Post TX sent with: ", text);
      await tx.wait();
      console.log("TX mined: ", tx.hash);
    });

  const { lipsumParagraphs } = require("../scripts/utils");
  task(
    "do-post-ten",
    "Posts given text ten times, with different accounts"
  ).setAction(async (taskArgs, hre) => {
    const contract = await getDeployment(hre, contractName);
    const fee = await contract.fee();
    const signers = (await hre.ethers.getSigners()).slice(0, 10);
    const postings = signers.map(async (signer) => {
      const text = lipsumParagraphs(7);
      const tx = await contract.connect(signer).post(text, {
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
      const Factory = await hre.ethers.getContractFactory(contractName);
      const postText = Factory.interface.decodeFunctionData("post", tx.data);
      console.log(postText[0]);
    });

  const { printPosts } = require("../scripts/posts-from");
  task("get-posts-from")
    .addParam("account", "Account whose posts we query")
    .setAction(async (taskArgs, hre) => {
      await printPosts(hre, taskArgs.account);
    });
};
