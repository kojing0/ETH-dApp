const main = async () => {
  const [owner, randomPerson1, randomPerson2] = await hre.ethers.getSigners()
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const WavePortal = await waveContract.deployed();

  console.log("Contract deployed to:", WavePortal.address)
  console.log("Contract deployed by:", owner.address)

  let WaveCount;
  WaveCount = await waveContract.getTotalWaves();

  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  waveTxn = await waveContract.connect(randomPerson1).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  console.log(randomPerson2.address);
}

const runMain = async () => {
  try {
    await main()
    process.exit(0);
  } catch (error) {
    console.log(error)
    process.exit(1);
  }
}

runMain();