# SIP 54: Limit Orders

## Description: 
This proposal is to implement SIP 54 which enables Limit Orders for the Synthetix exchange: https://sips.synthetix.io/sips/sip-54

## Motivation: 
To increase the flexibility of the Synthetix exchange, limit order functionality is needed so users can effectively trade synthetic assets. While limit orders can be trivial to implement in the case of centralized exchanges, in the case of a DEX such as Synthetix, limit orders can be challenging in terms of security guarantees and trustlessness due to client unavailability.

## Additional information: 
The full technical spec is available in SIP 54: https://sips.synthetix.io/sips/sip-54

## Previous work: 
Tom Howard and Nour Haridy from Mosendo are the authors of the SIP 54 spec. They have previously created relayers and smart contract wallets which are relevant to the architecture of this proposal:

- https://github.com/mosendo/gasless.js
- https://mosendo.com/
- https://medium.com/lamarkaz/dai-in-the-hands-of-all-8ed335879ae9

## Estimated hours: 
- Smart contracts: 4-5 weeks
- Execution node: 1-2 weeks
- JS Library: 1-2 weeks

Total: 6-9 weeks

After the smart contracts are complete, they can be reviewed by auditors and iterated on in parallel to the implementation of the Execution node and JS library.

## Price (SNX): 
$25k USD of SNX (31.5k SNX at time of writing)

_Note: does not include cost of auditors_

## Ethereum Address: 
0x6da94f37BE30D9AFAD1D057477fB91860F28C457
