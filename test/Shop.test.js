const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Shop", () => {
  before(async function () {
    this.ShopFactory = await ethers.getContractFactory("Shop");
  });

  beforeEach(async function () {
    this.shopContract = await this.ShopFactory.deploy();
    await this.shopContract.deployed();
  });

  it("Item should be unsold initially", async function () {
    expect(await this.shopContract.isSold()).to.equal(false);
  });

  it("Attacker should be able to get the item at a lower price", async function () {
    // deploy the exploit
    const ShopExploitFactory = await ethers.getContractFactory("ShopExploit");
    let shopExploitContract = await ShopExploitFactory.deploy(
      this.shopContract.address
    );
    await shopExploitContract.deployed();
    const attacker = await ethers.getSigner(1);
    shopExploitContract = await shopExploitContract.connect(attacker);
    await shopExploitContract.buy();
    expect(await this.shopContract.isSold()).to.equal(true);
  });
});
