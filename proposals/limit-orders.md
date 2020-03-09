## Title of proposal: 
Limit order functionality for Synthetix exchange

## Description: 
Currently, Synthetix exchange orders are “market” orders, where the user decides the amount they wish to sell and the order is executed at the market price determined by the oracles.

This proposal will add "limit" order functionality so users can set a price at which they would like their buy or sell order to be executed instead of having to be online at the time the market reaches their desired price.

The functionality will be added without needing to modify the core synthetix contracts, by creating a smart contract that interacts with the exchange contract.

## Motivation: 
Since Synthetix users are often motivated to use Synthetix assets for trading purposes, the exchange should offer more advanced functionality that caters to their needs, without compromising the core contracts.

## Additional information: 

### Solution

To keep the integrity of the core Synthetix contracts in place, we propose the creation of a separate layer of “advanced mode” trading contracts to enable additional functionality. The primary contract is a limit order contract. The exchange users can place limit orders on it and send the order source amount to it. Additionally, they specify the parameters of limit orders, including destination asset price, allowed slippage and execution fees.

The contract then exposes a public “executeTrade” function that, when the limit order conditions are met, anyone can call in return for the users-specified fee.

By allowing anyone to run “order execution nodes” and compete for limit order execution fees, we achieve order execution reliability and censorship-resistance through permissionless-ness. These are especially important in the context of limit orders, where censorship or execution delays might cause trading losses.

The greater benefit of this approach is that it enables future extended functionality for the Synthetix exchange, without needing to modify the core contracts.

### High-Level Architecture

**Limit order contract**
This contract acts as an intermediary between limit order users and “order execution nodes”. It serves multiple uses:
- It allows users to place limit orders including destination asset price, maximum slippage and order execution node fee
- It allows users to cancel active unfulfilled limit orders
- It allows nodes to watch for newly placed limit order events
- It allows nodes to execute placed limit orders on Synthetix exchange
- It rejects nodes limit order execution attempts if the order parameters do not match the current Synthetix price oracle state.

**Order execution node**
The order execution node will allow the Synthetix team, as well as independent node operators, to serve users who are looking to execute limit orders while they are offline. The node will by default watch for limit orders of all Synthetix users, but can instead be configured to serve a specific address exclusively (e.g. the operator’s own trading account).

**Javascript Limit-Order Library**
To provide developer tooling for both the official and unofficial Synthetix exchanges interfaces, we will either provide a separate Javascript library for Synthetix limit orders or we will add the functionality to the official SynthetixJS library.


## Previous work: 
Mosendo team has created relayers and smart contract wallets which are relevant to the architecture of this proposal:
- https://github.com/mosendo/gasless.js
- https://mosendo.com/
- https://medium.com/lamarkaz/dai-in-the-hands-of-all-8ed335879ae9

## Estimated hours: 
This is an R&D proposal which will result in a full technical spec of this feature and an estimate for completing the feature.

- 1-2 weeks of research and spec

## Price: 

- 5000 sUSD

## Ethereum Address: 
- `tomhoward.eth`
