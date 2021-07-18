const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Elevator", () => {
  before(async function () {
    this.ElevatorFactory = await ethers.getContractFactory("Elevator");
  });
  beforeEach(async function () {
    this.elevatorContract = await this.ElevatorFactory.deploy();
    await this.elevatorContract.deployed();
  });

  it("Initially elevator should not be at the top", async function () {
    expect(await this.elevatorContract.top()).to.equal(false);
  });
  it("Attacker should be able to get to the top", async function () {
    const ElevatorExploitFactory = await ethers.getContractFactory(
      "ElevatorExploit"
    );
    let ElevatorExploitContract = await ElevatorExploitFactory.deploy(
      this.elevatorContract.address
    );
    await ElevatorExploitContract.deployed();
    const attacker = await ethers.getSigner(1);
    ElevatorExploitContract = ElevatorExploitContract.connect(attacker);

    expect(await this.elevatorContract.top()).to.equal(false);
    await ElevatorExploitContract.goTo(10);

    expect(await this.elevatorContract.top()).to.equal(true);
  });
});
