const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Force", () => {
  before(async function () {
    this.ForceFactory = await ethers.getContractFactory("Force");
    this.ForceExploitFactory = await ethers.getContractFactory("ForceExploit");
    [owner, attacker] = await ethers.getSigners();
    (this.owner = owner), (this.attacker = attacker);
  });

  beforeEach(async function () {
    this.forceContract = await this.ForceFactory.deploy();
    await this.forceContract.deployed();
    this.forceExploitContract = await this.ForceExploitFactory.deploy(
      this.forceContract.address
    );
    await this.forceExploitContract.deployed();
  });

  it("Contract should have 0 balance initially", async function () {
    expect(
      await ethers.provider.getBalance(this.forceContract.address)
    ).to.equal(0);
  });

  it("Should be able to send ethers forcefully", async function () {
    await this.forceExploitContract.suicide({
      value: ethers.utils.parseEther("1"),
    });
    expect(
      await ethers.provider.getBalance(this.forceContract.address)
    ).to.not.equal(0);
  });
});
