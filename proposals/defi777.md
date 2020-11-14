# 🎰 DeFi777 🎰

## Description: 
DeFi777 seeks to simplify the user experience of interacting with DeFi protocols. Currently, users must typically set up a Dapp browser such as metamask & navigate complex websites to use these protocols. Many actions require multiple transactions (one to approve token transfers, another to take the action) which makes these actions slow and expensive.

A mainnet prototype of DeFi777 was developed for the ETHGlobal HackMoney hackathon. This prototype wraps popular tokens (Dai, USDC, MKR, Link) and allows them to be used inside a few DeFi protocols (Uniswap, Balancer, Aave).

The next steps of the project are to ensure fund security and add additional DeFi protocols, such as Synthetix.

## ERC777 Wrapper contract
The funds requested in this grant are primarily to fund the audit of the ERC777 Wrapper token factory.

These contracts allow any ERC20 token to be wrapped into a ERC777 wrapper, allowing them to take advantage of ERC777 transfer hooks. The goal is for this wrapper factory to become piece of common infracture of DeFi, similar to the WETH contract.

These wrapper tokens hold custod of the underlying ERC20 tokens, which means their security is crutial. The next step of this project is to have this contract audited.

[Wrapper token & factory code](https://github.com/dmihal/defi777/tree/master/contracts/tokens)

## Synthetix-specific implementation
In addition to creating a stable, audited ERC777 wrapper factory, functionality will be added to support Synthetix using DeFi777 tokens.

First, ERC777 wrapper tokens will be created for all Synthetic assets using the 777 wrapper factory (For example, sUSD777, sBTC777, sETH777).

A ERC777 adapter contract will be created to allow exchanging between synths. For examples, sending sUSD777 to sbtc.synthetix777.eth will swap sUSD into sBTC and return sBTC777 to the user.

### Future features
A future version may allow staking SNX to mint sUSD. The user experience will be similar to the one described in the "Advanced DeFi actions" section in the [roadmap](https://medium.com/@dmihal/defi777-roadmap-76af67eb3c8a).

## Previous work: 
[DeFi777.com](https://defi777.com)  
[Introduction post](https://medium.com/@dmihal/introducing-defi777-decentralized-finance-for-everyone-dc3f87bea70d)  
[Introduction video](https://www.youtube.com/watch?v=31yxRTorqBE)  
[Roadmap post](https://medium.com/@dmihal/defi777-roadmap-76af67eb3c8a)
[GitHub](https://github.com/dmihal/defi777)

## Estimated hours: 
Grant will only pay for the security audit, not development work.

## Price (SNX): 
I've received a quote for an audit of the 777 wrapper contract for $10,000.

I've also earned $919 from Gitcoin grants as well as my ENS prize from HackMoney.
I'll contribute some of my own money to round that up to $1,000, leaving $9,000 left to raise.

Since this wrapper will bennefit all protocols that are integrated into DeFi777, I'm hoping to cover this cost with grants from multiple protocols.

The cost of the audit will depend on the number of projects that are willing to fund the audit:

**Update:** A $2,500 grant has been secured from Aave, leaving the $6,500 left to raise

* ~~1 grant: $9,000 (3734 SNX)~~
* 2 grants: $6,500 (2653 SNX)
* 3 grants: $3,250 (1326.5 SNX)
* 4 grants: $2,167 (884.5 SNX)
* 5 grants: $1,625 (663 SNX)

If I'm unable to raise sufficent funds for the audit, all grant funds will be returned.

## Ethereum Address: 
- `0x392aCFD0792C32222edF31C20dD0Cc51528bb9Ea` 
