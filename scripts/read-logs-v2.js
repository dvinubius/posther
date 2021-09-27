const hre = require("hardhat");

async function main() {
  await hre.run("compile");

  console.log("Signers");
  console.log((await hre.ethers.getSigners()).map((s) => s.address));
  console.log("Connected on ");
  console.log(await hre.ethers.provider._networkPromise);

  const currentBlock = (await hre.ethers.provider.getBlock()).number;
  const filter = {
    address: process.env.DEPLOYMENT_ADDRESS_ON_KOVAN,
    fromBlock: 0,
    toBlock: currentBlock,
    topics: [hre.ethers.utils.id("PostCreated(uint256,string)")],
  };
  console.log("Retrieving logs... ");
  const logs = await hre.ethers.provider.getLogs(filter);
  console.log("Retrieved ", logs.length);
  logs.forEach((log) => {
    console.log("block: ", log.blockNumber);
    console.log("logIndex: ", log.logIndex);
    console.log("Data");
    console.log(
      hre.ethers.utils.defaultAbiCoder.decode(["uint256", "string"], log.data)
    );
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
