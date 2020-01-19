contract('GrantsDAO', (accounts) => {
  const GrantsDAO = artifacts.require('GrantsDAO')

  const defaultAccount = accounts[0]
  const signer1 = accounts[1]
  const signer2 = accounts[2]
  const signer3 = accounts[3]
  const signer4 = accounts[4]
  const signer5 = accounts[5]
  const signers = [signer1, signer2, signer3, signer4, signer5]

  let dao

  beforeEach(async () => {
    dao = await GrantsDAO.new(signers, { from: defaultAccount })
  })

  describe('constructor', () => {
    it('deploys with the specified addresses as signers', async () => {
      signers.forEach(async s => assert.isTrue(await dao.signers.call(s)))
    })
  })
})
