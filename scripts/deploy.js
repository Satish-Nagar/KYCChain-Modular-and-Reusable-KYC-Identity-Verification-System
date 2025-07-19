const hre = require("hardhat");

async function main() {
  const KYCChain = await hre.ethers.getContractFactory("KYCChain");
  const kycChain = await KYCChain.deploy();
  await kycChain.deployed();

  console.log("KYCChain deployed to:", kycChain.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
