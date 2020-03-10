

## Title of proposal: leveraged-synths - A P2P margin lending and leveraged trading system in the Synthetix ecosystem.

## Description:
An Ethereum contract is used to trustlessly implement margin lending and leveraged trading of synths. Each contract is associated with a Trader and a Lender (or possibly multiple Lenders). The Trader deposits collateral (ETH, DAI, etc.) into the contract, indicates the synths that the Trader would like to trade, and the loan amount (in sUSD) requested. The Lender may send sUSD to the contract to fund the trading activities of the Trader.

The trader calls a `trade()` function to place trades. The `trade()` function is a proxy for the `Synthetix.exchange()` function.

It is anticipated that the contract will typically be under-collateralized (i.e., the loaned sUSD amount will be greater than the value of the collateral). If the Trader becomes insolvent (the Trader's collateral value plus synth value in the contract is less than the loaned amount plus a maintenance margin amount), the Trader may be liquidated, assigning all value in the contract to the Lender.

Lenders may benefit both from interest charged on the loan and from liquidations that are able to be executed at prices that are below the maintenance margin amount but above the Trader's true bankruptcy price. Lenders will lose capital on liquidations in fast moving markets that fall below the Trader's true bankruptcy price.

## Motivation:
Traders like leverage. A high-leverage, non-recourse loan, will provide Traders with the potential for significant gains with limited, defined downside. High leverage loans are currently not common in the Ethereum defi ecosystem.

Lending to high-leverage traders will likely be more risky than traditional margin lending. It also has more potential upside and may attract sophisticated investors that are capable of monitoring their  loan portfolio risk and likely liquidation points. The liquidation process is modeled after the Bitmex liquidation system, except that  excess gains obtained by the Bitmex liquidation engine are deposited in an insurance fund whereas in leveraged-synths excess gains are immediately given to the Lender. The Bitmex insurance fund is large (~35k BTC) and steadily growing [(insurance fund link)](https://www.bitmex.com/app/insuranceFund).

Possible Advantages Include:
- No increased risk or systemic risk to the Synthetix ecosystem. No modifications required to the Synthetix contracts.
- Potential to attract a new class of active traders.
- Potential to increase demand for synths and thus help the peg.

## Additional information:
A usable proof of concept implementation is at: [leveragedSynths](https://github.com/brian0641/leveragedSynths).
## Previous work:

I am a regular contributor to the Synthetix discord community and have reported potential exploits in the Synthetix contracts.

## Estimated hours:
120 hours:
  - Complete design and testing of main contract.
  - Design and test factory contract.
  - Build automated process to perform liquidations.
  - Build basic command-line interface to allow users to view their loan contracts, submit loan requests and fund loan requests, and trade without being required to directly interact with the contract.

Subsequent steps that will require additional funding or help:
- Third party review and auditing of smart contract.
- Building of a proper frontend.

## Price (SNX):

10000 SNX (~83 SNX per hour)

## Ethereum Address:
- 0x588Ee209864DA7fD46529182F456bECA3F41331e
