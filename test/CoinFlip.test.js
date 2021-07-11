const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CoinFlip", () => {
  before(async function () {
    this.CoinFlipFactory = await ethers.getContractFactory("CoinFlip");
    this.CoinFlipExploitFactory = await ethers.getContractFactory(
      "CoinFlipExploit"
    );
  });
  beforeEach(async function () {
    this.coinFlipContract = await this.CoinFlipFactory.deploy();
    await this.coinFlipContract.deployed();
    this.coinFlipExploitContract = await this.CoinFlipExploitFactory.deploy(
      this.coinFlipContract.address
    );
    await this.coinFlipExploitContract.deployed();
  });

  it("Should not be completed initially", async function () {
    expect(await this.coinFlipContract.isComplete()).to.equal(false);
  });

  it("Should be able to exploit and guess 10times correctly", async function () {
    let i = 10;
    while (i--) {
      await this.coinFlipExploitContract.flip();
    }

    expect(await this.coinFlipContract.isComplete()).to.equal(true);
  });
});
