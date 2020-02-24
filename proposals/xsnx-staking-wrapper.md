## Title: xSNX Staking Wrapper
*(Updated Feb 17)*

## Description:

Create an ERC20 wrapper (smart contract) for SNX that provides exposure to staking incentives and trading returns without the week-to-week management currently required. Create a frontend (UI) to interact with these contracts via MetaMask.

## Motivation:

To enable two kinds of investors to benefit fully from the SNX investment thesis:

- investors who, for tax and accounting reasons, can't invest in stakeable tokens
- investors who, for complexity reasons, aren't comfortable with the technical and strategic elements of staking

As it currently stands, these investors are mostly passing on SNX as an investment, leaving a large amount of capital on the sidelines.

## Functionality:

- Mint: As an investor you can send ETH to the contract and receive ERC20 tokens proportional to your share of the pool. The contract exchanges the ETH for SNX behind the scenes.

- Stake: The contract exposes an incentivized public function (callable by bots or humans for a small slice of transaction value) for staking.

- Claim: The contract exposes an incentivized public function for claiming rewards. If necessary, this function will also burn sUSD to restore C-RATIO.

- Hedge: The contract exposes an incentivized public function for allocating minted sUSD to the [ETH20SMACO](https://www.tokensets.com/set/eth20smaco) Set designed to track or beat the performance of ETH.

- Redeem: As an investor, you can redeem your tokens at any time from the contract at the value of unlocked NAV. Depending on the status of the pool, the contract may need to sell ETH20SMACO and burn sUSD.

## Additional Information:

- See the more detailed [proposal deck](https://docs.google.com/presentation/d/1YJQoUAJpFiM67m1cdUlTl7UAyIzxNKZKDZfJFJWGobY/edit?usp=sharing) for more info on the mechanics of xSNX

- If xSNX is successful, there may be a small mint fee to fund further development

## Estimated Hours:

- 200 hours researching, writing contracts, testing, audit remediation
- 75 hours building frontend, testing, web3 integration

- 275 hours total

## Price:

- 15000 SNX @ $0.95 for 250 hours
- TBD SNX for contract audit

~$52/hour

## Ethereum Address:

- 0xBBfA1429BAAF788B8d9c3Bae47eCB67AED7b0c84
