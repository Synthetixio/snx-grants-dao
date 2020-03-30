## Title of proposal: 
Mintr + DefiSnap Debt Analytics

## Description: 
Add debt tracking and anaylitics to Mintr and DefiSnap.

The goal of this proposal is to help minters understand their debt by isolating mints and burns from the on-chain debt. 
This will give the Minter a good idea on how the debt pool fluctuates.

E.g.: 
I mint 100 sUSD and burn 50 sUSD. A day later my debt is at 52 sUSD. 
This would mean that the debt pool has fluctuated by 2 sUSD against me. 
The goal is to help minters visualize this information at any point in time.

## Motivation: 
It is currently very hard for minters to understand their debt, thus adding friction to the experience.  

## Additional information: 
Check out this demo -> defisnap.io/#/kain. 

It shows two charts with the gross debt(mint and burn debt), actual debt(on-chain debt) and net debt(isolated debt).

- The first chart has the gross debt applied retroactively (from present debt)
- The second chart has the gross debt applied from the first mint and burn event.

## Previous work: 
defisnap.io

## Price (SNX):
- 1000 SNX upfront (for DefiSnap integration)
- 7500 SNX for renting archive node
- 15000 SNX on final Mintr integration

## Ethereum Address: 
0x43a5C1331375f1F34BD774eCaeE51501E9Ca2dB5
