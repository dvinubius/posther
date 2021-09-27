const hre = require("hardhat");

async function main() {
  await hre.run("compile");

  console.log("Signers");
  console.log((await hre.ethers.getSigners()).map((s) => s.address));

  console.log("Connected on ");
  console.log(await hre.ethers.provider._networkPromise);

  const cdStorage = await hre.ethers.getContractAt(
    "CDStorage",
    process.env.DEPLOYMENT_ADDRESS_ON_KOVAN,
    hre.ethers.getSigners()[0]
  );

  const textToStore = process.argv[2];

  // listen for event
  const filter = {
    address: process.env.DEPLOYMENT_ADDRESS_ON_KOVAN,
    topics: [
      // the name of the event, parnetheses containing the data type of each event, no spaces
      hre.ethers.utils.id("PostCreated(uint256,string)"),
    ],
  };
  hre.ethers.provider.on(filter, async (ret) => {
    console.log("PostCreated with data: ");
    console.log(
      hre.ethers.utils.defaultAbiCoder.decode(["uint256", "string"], ret.data)
    );
  });

  const tx = await cdStorage.addCalldataStorageEntry(
    `{"id":"CDS", "text": "${textToStore}"}`
  );
  console.log("TX sent with message: ", textToStore);
  await tx.wait();
  console.log("TX mined: ", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
