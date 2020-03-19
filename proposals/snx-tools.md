# SNX Tools: a suite of tools and features for Synthetix stakers and traders

## Background:
Framework Ventures has always sought to help grow and promote Synthetix. When we first started discussing with the team how we could partner together, one of the top desired initiatives was to build a suite of tools and features to benefit all stakers and traders in the ecosystem.

Together with Jaaq (Jaaq | snx.tools
#4273), we constructed the features that currently reside on https://snx.tools, built the data pipeline and launched the visualizations that make the dashboards useful. This project was all funded out of Framework Ventures and now we (including Jaaq and Brian) want to expand the efforts to add more people and perspectives to the project.


## Description: 
Synthetix is one of the most high-potential and ambitious projects in the blockchain space. To help achieve these lofty goals, Synthetix needs a suite of tools and features to automate, institutionalize and streamline the process flows for stakers, traders or anyone looking to better understand the health of and activity on Synthetix. We have decided to use the domain https://snx.tools to maintain these tools and features to unify the UX in one location. 

The initial product goals for SNX Tools are to provide all Synthetix network participants with the go-to tool for their specific role in the ecosystem. This comes down to three core products:

*   **General:** SNX Explorer
    *   This will be a set of dashboards and visualizations that showcases the health of the overall Synthetix ecosystem and individual addresses within Synthetix
    *   Stakers can see their individual staking actions and metrics, most importantly their full PnL for SNX inflationary rewards and sUSD fee rewards but subtracting their pro-rata increase in debt pool.
    *   Traders will be able to view their trading metrics, PnL on each trade as well as total PnL over time.
    *   Anyone can use the tools to search for the top stakers/traders’ accounts, get a deep understanding of the health of the overall network or get notified of large trades or transfers via the SNX Tools notification engine.
    *   Synthetix transaction viewer to assess specific activity, accounts, movements over time.
*   **Stakers:** Synth Rebalancer
    *   This product will incorporate the ability to automatically rebalance a staker’s Synth distribution based on a set of parameters. This concept is similar to the trade proxy system as designed in: [https://github.com/brian0641/Synth-Sets/blob/master/contracts/tradeProxy.sol](https://github.com/brian0641/Synth-Sets/blob/master/contracts/tradeProxy.sol). 
    *   The product goals for this feature will be to enable stakers the ability to auto-rebalance their synths to match some specified distribution. It’s likely that many stakers will seek to target a similar pro-rata distribution of Synths as the rest of the market in order to minimize debt exposure relative to other stakers. 
*   **Traders:** ProTrader
    *   Traders will be able to use SNX Tools to connect their wallet and generate a profile for their trading account.
    *   Users will be able to search for, follow and delegate capital to traders (for a fee) that will go to the trader. 
    *   Traders will need to maintain a strong trading record and relationship to “subscribers” or else lose the revenue potential from having more people want to follow the trades.

## Motivation: 
As large participants in the Synthetix ecosystem, we know the pain points that stakers and traders experience, and we want to solve them. That being said, we don’t expect to be able to solve all future issues with a single proposed product. We view SNX Tools as a distribution mechanism for any new consumer-facing feature or tool that could be useful to the network outside of the core exchange. We want to structure this proposed initiative in the following way:

*   Each phase will have a specific set of deliverables as well as budget to accomplish them.
*   Framework will act as the “PM” for the product and DRI for delivering it to the community and given the budget for funding.
*   Framework will NOT take any funds for ourselves, any funds left over will go into subsequent phase or back to the foundation.
*   Framework will go out and source developers, designers, lawyers and auditors to get each phase of the project in a place where it is ready to test and then ready to launch.
*   The product feature development will be open sourced as much as it can be.
*   [https://snx.tools](https://snx.tools) will serve as the distribution channel for the Synthetix related tools and features.

## Previous work:
https://snx.tools & https://framework.ventures

## Project Plan

We will take an iterative approach to funding this program and start with Phase 1 as outlined below:

### _Phase 1a - Launch SNX Explorer (to be decided with this proposal)_

_Workstreams:_

**Live beta:** https://snx.tools

**Development** - 1 or 2 contributors (Jaaq, 1 additional) to:



*   Continuation of the data platform 
*   Additional Synth charts 
*   Outstanding Synths over time & views by Synth
*   UI for the dashboards 
*   PnL analysis for stakers and traders
*   SNX/Synth automated monitoring tools (i.e. whalewatcher)

**Design** - engaging an outside firm (Moonboots LLC) to brand the SNX Tools platform

**Legal** - none

**Audit** - none

**Timeline:** 1a: 25 days for Jaaq, 12 days for UI implementation, 2 week-long design sprints for Moonboots.

**Resources:** 100k SNX ($45k)

Staking
![staking](images/staking.png?raw=true)

Trading
![trading](images/trading.png?raw=true)

Rewards Calculator\
![rewards](images/rewards.png?raw=true)


### _Phase 1b - Expand Explorer to feature Transaction Viewer (saved for a future proposal)_

**Development** - 1 or 2 contributors (Jaaq, 1 additional) to:



*   General Explorer tool
*   Before, action, after for each transaction for an account for staking/trading
*   URI handling
*   SNX token stats (holders, movements, buys/sells, changes over time)

**Design** - engaging an outside firm (Moonboots LLC) to design product flow for transaction viewer and integration into existing account tools (staker / trader)

**Legal** - none

**Audit** - none

**Timeline:** 20 days for Jaaq, 5 days for UI implementation, 2 week-long design sprint for Moonboots.

**Resources:** $36k (TBD SNX once phase 1a completed)

### _Phase 2 - Launch Rebalancer and continue on Explorer support (saved for a future proposal)_

**Development** - 1 or 2 contributors to own the continuation of the data platform, UI for the dashboards, new views for Synth Rebalancer (Jaaq, 1 additional)

**Design** - engaging an outside firm (Moonboots LLC) to design UI for Rebalancer views

**Legal** - engaging legal counsel to cover privacy policy, user terms and conditions, and tax analysis for Rebalancer

**Audit** - outside development/audit firm to validate work before full launch of any smart contracts handling the management of crypto assets

**Timeline:** TBD

**Resources:** TBD

### _Phase 3 - Launch ProTrader and platform for other tools (saved for a future proposal)_

_Workstreams:_

**Development** - 1 or 2 contributors to own the continued work on SNX Explorer and new work ProTrader (Jaaq, 1 additional)

**Design** - engaging an outside firm (Moonboots LLC) to design the UI ProTrader views

**Legal** - continued work to cover privacy policy, user terms and conditions, securities analysis, and tax analysis specifically for ProTrader

**Audit** - outside development/audit firm to validate work before full launch of any smart contracts handling the management or trading of crypto assets

**Timeline:** TBD

**Resources:** TBD


## Ethereum Address: 
- 0x65DCD62932fEf5af25AdA91F0F24658e94e259c5
