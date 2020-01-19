const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers')

contract('GrantsDAO', (accounts) => {
  const GrantsDAO = artifacts.require('GrantsDAO')
  const SNXToken = artifacts.require('MockToken')

  const defaultAccount = accounts[0]
  const teamSigner1 = accounts[1]
  const teamSigner2 = accounts[2]
  const communitySigner1 = accounts[3]
  const communitySigner2 = accounts[4]
  const communitySigner3 = accounts[5]
  const stranger = accounts[6]
  const teamSigners = [teamSigner1, teamSigner2]
  const communitySigners = [communitySigner1, communitySigner2, communitySigner3]

  const oneToken = web3.utils.toWei('1')
  const tokenName = 'Synthetix Network Token'
  const tokenSymbol = 'SNX'
  const tokenDecimals = new BN(18)
  const tokenInitialSupply = web3.utils.toWei('1000')

  let dao, snx

  beforeEach(async () => {
    snx = await SNXToken.new(
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenInitialSupply,
      { from: defaultAccount },
    )
    dao = await GrantsDAO.new(
      snx.address,
      teamSigners,
      communitySigners,
      { from: defaultAccount },
    )
  })

  describe('constructor', () => {
    it('deploys with the specified addresses as signers', async () => {
      teamSigners.forEach(async s => assert.isTrue(await dao.teamSigners.call(s)))
      communitySigners.forEach(async s => assert.isTrue(await dao.communitySigners.call(s)))
    })

    it('deploys with the specified token address', async () => {
      assert.equal(snx.address, await dao.SNX.call())
    })
  })

  describe('createProposal', () => {
    context('when called by a stranger', () => {
      it('reverts', async () => {
        await expectRevert(
          dao.createProposal(oneToken, { from: stranger }),
          'Not proposer',
        )
      })
    })

    context('when called by a proposer', () => {
      context('and the DAO is not funded', () => {
        it('reverts', async () => {
          await expectRevert(
            dao.createProposal(oneToken, { from: teamSigner1 }),
            'Invalid funds on DAO',
          )
        })
      })

      context('and the DAO is funded', () => {
        beforeEach(async () => {
          await snx.transfer(dao.address, oneToken, { from: defaultAccount })
        })

        it('emits the NewProposal event', async () => {
          const tx = await dao.createProposal(oneToken, { from: teamSigner1 })
          expectEvent(tx.receipt, 'NewProposal', {
            amount: oneToken,
          })
        })

        it('creates a proposal', async () => {
          await dao.createProposal(oneToken, { from: teamSigner1 })
          const proposal = await dao.proposals(1)
          assert.isFalse(proposal.active)
          assert.equal(oneToken.toString(), proposal.amount.toString())
        })
      })
    })
  })
})
