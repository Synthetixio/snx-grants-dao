
## SNX Link, your Synthetix portfolio manager. Automatic. Non-Custodial.

### Description:

SNX Link is strongly committed to Synthetix vision to create a decentralized financial platform enabling anyone to have an exposure to crypto and real world assets, without actually holding them. 

In other words: 

*   No custody
*   No bank accounts
*   No brokers
*   No lack of liquidity thanks to SNX Pool

This approach brings a peerless value to users but it is still too complex compared to services typically used in the traditional financial world. At the moment, therefore, it remains reserved for very few subjects experienced in crypto and decentralized applications.

SNX Link goal is to bring **mass adoption** to Synthetix **automating** tedious recurring tasks and setting the **autopilot** to user investments with the same **user experience** of the most used portfolio management platforms, hiding most of the complexities. 

With a huge difference. **Everything is done automatically** thanks to the concept of delegation introduced by Synthetix Hadar Release and **completely non-custodial**. User SNX/Synths are never touched by SNX Link.

Leveraging delegation widely described in SIP-10, SNX Link is going to achieve its goals developing **a collection of smart contracts** able to perform the following actions on behalf of Synthetix users: 

*   Claim
*   Mint
*   Burn
*   Exchange

Thanks to these features SNX Link acts as a non-custodial portfolio management platform ready to onboard crypto and traditional investors interested to passively manage their investments leveraging Synthetix Ecosystem that allows them to:

*   Remain in control of their funds
*   Trade Any assets
*   Not have slippage
*   Have an infinite liquidity

Everything will be served to the user in an interface as simple as possible deriving from in-depth studies carried out on the user experiences offered by the most used portfolio management platforms in the world.

For a quick view on SNX Link Plans see our [pitch](https://docs.google.com/presentation/d/1J9d8S4gpF1j08a_zhd5g_m2OYDXhx0WM4nvv9wEr12k/edit#slide=id.g8428dfccdf_0_39)

##
### Motivation:

SNX Link has been launched by me (Emiliano) and [Simone](https://github.com/SC92).

We are both investors and active users of Synthetix, but not only this. We are also strongly promoters of Synthetix in our community, DeFi Italy. 
 
We created this community in November 2019 and at the moment is the biggest country specific community regarding DeFi with more than 800+ active members with many builders and early adopters hungry for new products to try. 

And what we have experienced on our skin is that despite the high-level skills of our community and all our enthusiasm in describing Synthetix platform, it remains an extremely complex product. Even for the crypto experienced users.

For this reason Emiliano and [Simone](https://github.com/SC92) decided to create SNX Link combining our strong experiences respectively in the finance industry (hedge fund, asset management, trading) and in technology (smart contracts, decentralized applications development and automation).

Blending these two different but definitely complementary backgrounds together we are able to have a very clear idea of what is needed to create a successful product for investors and traders (crypto / non crypto) and to have all the technical and financial knowledge necessary to make it happen.

 
**Our final goal is to make Synthetix accessible to everyone aiming for mass adoption**.  
 
To achieve this, the strategy envisages at the same time a strong technical activity for the creation of the platform and business development to explain and make our interlocutors understand the simplicity that is achieved through SNX Link and the potential of Synthetix as underlying. This activity will be worldwide starting from our community, DeFi Italy. 

It includes the **production of text and video contents** explaining how Synthetix platform works ([we already started](https://www.youtube.com/channel/UCr_X3J2P0c0aYC_H06n6TZg?view_as=subscriber)) and the functionalities of SNX Link in Italian/English language and the **organization of specific meetups** related to this topic.

##
### Additional information:

SNX Link roadmap has been planned by carefully studying the experience of the single user and as you can see in snx.link two categories of users have been identified: 

1. **Traders** interested to trade synthetic assets without having debt exposure with the platform
2. **Stakers** interested to actively participate in SNX Pool sharing the platform trading fees and the inflation rewards

For both categories unique features have been elaborated and studied, some already live and others available in the coming weeks.

The roadmap is divided into four phases: A, B, C and D.

#### Phase A -  COMPLETED

**TRADERS - snx.link/trading**



*   Trading Portfolio Dashboard v.1

Leveraging on the strong experience of the team in the asset management industry and after analyzing the experience offered by the most used portfolio management platforms in the world SNX Link developed a dashboard where the** trader “feels at home”** and where he has all the data it needs in one single page, such as:



*   Synths Allocation 
*   Trade History
*   Historical Portfolio Value

From a technical standpoint for most of the data and interactions we are using `synthetix-js` and `synthetix-data`. 
 
Currently for historical prices and the market section, we implemented a custom solution leveraging TimescaleDB and AWS Cloudfront + API Gateway + Lambda + Fargate, actually we have a historical view starting from 22/04 for all the users and since Jan 2020 for the prices. We are just showing the last 24 hours. Now we are designing a new solution which would be more efficient and will leverage `synthetix-data` and an archive node.


![Trading Dashboard](images/snx-link-trading.png?raw=true "image_tooltip")
 
_Trading Dashboard V.1_ 


**STAKERS - snx.link/staking**



*   Autoclaim

Users no longer need to connect to Mintr every week and no longer risk forgetting to request rewards for their staking.

Using “AutoClaim” user can delegate to SNX Link the basic tasks needed to receive the system fees (sUSD) and SNX rewards weekly, specifically Keepers - a special category of SNX Link Users described below - request the rewards on behalf of the user through SNX Link platform and the user receive the sUSD / SNX.

To start to use the “Autoclaim”, a user can connect his Metamask Wallet, choose the number of weeks he wants to use the service, select the desired priority level, transfer the ETH needed for the claim transactions and he is ready to receive his weekly rewards.

He can change the selected period or the priority level at any time, simply visit [snx.link/staking](https://snx.link/staking)

 
Technically we developed a smart contract which manages the accounting of the users and implements the logic for the autoclaim. Users funds are stored in a separate [Gnosis Wallet]([https://wallet.gnosis.pm/](https://wallet.gnosis.pm/#/wallets)) for each users, it’s shared with the smart contract available at [snxlink.eth](https://etherscan.com/address/snxlink.eth) 


Users delegate the smart contract to claim on behalf (we don’t require any other permissions) and it exposes the functionality to the keepers. They are incentivized to claim on behalf because they receive a full refund of the gas fees plus a fixed reward, partly received also by the platform. Below an example of tx. 
 



![Autoclaim Tx](images/snx-link-autoclaim-tx.png?raw=true "image_tooltip")
 


 
Users are protected because they set the max gas price they are willing to spend plus the maximum expense per claim. The transaction reverts in the case the Keeper sets a greater gas price or the tx for any reason breaks the threshold set by the users. 


Our contracts are not upgradable and have no admin keys, users must explicitly grant permission to the new updates we are going to propose. Actually they can change max gas price and max fee per claim, along with the basic top-up/withdraw from the gnosis wallet.



*   Synths Compare

This tool compares User Synths Allocation with the Allocation of the entire Synthetix Platform.

Stakers can realize in a jiffy what are the actions needed to adapt their positions minimizing the debt fluctuation.




![Synths Compare](images/snx-link-synth-compare.png?raw=true "image_tooltip")




*   sUSD Burn/Purchase - Kyber Integration

Users can manually increase their C-Ratio in two ways: buying more SNX and mint more sUSD or burning sUSD.

In Phase A it’s introduced the possibility to burn sUSD from user balance or if he doesn’t have enough to buy and burn sUSD while during the Phase B Stakers could see also the amount of SNX needed to fix their C-Ratio, buy them through Kyber and mint sUSD.


![](images/snx-link-susd-burn-1.png?raw=true "image_tooltip")




![](images/snx-link-susd-burn-2.png?raw=true "image_tooltip")


![](images/snx-link-susd-burn-3.png?raw=true "image_tooltip")


**KEEPERS - snx.link/keepers**

As mentioned before the claim will be executed by the Keepers, users that execute functions on behalf of the users through SNX Link platform in exchange for a reward.

SNX Link has been developed as a two-sided decentralized platform where users pay for delegating certain tasks and Keepers execute them being paid.



*   Keepers Dashboard

Thanks to the keepers dashboard no coding skills are required to become a keeper, anyone can do it independently starting to earn ETH every week. 

Just press the button, the smart contract does the rest.

Technically it is a simple dapp which shows the claimable users and provides a button experience preparing under the hood the tx required for claim on behalf.

#### Phase B - ONGOING

**GROWTH: ON-CHAIN REFERRAL**

Once the basic features of SNX Link has been developed, the platform is ready to grow in terms of users. 

The first strategy to achieve greater adoption is one of the most effective growth marketing tactics revisited by SNX Link with the addition of an extra special feature, the **on-chain referral code**.

SNX Link users could invite their friends and receive a percentage on the fees generated by their activities on SNX Link. On the other hand, invited users will receive discounts on early operations.

**The innovation brought by SNX Link is the use of the blockchain** - preserving the users privacy - to maintain the highest level of transparency, security and immediacy in the awarding of prizes thanks to a collection of smart contracts developed ad hoc.

**UX IMPROVEMENTS**



*   Autoclaim and User Status Notifications - Mail, Discord and Chrome Integration

If selected at the time of activation, the user can decide to receive a private message directly via email where all the details of the claim are reported: how many SNX / sUSD have been collected and the fees spent for the operation. The feature is also available on Discord, interacting with the SNXLinkBot and on Google Chrome using browser notifications.

Technically for this feature we are going to leverage [HAL.xyz](https://www.hal.xyz/) which provides an easy way to connect blockchain to off-chain/centralized solutions. 


**TRADERS - snx.link/trading**



*   Trading Portfolio Dashboard v.2

In this release Dashboard is enriched with new data and traders can see their historical **performance** or calculating it over a specific period of time.

Everything now is downloadable in .pdf or .csv format. 
A new section is activated within the Trading Portfolio Dashboard, “Strategy”.



*   Trading Strategy and Balancer

A set of trading strategies will be gradually made available within the new section. Any strategy will be applied without ever touching user Synths, completely non custodial leveraging SIP-10.

Depending on the chosen strategy, the user portfolio will be periodically rebalanced thanks to the **“Balancer”, a set of smart contracts able to trade user Synths according to the chosen strategy and the parameters set by the user.**

The first strategy available is the “**Zero Debt Strategy**”.



*   Zero Debt Strategy

This strategy has been specifically developed for the stakers.

The goal is to mirror the global positioning of traders and reduce the delta between the value of its debt and its Synths. In this way your debt and your synth value will increase in constant terms, protecting your C-Ratio.

A staker interested only in supporting the platform by staking SNX and receiving the fees generated by the exchange together with the SNX Inflation Rewards no longer has to worry about debt fluctuation.

This strategy could also be very valid for institutional investors interested in having an exposure in Synthetix benefiting from weekly rewards without having to worry about continuously rebalancing the portfolio..The non custodial side of the platform is attractive because it means lower risks and less management costs. 


**STAKERS - snx.link/staking**



*   Quick C-Ratio Fix

One button click to instantly fix the User C-Ratio proportionally burning the User Synths. 

In alternative to the proportional adjustment, the user can decide to prioritize the burning of sUSD or avoid the “quick fix” in case the trading fees needed to rebalance the C-Ratio are above a defined threshold he can define.



*   Guaranteed Autoclaim

Within the Synthetix Platform claim is available only for those stakers who maintain a C-Ratio higher than the “Target Collateralization Ratio” and this requires to the users to constantly monitor the portfolio and carry out trades periodically to ensure that it is above the threshold and therefore they are eligible for the claim for fees and rewards.

This is rather annoying and it often happens that users forget or do not have time to do these operations without benefiting from their role as stakers.

With the Guaranteed Autoclaim, SNX Link manages these recurring operations on behalf of the stakers ensuring them the weekly claim even when their C-Ratio is below the threshold thanks to a set of smart contracts that burns user Synths according to the specified parameters defined by the User. The feature is the automation and the extension of Quick C-Ratio Fix described above.



*   Synths Compare v.2

During Phase A users could easily track their Synths Allocation compared to the Allocation of the entire Synthetix Platform.

Now it’s possible to monitor how these have been changed over the time together with the overall fluctuation of the value of their Synths compared to their respective debt. 




*   SNX Purchase / Mint - Kyber Integration

Users can manually increase their C-Ratio in two ways: buying more SNX and mint more sUSD or burning sUSD.

In Phase B Stakers could see the amount of SNX needed to fix their C-Ratio, buy them through Kyber and mint sUSD.

#### Phase C - Not Started Yet

 
**GROWTH**



*   Multi-Language

English is not the only language in the world and SNX Link wants to be the gateway to the Synthetix platform for anyone, so our goal is to translate the platform in the most spoken languages: 



*   Italian
*   Chinese
*   Indian
*   Spanish
*   French
*   Russian

Thanks to our network, we are going to partner with country specific communities educating and helping them on platform promotion.
 
**TRADING - snx.link/trading**



*   New Trading Strategies

The following trading strategies will be introduced.



*   **Top Crypto Strategy Equally Weight (50 BTC | 50 ETH)**
*   **Real Assets Strategy Equally Weight  (50 STOCKS | 50 GOLD)**
*   **Mixed Strategies voted by the community**

Users can choose one of these trading strategies and define a few parameters to trigger the rebalancing and their Synths will be then rebalanced 50/50 according to them.

Top Crypto EQ WT allows users to maintain a long position on the top crypto in the market, rebalancing periodically the portfolio, while the Real Assets EQ WT allows users to maintain an exposure on the real assets available on Synthetix Platform. 
 

**STAKERS - snx.link/staking**



*   Sablier Integration

SNX Link takes security very seriously and all the completed and planned technical solutions have been studied with the aim of minimizing losses of any kind.

The only assets to which the SNX Link smart contracts have access are the ETH pre-conferred by users to perform operations on their behalf. 

By applying maximum prevention since Phase A (already completed) the above funds are not centralized and for every user SNX Link created a separate shared [Gnosis MultiSig Wallet](https://wallet.gnosis.pm/).

To reduce risk during the Phase B SNX Link intends to use [Sablier Stream](https://sablier.finance/) for the ETH amounts the users pay to claim their weekly rewards through “AutoClaim” in order to receive payments weekly and not all upfront.



*   RatioStat

RatioStat allows you to keep your C-Ratio level within a certain desired threshold using an algorithm that mint and burn Synths. 
 
This helps the entire system to be more collateralized and consequently solid, allowing a sustainable debt growth. 




*   Cash In / Out Option

The missing piece for the mainstream is the fiat currency. 
 
Crypto world is still too small and one of SNX Link's goals is to attract non-crypto users or traditional investors. An increasing number of people are switching from banking brokerage services to the brokerage services introduced by catchy fintech apps.

SNX Link is going to give them the same level of experience with all the advantages of decentralization. To achieve this cash in / out options will be added.

After analyzing several players SNX Link is going to use Wyre for the ramp-in and Moonpay for the cash-out.

**KEEPERS - snx.link/keepers**

Keepers are an essential part of the platform, they execute transactions on behalf of the user to realize their goals. 
 
We want to offer them a simple dashboard to keep track of their actions and a recap of the rewards they earned. 
 
Indeed we want to improve the part dedicated to showing potential opportunities (e.g. current autoclaim keeper dashboard) and leverage notifications to inform them or trigger eventual automations on their side.

#### Phase D - NOT STARTED YET

After the first three phases, SNX Link is ready to become the leading platform as portfolio management in the crypto world but not only. 
 
- **Meta Strategy**

During this release new specific trading strategies will be introduced together with the Meta Strategy, the possibility to manage your portfolio with more strategies.

In the financial world a portfolio is divided into big categories (strategy allocation) and then in subcategories (tactical allocation) which one with a respective strategy.

Thanks to the Meta Strategy users can compose strategies being able to have an **holistic management** of their wealth.

Planned strategies for Phase D at the moment are:



*   **Fixed Weight.** The user defines a specific weight for his preferred Synths.
*   **Store of Value Strategy (50 BTC | 50 GOLD)**
*   **Algo Strategies**
*   **Other Strategie**

In any case Synths portfolio will be rebalanced periodically according to the parameters defined by the user.



*   Copy Trading

Users will be able to delegate their capitals to a specific address (such as an advisor or a particular trader) to mirror its trading strategy in exchange for a fee paid in advance for a specific period of time.

The fee will be paid using [Sablier Stream](https://sablier.finance/) introduced in Phase B to minimize any kind of risk and keeping the “advisory” fee recurring as usual in the finance industry.



*   Synths Accumulation Plan

Accumulation Plan is one of the most used investment strategies where an investor contributes a specified amount of money to a specific bunch of Synths on a periodic basis.

SNX Link will enable users to easily increase their active positions with regular contributions that could be originated by the sUSD claimed for the SNX Stacking, by Sablier Streams or new inflows (e.g. fiat).



*    Audit 

During the Phase 3 it will be required an audit of the entire smart contract collection developed.


## 
**Traction:**

SNX Link was launched on April 12th 2020 with its V.1 that included the Autoclaim. 
 
One week later Keeper’s Dashboard was introduced to give the possibility to anyone to become a keeper without coding skills starting to earn ETH every week.

During these two weeks, 10+ keepers claimed on behalf of users a total of 1.115,85 SNX and 31,83 sUSD through SNX Link and 74 weeks of claims have been delegated!

Furthermore SNX Link has been appreciated in several tweets by some of the most active traders and community members of Synthetix.


## 
### Previous work:

Me and [Simone](https://github.com/SC92) led the business/technical development of the Eidoo wallet with a strong focus on the DeFi integrations such as Compound, Fulcrum, MakerDAO, Kyber, Uniswap, Bancor, WBTC.

[https://eidoo.io/](https://eidoo.io/)

We actively participated in the ecosystem by providing our contribution to various initiatives. 

[https://sai2dai.xyz/](https://sai2dai.xyz/)  - A tool we developed to track Maker SCD MCD migration

[https://backstopsyndicate.com/](https://backstopsyndicate.com/) - Backstop Syndicate Initiative together Dharma and other players


## 
### Timeline and Budget


The project as illustrated in the previous section is divided into four phases, each of which provides a set of features to be delivered and a respective budget proportional to the time needed and to the people involved, internal or external to the SNX Link team.

We are asking for the grant at this stage to cover the first part of the phase A that we already delivered, conviced that this product can bring immense benefit to the entire platform in terms of adoption and value for Synthetix community.    

For a total in this moment of 25k SNX.  
  
In the meantime we are proceeding with the next phases we described above.

## 
### Ethereum Address:


0x776bf6AD64ccE700837Cb803aa4F6c4c516bB90A


<!-- Docs to Markdown version 1.0β22 -->
