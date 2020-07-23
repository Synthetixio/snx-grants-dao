## Title of proposal:
**Synthesis** - margin trading powered by smart loans

The project will be developed in pararell with [the research phase](https://github.com/Synthetixio/snx-grants-dao/pull/31) lead by Tom Howard which will guide the final implementation of Interest Rates Model and Solvency Model. 

## Description:
Synthesis is an extension to the core Synthetix platform that enables the margin trading feature for synthetic assets exchange. It uses an innovative approach of “smart-loans” implemented as Ethereum contracts managing borrowing, trading and solvency protection. It benefits from the unique Synthetix features like no-slippage and unrestricted liquidity to offer users low-margin and frictionless assets trading.

Margin trading is a practice of using borrowed money to invest in financial assets. It attracts traders because of low-capital requirement and potentially high profits. It is a very common strategy that outgrows traditional spot trading volumes. Some [studies](https://m.scirp.org/papers/70975) indicate that it may additionally positively impact market stability reducing the volatility level. Therefore, enabling margin trading on the Synthetix platform will not only increase the profits for Synthetix stakers thanks to increased trading volume but also reduce the risk because of lower price volatility.

The proof-of-concept of smart loans protocol was built during the **New York Blockchain Week hackathon** and received the 1st Synthetix prize. The project was developed at a high pace for only 5 days to demonstrate the core idea. It requires proper refactoring, filling-in missing parts of lending logic, extensive testing and improving the user interface before it could be safely released to the public.

There is an extensive list of potential features that may be implemented. The best way to decide which of them are most valuable is to release the first iteration as early as possible and collect user feedback. Therefore, an important part of the first stage is collecting user opinions using both monitoring tools( like [Hotjar](www.hotjar.com) or [CrazyEgg](https://www.crazyegg.com/) ) and having face-to-face interviews with the testers. The collected results will help to scope the next phases of development.



## Motivation:

* Much awaited ability to **margin trade** Synths and build a leveraged portfolio
* Higher returns for SNX stakers because of increased trading volume on Syntetix exchange
* Easy onboarding for users who can start margin trading by depositing pure ETH without the hassle of diving deeper into Synthetic minting and staking intricacies
* An opportunity for existing Synths holders to earn interest rates for lending tokens to the protocol
* Additional liquidity stream from crypto-holders who can use pure ether to provide funds to lending pool
* The architecture allows for usages **beyond trading** like staking, lending and other forms of *yield farming*

Synthesis is designed to be an extension to the Synthetix platform and it doesn’t require any changes on the core Synthetix protocol. It leverages the depot-exchange and trading feature using publicly available smart-contract functions. It also provides a self-contained liquidity pool which independent from the Synthetix liquidity and debt accounting.

This approach will greatly reduce any risk of side-effects to the core system. As we painfully learned from the Fulcrum error tightly coupling the lending and trading logic might result in hard to catch bugs and loose of funds.

Developing Synthesis as an extension will allow the Synthetix community to test new features in a restricted safe environment. Being not tightly coupled to the core protocol will allow for faster iterations actively following user feedback.


## Additional information:

### Architecture
The protocol consists of two major components - **Lending Pool** and **Smart Loan** which are connected by a registry ensuring that only valid contracts are allowed to borrow funds with minimal collateral. Other smart contracts are responsible for optimising creation, interactions and logic updates processes. The relevant contracts from Synthetix protocol that directly communicate with the platform are displayed in dark colour. A short description of every component is placed below the diagram.

![Alt text](images/synthesis/architecture.png?raw=true "Architecture")

| Component            | Description                                                                                                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lending Pool         | The main contract implementing the lending logic. It accepts deposits, process withdrawals, issues loans and collects repayments. It also manages interest rates accumulation. |
| Interest Rates Model | It is responsible for calculating interest rates to optimise pool utilisation which is a ratio between loans issued and collected deposits.                                    |
| Borrowers Registry   | A helper contract that registers all of the approved smart loans contracts that are compliant with the solvency protection protocol.                                           |
| Smart Loan           | The core contract integrating funds borrowing, solvency protection, margin calculations and assets trading.                                                                    |
| Smart Loans Factory  | A helper contract that orchestrates Smart Loan creation enabling the payment of margin, funds borrowing and contract creation in a single transaction.                         |
| Solvency Model       | An encapsulated set of rules that defines optimal solvency level and strategy to calculate it based on specific assets features, like volatility.                              |
| Liquidation Strategy | A helper contract that stores important liquidation parameters and incentives logic. It's extracted to allow low impact protocol updates based on liquidation statistics.      |
| Pricing Oracle       | It provides current prices of traded assets. It ensures that external data providers follow a common querying interface.                                                       |
| Trading Adapter      | A contract that adapts third party trading or investment protocols to follow a common trading interface.                                                                       |

### Solvency protection

The most important requirement for the Smart Loan is making sure that the contract can always repay the debt. It is achieved by constantly monitoring the ratio between the contract balance and the amount of money borrowed, which is called a **solvency ratio**.

*The code snippets below are taken from the PoC code to illustrate the basic logic and are going to be refactored during the grant implementation.*
```
  function getSolvencyRatio() public view returns(uint256) {
    uint256 debt = getMyDebt();
    if (debt == 0) {
      return MAX_SOLVENCY_RATIO;
    } else {
      return getAccountValue().mul(SOLVENCY_PRECISION).div(debt);
    }
  }
```
Keeping the value above certain level ensures that there is enough time for liquidators to forcibly repay the debt. This constraint is enforced by annotating every state changing action by a modifier that checks if the solvency ratio doesn't drop below the limit:
```
  modifier remainsSolvent() {
    _;
    require(isSolvent(), "The action may cause an account to become insolvent.");
  }
```
However, the solvency ration may also drop due to the price movement of the assets held by the Smart Loan. In this case anyone can trigger a liquidation by invoking the liquidate method which will forcibly repay the debt:
```
  function liquidate(uint256 _amount) remainsSolvent {
    require(!isSolvent(), "Cannot liquidate a solvent account");
    repay(_amount);
    uint256 bonus = _amount.mul(LIQUIDATION_BONUS).div(100);
    require(loanProvider.asset().transfer(msg.sender, bonus));
    require(getSolvencyRatio() <= LIQUIDATION_CAP);
  }
```

### Features list

- Lending dashboard

![Alt text](images/synthesis/F1_lending_dashboard.png?raw=true "Lending Dashboard")

A dashboard showing the current global state of the lending pool and individual user balance.
It allows to deposit more funds or withdraw provided tokens.

- Depositing funds

![Alt text](images/synthesis/F2_lending_deposit.png?raw=true "Deposit")

An interface for lending funds to the pool.
It should display the amount available in user wallet, value denominated in tokens and $USD.
It should also handle transaction processing and error reporting.

- Withdrawing funds

![Alt text](images/synthesis/F3_lending_withdrawal.png?raw=true "Withdrawal")

An interface for withdrawing funds from the pool.
It should display the amount previously deposited in the pool and input field for value denominated in tokens and dynamically translated to $USD.
It should also handle transaction processing and error reporting.

- Margin trading dashboard

![Alt text](images/synthesis/F4_margin_trading_dashboard.png?raw=true "Main Dashboard")

The main dashboard of the platform.
On the top of the screen it shows three widgets displaying:
 * The amount of funds borrowed with the ability to repay or borrow more.
 * The current solvency level with warnings about the liquidation risk.
 * The amount of funds provided by the user (margin) with the ability increase buffer or cash out earnings

Below the widget the is a portfolio overview that presents the list of assets with data about prices, value and allocations.

- Margin trading dashboard

![Alt text](images/synthesis/F5_trading.png?raw=true "Trading")

An interface for assets trading.
It allows assets selection, input for the trading amount and provides live pricing data.
It should also handle transaction processing and error reporting.

- Borrowing

![Alt text](images/synthesis/F6_borrowing.png?raw=true "Borrowing")

An interface for borrowing funds.
It should display the input field where a user can specify the amount of funds with a warning about solvency level decrease.
It should also handle transaction processing and error reporting.

- Repayments

![Alt text](images/synthesis/F7_repayments.png?raw=true "Repayments")

An interface allowing loan repayments.
It should display the input field where a user can specify the amount of funds to repay with the information about solvency ratio improvement and current debt level.
It should also handle transaction processing and error reporting.

- Withdrawals

![Alt text](images/synthesis/F8_withdrawals.png?raw=true "Withdrawals")

An interface allowing to withdraw funds provided by the user.
It a feature that enables cashing out profits accumulated through margin trading.
It should display the input field where a user can specify the amount of funds to withdraw with the information about solvency ratio and current margin level.
It should also handle transaction processing and error reporting.

### Additional materials

- [Proof of Conecpt code from NYBW hackathon](https://github.com/SynthesisDeFi/Synthesis)

- <a href="https://synthesis.kubawo.now.sh/" target="_blank">Live demo on the Kovan testnet</a>

- <a href="https://www.youtube.com/watch?v=s5Ef6Pg2evA" target="_blank">Walk-through the app with voice over</a>

- <a href="https://docs.google.com/presentation/d/1ikE7PaTvIZkvBDb_PhyhIuOTls4SXlldJPXhEgUqZYM/edit?usp=sharing" target="_blank">Slides explaining the concept</a>

- <a href="https://www.youtube.com/watch?v=thlRslb5KL4" target="_blank">Slides with voice over</a>

- <a href="https://wojciechowski-kuba.gitbook.io/synthesis/" target="_blank">Short documentation explaining main features and their implementation</a>

## Previous work:

I am a computer science graduate of the Warsaw University living now in London. I've worked as a software engineer in the fintech and insurance industry and progressed his career to a team lead role. I've joined the blockchain space co-founding Alice, where he designed and deployed custodian stable currency (first to go through a regulatory sandbox in UK), in-house transactions relayer and a decentralised impact investment protocol. I've presented at multiple conferences including Devcon and launched Warsaw Smart Contract Coding Club (over 100 members).  I've also worked as a smart-contract auditor at Zeppelin Solutions.

Some of my blockchain projects:

- Transparent donations platform, used by Greater London Authority and presented during Devcon3 ([code](https://github.com/alice-si/alice-v1-monorepo) & [application](https://donationsapp.alice.si/)) presented during Devcon 3

- Fixex-rate lending protocol, winner of EthLondon 2020 ([code](https://github.com/BlazarDeFi/blazar) & [application](https://blazar.now.sh/))

- Impact investing protocol with pure web3 UX ([code](https://github.com/alice-si/alice-v2-monorepo) & [application](https://ida.alice.si/)) presented during EthCC 2020 Paris 

- Multi-agent simulation of Token Curated Registries ([code](https://github.com/alice-si/TcrSimulation.jl) & [report](https://github.com/alice-si/TcrSimulation.jl/blob/master/README.md)) presented during EthCC 2019 Paris 

- Binding library for Gnosis Conditional Tokens ([code](https://github.com/alice-si/gnosis-hg-js) & [workshop](https://github.com/alice-si/gnosis-hg-js/tree/master/dappcon)) presented during Dappcon 2019

- Open source blockchain explorer ([code](https://github.com/alice-si/etheroscope) & [application](https://etheroscope.alice.si/))

- Decentralised IoT oracle protocol ([code](https://github.com/alice-si/sensor-trx) & [demo](https://www.youtube.com/watch?v=Ap6WQRe0XdA))

- Example of one of the code audits - done for Universal Login ([report](https://github.com/UniLogin/UniLogin/blob/master/universal-login-contracts/audits/audit-jwojciechowski.pdf))


## Estimated hours:

This stage will consist of three main areas: necessary protocol improvements, UX updates and user testing. The list of tasks with their time estimation are attached below:

| Tasks                                                     | Workload (hours) |
| --------------------------------------------------------- | ---------------- |
| **Lending Pool - missing parts implementation**           |                  |
| Interest rates model                                      | 24               |
| Interest accumulation mechanism                           | 32               |
| Basic lending pool admin & management                     | 16               |
| Handling multiple deposit currencies                      | 16               |
| **Core protocol improvements**                            |                  |
| Extracing and improving solvency model                    | 16               |
| Authorisation module (restrictions during testing)        | 8                |
| Tradable assets configuration (currently hardcoded)       | 8                |
| Improving on-chain calculations precision                 | 4                |
| Gas optimisations (trading accounts factory)              | 16               |
| Extra safety measures (pausing, funds escape hatch)       | 8                |
| Proper error handling                                     | 16               |
| Refactoring                                               | 24               |
| Code documentation                                        | 4                |
| Preparing test suite with multiple scenarios              | 32               |
| Improving liquidations scripts                            | 16               |
| Implementing liquidation monitoring bot                   | 16               |
| **UX of Lending pool**                                    |                  |
| Improving home screen design & onboarding messages        | 4                |
| Automatic network detection                               | 4                |
| Multiple web3 providers integration                       | 8                |
| Adding multiple ways of providing liquidity (eth, sUSD)   | 4                |
| Live conversion rates between eth and sUSD                | 8                |
| Fetching user eth & token balance                         | 4                |
| Validating amount of funds provided to the liquidity pool | 4                |
| Showing interests earned for depositors                   | 8                |
| Diplaying costs of loans for borrowers                    | 8                |
| Showing a history of trasactions                          | 16               |
| Blockchain error hangling + popups                        | 8                |
| **UX of Margin trading**                                  |                  |
| Extending the pool of tradable assets                     | 8                |
| Live conversion rates in assets selection view            | 4                |
| Showing profits/losses per asset and in total             | 4                |
| Showing a widget with assets price history                | 16               |
| Multiple ways of sorting assets (name, value, profit)     | 4                |
| Showing a warning about liquidation risk                  | 4                |
| Offering a one-click solvency improvement widget          | 4                |
| A widget with portfolio value history                     | 8                |
| **User testing**                                          |                  |
| Connecting instant chat                                   | 2                |
| Connecting user monitoring (heatmaps)                     | 4                |
| Portfolio ranking view                                    | 8                |
| Data fetching and anaylitics pipeline                     | 8                |
| Recruiting testers                                        | 8                |
| Designing survey                                          | 8                |
| Conducting structured interviews                          | 16               |
| Data analytics                                            | 16               |
| Preparing final raport                                    | 16               |
| Scoping next phases of development                        | 8                |
| Total development                                         | 478              |
| Unexpected issues risk buffer (15%)                       | 72               |
| **Total**                                                 | 550              |

## Phase 1

| Tasks                                               | Workload (hours) |
| --------------------------------------------------- | ---------------- |
| **Core protocol improvements**                      |                  |
| Extracing and improving solvency model              | 16               |
| Improving on-chain calculations precision           | 4                |
| Tradable assets configuration (currently hardcoded) | 8                |
| Gas optimisations (trading accounts factory)        | 16               |
| Extra safety measures (pausing, funds escape hatch) | 8                |
| Proper error handling & inputs sanitization         | 16               |
| **Lending Pool - missing parts implementation**     |                  |
| Interest rates model                                | 24               |
| Basic lending pool admin & management               | 16               |
| Interest accumulation mechanism                     | 32               |
| **Code quality**                                    |                  |
| Hackathon Code Refactoring                          | 24               |
| Code documentation                                  | 4                |
| Preparing test suite with multiple scenarios        | 32               |
| **Total tasks**                                     | 200              |

## Price (SNX):

Assuming $60 USD/h = $12k in total
Duration: estimated ~ one month

## Ethereum Address:

0x7D5024bfb6512211acb7521A76A8d60f8980FD7c
