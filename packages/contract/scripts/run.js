const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({ value: hre.ethers.utils.parseEther("0.1") });
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address)

  let waveCount;
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance))

  //  waveを送る
  let waveTxn = await waveContract.wave("A message!")
  await waveTxn.wait(); // トランザクションが承認されるのを待つ（テスト:1回目）

  // const [_, randomPerson] = await hre.ethers.getSigners();
  // waveTxn = await waveContract.connect(randomPerson).wave('Another message!');
  // await waveTxn.wait(); // トランザクションが承認されるのを待つ（テスト:2回目）

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance))

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves)

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