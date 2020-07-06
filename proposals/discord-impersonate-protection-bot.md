## Title of proposal: 
A bot to report users trying to impersonate core team, guardians, etc...

## Description: 
There is a constant effort to protect discord members from getting scammed by impersonators.
Its possible to react to new joiners or users changing their names and report if an impersonation get detected.

## Motivation: 
The idea is to build the bot by assembling all common questions&answers already available on official and community synthetix pages.
Additionally, I would build a framework for anyone to add more questions&answers with git PRs.

## Additional information: 
1. The bot will react  to guildMemberAdd event and check if the name ressembles that of a predefined list of protected names
2. The bot will react  to guildMemberUpdate event and check if the name ressembles that of a predefined list of protected names
3. If an impersonation is detected, a message is pushed to the channel "impersonation-protection" and guardins get a change to delete this user
4. Alternately, the user can be deleted programatically
## Previous work: 
This is my public toptal profile: https://www.toptal.com/resume/danijel-gornjakovic

## Estimated hours: 
e.g. 
- 32h


## Price (SNX): 
- 500 SNX
## Ethereum Address: 
0x461783A831E6dB52D68Ba2f3194F6fd1E0087E04 