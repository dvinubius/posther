module.exports = async function getReason(hre) {
  const hash = "";
  const tx = await hre.ethers.provider.getTransaction(hash);
  const minedTx = await tx;
  const blockNumber = minedTx.blockNumber;

  const provider = new hre.ethers.providers.JsonRpcProvider("");

  const getRevertReason = require("eth-revert-reason");

  try {
    // NOTE: The await is intentional in order for the catch to work
    return await provider.call(tx, blockNumber);
  } catch (err) {
    console.log("------- COMPLETE ERROR ----------");
    console.log(err);
    console.log("------- ERROR RESPONSE TEXT ----------");
    console.log(err.data);
    // return JSON.parse(err.responseText).error.data.substr(9)
  }
};
