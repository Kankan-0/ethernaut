const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("King", () => {
  before(async function () {
    this.KingFactory = await ethers.getContractFactory("King");
    [owner, attacker, user] = await ethers.getSigners();
    (this.owner = owner), (this.user = user), (this.attacker = attacker);
  });

  beforeEach(async function () {
    this.kingContract = await this.KingFactory.deploy({
      value: ethers.utils.parseEther("1"),
    });
    await this.kingContract.deployed();
  });

  it("Initially owner should be the king, and anyone should be able to be the king", async function () {
    expect(await this.kingContract.owner()).to.equal(this.owner.address);
    expect(await this.kingContract._king()).to.equal(this.owner.address);

    // user should be able to be the king
    await this.user.sendTransaction({
      to: this.kingContract.address,
      value: ethers.utils.parseEther("2"),
    });

    expect(await this.kingContract._king()).to.equal(this.user.address);
  });

  it("After the attack no one should be able to be the king", async function () {
    expect(await this.kingContract._king()).to.not.equal(this.attacker.address);

    const KingExploitFactory = await ethers.getContractFactory("KingExploit");
    let kingExploitContract = await KingExploitFactory.deploy(
      this.kingContract.address
    );
    await kingExploitContract.deployed();
    kingExploitContract = await kingExploitContract.connect(this.attacker);

    //make the exploit contract the king.
    await kingExploitContract.beKing({ value: ethers.utils.parseEther("2") });
    expect(await this.kingContract._king()).to.equal(
      kingExploitContract.address
    );

    //after the attack other should not be able to be the king
    await expect(
      this.user.sendTransaction({
        to: this.kingContract.address,
        value: ethers.utils.parseEther("3"),
      })
    ).to.be.reverted;
  });
});
