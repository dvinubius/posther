const utils = require("./utils");
const getDeployment = require("./last-deployed");

const getPosts = async (hre, account) => {
  const provider = hre.ethers.provider;
  let latestBlockNo = await provider.getBlockNumber(); // most recent block
  const ethPoster = await getDeployment(hre, "EthPoster");
  const contractAddr = ethPoster.address;
  const deploymentBlockNo = +ethPoster.deployment.blockNumber;

  console.log("Retrieving post transactions... ");
  // imperatively: speed over style
  const parsedPostTxs = [];
  for (let i = deploymentBlockNo; i <= latestBlockNo; i++) {
    const block = await hre.ethers.provider.getBlockWithTransactions(i);
    block.transactions.forEach((tx) => {
      const isCandidate = tx.to === contractAddr && tx.from === account;
      if (!isCandidate) return;
      const parsedTx = ethPoster.interface.parseTransaction({
        data: tx.data,
        value: tx.value,
      });
      if (parsedTx.functionFragment.name === "post")
        parsedPostTxs.push({
          ...parsedTx,
          blockNumber: i,
          timestamp: block.timestamp,
        });
    });
  }
  return parsedPostTxs;
};

module.exports = {
  /**
   * Returns the parsed transactions of posts made by account
   */
  getPosts: getPosts,
  /**
   * Prints all posts made by account
   */
  printPosts: async (hre, account) => {
    const posts = await getPosts(hre, account);
    const printables = posts.map((parsedTx) => ({
      post: parsedTx.args[0],
      date: new Date(parsedTx.timestamp).toLocaleString(),
    }));
    console.table(printables);
  },
};
