## Title of proposal: 
Rework and bugfix Binary Options UI

## Description: 
Binary Options UI, although a big breakthrough, has brought a number of bug issues, incompatibilities with contract, as well as some insufficiently clear UI features.
The idea is gather all the feedback and reported issues throughout discord, and fix and enhance the UI where applicable, or rework it if the general concept is not clear enough to end users, or it requires a different approach to enable scaling.


## Motivation: 
To enable the core team to continue their work on new features and releases, grantsDao has offered to outsource UI improvements or rework of the binary options UI.

The idea is to use what is already built in order to minimize the additional effort, and keep the global look&feel of the synthetix.exchange.
If a rework or additional pages are required, they are to be clarified with grantsDao and community governance.

The list of potential improvements and feedback assembled so far is given in additional information.
Every item of the list is subject to feedback of community.

## Additional information: 
1. Change short/long terminology to "yes/no" and/or "above/less" as applicable on existing and/or newly built pages
2. Show odds clearly with percentages
3. Add bidding date column to options view
4. Show time in the bidding date and maturity date columns
5. Add filters on the options view:
    1. Show options in bidding phase
    2. Show options in trading phase
    3. Show options in maturity phase
    4. Show expired options
    5. Show mine
6. Above filter cans be combined
7. Add pagination to options view
8. Add filters/advanced search to options page:
    1. by asset
    2. by maturity date (before/after logic) 
    3. same for bidding date
9. Rephrase "Strike price" to "price above"
10. Change login terminology to connect wallet
11. Give more hints on the market creation page about bidding date, maturity date, skew ,etc...
12. Disable submitting market creation if minimal skew is not met
13. Make it clear that initial skew is immutable (check with contract creator if this is true)
14. Clearly specify minimal sUSD ammount (again check details with contract creator)
15. Only enable create market button if all conditions are met (I noticed weird behavior when creating markets myself)
16. The graph in the details view sometimes doesnt show the strike price if the current asset price is too low or too high
17. Withdrawal seems buggy and inconsistent with contract: Check exact rules and clearly depict them in UI
18. In trading phase clearly explain what claim options does and that is not needed for those wanting only to exersize their bids
19. Fix the bug where one can not exersize winnings if he has claimed options
20. TBD: Options trading UI, will be estimated once the requirements are clearer


## Previous work: 
This is my public toptal profile: https://www.toptal.com/resume/danijel-gornjakovic
Given my full time employment, I would partner up with another frontend developer to deliver results as soon as possible.

## Estimated hours: 
e.g. 
- 25 hours planning, communicating changes with community in discord, gathering feedback
- 100 hours building
- 25 hours rollout, reacting to QA and community feedback, and support

Estimate is given considering the list of work items assembled in additional information, with a buffer for smaller changes to the suggested items.
New requirements or pages would be additionally estimates when they become clear.


Total: 150 hours

## Price (SNX): 
~$30 per hour (50% off my rate towards toptal) = 13 SNX per hour with the current price of $2.3 per SNX
- 1950 SNX 

## Ethereum Address: 
0x461783A831E6dB52D68Ba2f3194F6fd1E0087E04
