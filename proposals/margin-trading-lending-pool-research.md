## Title of proposal: 
Margin Trading - Lending Pool Research

## Description: 
Margin trading is in high demand from the Synthetix community as SNX exchange is uniquely positioned to offer a superior margin trading product due to the "no slippage" nature of synthetix.

This proposal is for the final research and specification needed to bring the SNX margin trading product to market.

Building on the work done in previous SNX DAO proposals, [Leveraged Synths](https://github.com/Synthetixio/snx-grants-dao/blob/master/proposals/leveraged-synths.md) and [Synthesis](https://github.com/jakub-wojciechowski/snx-grants-dao/blob/master/proposals/synthesis-margin-trading.md), it is clear that using an open position as "collateral" enables a trader to put up a fraction of the collateral needed to open a position, as that position can always be seized or liquidated if the required maintance margin is not met.

The open question in both projects is the mechanics and economics of the lending function. A "Peer-to-Contract" lending pool model seems to be the most efficient approach to having sufficient real time liquidity. However there are some risks with automated lending pools that need to be properly architected to protect lenders.

While Synthetix is "Zero Slippage", due to the fee reclamation system implemented to prevent front running, there is a small window where the price feed that sets the market price is delayed, causing a potential liqudiation to settle at a price lower than the liquidation target. While this is signficantly lower risk than a typical order book or liquidity pool based exchange, it is still a risk that needs to be mitigated.

Because of this "settlement risk", synths that can be traded on margin have different effective risk profiles based on historical volatility and market liquidity, and the variance in risk for each synth must be accounted for to protect the lending pool.

Without the "settlement risk", a simple sUSD lending pool based on utilization ratio would be sufficient to create a lending market, but instead we must consider more advanced strategies to establish the market.

Among the methods to manage the risk appropriately, we are considering 2-D interest rate calcluations, governance based collateralization rates, some combination, or others.

The purpose of this proposal is to research and model the potential risk, interest rate methods, and liquidation mechanics.

The result of this proposal will be risk and economic modeling and technical spec for implementing solvency managment, lending pool interest rates, and liquidation.

Armed with this research and spec, we as a community will have all the tools we need to complete the implementation for the Synthetix Margin trading system.


## Motivation: 
To make this the best place to margin trade on the interwebs!

## Additional information: 
This is the next step in enabling the Margin trading system for Synthetix which is a research only milestone.

Future proposals to build the system may include:

- Implementing the technical spec resulting from this grant (which may already be implemented in the Synthesis project)
- Audit of spec and contracts
- Designing, building and promoting an easy to use interface for margin trading
- Improvements to the product

## Previous work: 
Team:

- Tom Howard (Mosendo)
- Nour Haridy (Mosendo)
- Siva Arumugam (Serenuscoin)

The Mosendo team has previously built the Synthetix Limit Order functionality ([SIP-54](https://sips.synthetix.io/sips/sip-54)), as well as the [Gasless](https://gasless.mosendo.com/) relayer and Mosendo infrastructure.

Siva is the creator of [Serenuscoin](https://serenuscoin.readthedocs.io/en/latest/), a stablecoin based on CFDs rather than over-collateralization, and is a professional trader and financial analyst.

## Estimated hours: 
~120 Hours
3-4 weeks timeline

## Price (SNX): 
6000 SNX (~$12,000)

## Ethereum Address: 
0x6da94f37BE30D9AFAD1D057477fB91860F28C457
