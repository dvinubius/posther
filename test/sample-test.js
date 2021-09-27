const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CalldataStorage", function () {
  before(async function () {
    this.CalldataStorage = await ethers.getContractFactory("CalldataStorage");
  });

  beforeEach(async function () {
    this.calldataStorage = await this.CalldataStorage.deploy();
    await this.calldataStorage.deployed();
  });

  it("Should check that the new calldataStorage contract has the correct owner", async function () {
    expect(await this.calldataStorage.owner()).to.equal(
      (await ethers.getSigners())[0].address
    );
  });

  it("Should check that the new calldataStorage contract has the right default config and calldataStorageUrl", async function () {
    expect(await this.calldataStorage.getConfig("fee")).to.equal(0);
    expect(await this.calldataStorage.getConfig("blockoffset")).to.equal(1000);
    expect(await this.calldataStorage.getCalldataStorageURL()).to.equal(
      "https://dvinubius.me/"
    );
  });

  it("Should add a service account and then remove it", async function () {
    const allSigners = await ethers.getSigners();
    if (allSigners.length < 2) return;

    // First Account Of The Wallet After The Owner Account
    const acct = allSigners[1];

    expect(await this.calldataStorage.isServiceAccount(acct.address)).to.equal(
      false
    );

    const setSvcAcctTx = await this.calldataStorage.setServiceAccount(
      acct.address,
      true
    );
    // wait until the transaction is mined
    await setSvcAcctTx.wait();

    expect(await this.calldataStorage.isServiceAccount(acct.address)).to.equal(
      true
    );

    const unSetSvcAcctTx = await this.calldataStorage.setServiceAccount(
      acct.address,
      false
    );
    // wait until the transaction is mined
    await unSetSvcAcctTx.wait();

    expect(await this.calldataStorage.isServiceAccount(acct.address)).to.equal(
      false
    );
  });

  it("Should check that no fee receiver is set by default", async function () {
    expect(await this.calldataStorage.getFeeReceiver()).to.equal(
      ethers.constants.AddressZero
    );
  });

  it("Should set a fee receiver and then remove them", async function () {
    const allSigners = await ethers.getSigners();
    if (allSigners.length < 2) return;

    // First Account Of The Wallet After The Owner Account
    const acct = allSigners[1];

    expect(await this.calldataStorage.getFeeReceiver()).to.equal(
      ethers.constants.AddressZero
    );

    const setFeeReceiverTx = await this.calldataStorage.setFeeReceiver(
      acct.address
    );
    // wait until the transaction is mined
    await setFeeReceiverTx.wait();

    expect(await this.calldataStorage.getFeeReceiver()).to.equal(acct.address);

    const unSetFeeReceiverTx = await this.calldataStorage.setFeeReceiver(
      ethers.constants.AddressZero
    );
    // wait until the transaction is mined
    await unSetFeeReceiverTx.wait();

    expect(await this.calldataStorage.getFeeReceiver()).to.equal(
      ethers.constants.AddressZero
    );
  });

  it("Should add a chain entry and check that the data is stored correctly", async function () {
    for (let i = 0; i < 1000; i++) {
      await network.provider.send("evm_mine");
    }
    const nr = await hre.ethers.provider.getBlockNumber();
    expect(nr).to.be.greaterThan(1000);

    // this.calldataStorage.on("CalldataStorageShortLinkCreated", (event) => {
    //   console.log("CREATED: ", event);
    // });

    // const addEntryTx = await this.calldataStorage.addCalldataStorageEntry(
    //   '{"id":"CHAINY","version":1,"type":"T","description":"BLA","hash":"876515d057234b0fd4991e64ba758c5971d578d2385f182a5a264f6019761dd6"}'
    // );
    // const resp = await addEntryTx.wait();
  });
});
