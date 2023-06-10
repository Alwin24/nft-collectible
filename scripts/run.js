const hre = require('hardhat')
const { utils } = require('ethers')

async function main() {
	const baseTokenURI = 'ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/'

	// Get owner/deployer's wallet address
	const [owner] = await hre.ethers.getSigners()

	// Deploy contract with the correct constructor arguments
	const contract = await hre.ethers.deployContract('NFTCollectible', [baseTokenURI])

	// Wait for this transaction to be mined
	await contract.waitForDeployment()

	// Get contract address
	console.log('Contract deployed to:', await contract.getAddress())

	// Reserve NFTs
	let txn = await contract.reserveNFTs()
	await txn.wait()
	console.log('10 NFTs have been reserved')

	// Mint 3 NFTs by sending 0.03 ether
	txn = await contract.mintNFTs(3, { value: hre.ethers.parseEther('0.03') })
	await txn.wait()

	// Get all token IDs of the owner
	let tokens = await contract.tokensOfOwner(owner.address)
	console.log('Owner has tokens: ', tokens)
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
