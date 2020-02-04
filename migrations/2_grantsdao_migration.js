const { BN } = require('@openzeppelin/test-helpers')
const GrantsDAO = artifacts.require('GrantsDAO')
const MockToken = artifacts.require('MockToken')

module.exports = async (deployer, network, accounts) => {
  const tokenName = 'Synthetix Network Token'
  const tokenSymbol = 'SNX'
  const tokenDecimals = new BN(18)
  const tokenInitialSupply = web3.utils.toWei('1000')
  const toPass = new BN(4)

  var teamMembers;
  var communityMembers;

  //All Non main network deployments
  if (network == "main") {
    //Define team members and community members

    //Use SNX mainnet token
    var tokenAddress = "0xc011a72400e58ecd99ee497cf89e3775d4bd732f"

    await deployer.deploy(
      GrantsDAO,
      tokenAddress,
      teamMembers,
      communityMembers,
      toPass,
    )

  } else {
    //All other deployments
    if (network == "dev") {
      teamMembers = [accounts[1], accounts[2]]
      communityMembers = [accounts[3], accounts[4], accounts[5]]
    } else {
      //TODO Inject real accounts
      teamMembers = [accounts[1], accounts[2]]
      communityMembers = [accounts[3], accounts[4], accounts[5]]
    }
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

    if (network == "dev") {
      //Inject mock data for easier testing
      deployedInstance = await GrantsDAO.deployed()
      deployedToken = await MockToken.deployed()
      await deployedToken.transfer(GrantsDAO.address, web3.utils.toWei("1000"))
      await deployedInstance.createProposal(accounts[0], web3.utils.toWei("50"), "Example Proposal", "testurl.com", { from: accounts[1] })
      //await deployedInstance.voteProposal(1, true, {from: accounts[2]})
      console.log("Test Data Injected")
    }

  }
}
