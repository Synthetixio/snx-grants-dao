const { BN } = require('@openzeppelin/test-helpers')
const GrantsDAO = artifacts.require('GrantsDAO')
const MockToken = artifacts.require('MockToken')

module.exports = async (deployer, network, accounts) => {
  const tokenName = 'Synthetix Network Token'
  const tokenSymbol = 'SNX'
  const tokenDecimals = new BN(18)
  const tokenInitialSupply = web3.utils.toWei('1000')
  const toPass = new BN(4)
  const teamMembers = [accounts[1], accounts[2]]
  const communityMembers = [accounts[3], accounts[4], accounts[5]]
  await deployer.deploy(
    MockToken,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    tokenInitialSupply,
  )

  await deployer.deploy(
    GrantsDAO,
    MockToken.address,
    teamMembers,
    communityMembers,
    toPass,
  )

  deployedInstance = await GrantsDAO.deployed()
  deployedToken = await MockToken.deployed()
  await deployedToken.transfer(GrantsDAO.address, web3.utils.toWei("1000"))
  await deployedInstance.createProposal(accounts[0], web3.utils.toWei("50"), {from: accounts[1]})
  console.log("Test Data Injected")
}
