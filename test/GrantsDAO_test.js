contract('GrantsDAO', (accounts) => {
  const GrantsDAO = artifacts.require('GrantsDAO')

  const defaultAccount = accounts[0]
  const teamSigner1 = accounts[1]
  const teamSigner2 = accounts[2]
  const communitySigner1 = accounts[3]
  const communitySigner2 = accounts[4]
  const communitySigner3 = accounts[5]
  const teamSigners = [teamSigner1, teamSigner2]
  const communitySigners = [communitySigner1, communitySigner2, communitySigner3]

  let dao

  beforeEach(async () => {
    dao = await GrantsDAO.new(
      teamSigners,
      communitySigners,
      { from: defaultAccount }
    )
  })

  describe('constructor', () => {
    it('deploys with the specified addresses as signers', async () => {
      teamSigners.forEach(async s => assert.isTrue(await dao.teamSigners.call(s)))
      communitySigners.forEach(async s => assert.isTrue(await dao.communitySigners.call(s)))
    })
  })
})
