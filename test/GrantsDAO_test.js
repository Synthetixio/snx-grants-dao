const { BN, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers')

contract('GrantsDAO', (accounts) => {
  const GrantsDAO = artifacts.require('GrantsDAO')
  const SNXToken = artifacts.require('MockToken')

  const defaultAccount = accounts[0]
  const teamMember1 = accounts[1]
  const teamMember2 = accounts[2]
  const communityMember1 = accounts[3]
  const communityMember2 = accounts[4]
  const communityMember3 = accounts[5]
  const stranger = accounts[6]
  const teamMembers = [teamMember1, teamMember2]
  const communityMembers = [communityMember1, communityMember2, communityMember3]

  const oneToken = web3.utils.toWei('1')
  const tokenName = 'Synthetix Network Token'
  const tokenSymbol = 'SNX'
  const tokenDecimals = new BN(18)
  const tokenInitialSupply = web3.utils.toWei('1000')
  const after2Days = 172801
  const after9Days = 777601

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
      teamMembers,
      communityMembers,
      { from: defaultAccount },
    )
  })

  describe('constructor', () => {
    it('deploys with the specified addresses as signers', async () => {
      teamMembers.forEach(async s => assert.isTrue(await dao.teamMembers.call(s)))
      communityMembers.forEach(async s => assert.isTrue(await dao.communityMembers.call(s)))
    })

    it('deploys with the specified token address', async () => {
      assert.equal(snx.address, await dao.SNX.call())
    })
  })

  describe('createProposal', () => {
    context('when called by a stranger', () => {
      it('reverts', async () => {
        await expectRevert(
          dao.createProposal(stranger, oneToken, { from: stranger }),
          'Not proposer',
        )
      })
    })

    context('when called by a proposer', () => {
      context('and the DAO is not funded', () => {
        it('reverts', async () => {
          await expectRevert(
            dao.createProposal(stranger, oneToken, { from: teamMember1 }),
            'Invalid funds on DAO',
          )
        })
      })

      context('and the DAO is funded', () => {
        beforeEach(async () => {
          await snx.transfer(dao.address, oneToken, { from: defaultAccount })
        })

        it('emits the NewProposal event', async () => {
          const tx = await dao.createProposal(stranger, oneToken, { from: teamMember1 })
          expectEvent(tx.receipt, 'NewProposal', {
            receiver: stranger,
            amount: oneToken,
          })
        })

        it('creates a proposal', async () => {
          await dao.createProposal(stranger, oneToken, { from: teamMember1 })
          const proposal = await dao.proposals(1)
          assert.isTrue(proposal.active)
          assert.equal(oneToken.toString(), proposal.amount.toString())
          assert.equal(stranger, proposal.receiver)
          assert.isTrue(proposal.createdAt.gt(0))
        })
      })
    })
  })

  describe('voteProposal', () => {
    beforeEach(async () => {
      await snx.transfer(dao.address, oneToken, { from: defaultAccount })
      await dao.createProposal(stranger, oneToken, { from: teamMember1 })
    })

    context('when called by a stranger', () => {
      it('reverts', async () => {
        await expectRevert(
          dao.voteProposal(1, { from: stranger }),
          'Not proposer',
        )
      })
    })

    context('when called by a proposer', () => {
      context('when the proposal is still in submission phase', () => {
        it('reverts', async () => {
          await expectRevert(
            dao.voteProposal(1, { from: teamMember1 }),
            'Proposal in submission phase',
          )
        })
      })

      context('when the proposal is outside of voting phase', () => {
        beforeEach(async () => {
          await time.increase(after9Days)
        })

        it('reverts', async () => {
          await expectRevert(
            dao.voteProposal(1, { from: teamMember1 }),
            'Proposal not in voting phase',
          )
        })
      })

      context('when the proposal is inside the voting phase', () => {
        beforeEach(async () => {
          await time.increase(after2Days)
        })

        it('allows the proposal to be voted on', async () => {
          const tx = await dao.voteProposal(1, { from: teamMember1 })
          expectEvent(tx, 'VoteProposal', {
            member: teamMember1,
          })
        })
      })
    })
  })
})
