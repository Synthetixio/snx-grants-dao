
## SNX-Governance-DiscordBot

## Description: 
A JavaScript-based, open source Discord bot to facilitate better #governance-poll experience.

## Motivation: 
The recent vote-brigading has shown that some attention needs to be given to the #governance-poll system we use on Discord.  This proposal is to create a relative simple bot to manage polls for the Discord so as to promote ease of use, confidence, and transparency in the results.

A bot is preferred due to limitations in the default way Discord handles the emoji-based reaction system, and also gives a lot of flexibility with repect to any future enhancements desired.

There are many Discord voting bots on the market, but most have the same fatal flaw of being emoji-based, and I believe strongly that a purpose built solution for Synthetix makes the most sense as we continue to experiement on the process.

## Additional information: 

### DISCORD ROLE BASED

This will be primarily Discord role-based, and will be configurable to whatever final outcome is desired, but I will propose that there be 2 functional roles:
- `ORGANIZER` - this role will be the top level, they need the following funcitons:
   - `!createPoll` - starts a new poll, will need to supply the prompt and options
   - `!updatePoll` - functions to update a curently running poll title/content/end
   - `!addVoter` - adds a new user to the voter registry (can be managed through discord UI by role, too)
   - `!endPoll` - closes/locks poll, and publishes finalized results
- `VOTER`
   - `!{voteOption}` - vote for to a particular option (can change an already casted vote, optionally?)
   - `!withdrawVote` - remove vote from being counted
- `BOT`
   - the bot will exist primarily to listen for user actions and react approppriately (see Poll Lifecycle, below)
   - needs permission be able to make/delete temporary channels for use in polls
   - needs permission to post/update vote results to the #governance-polls channel

### Poll Lifecycle 

- either DM the `BOT`, or have a `MODERATOR`-only chat channel for `POLL` creation
- MODERATOR send correctly formatted chat (i.e. !create "Poll Title")
- BOT will react by instantiating a new poll and return an ID (i.e. poll {ID} "{TITLE}" created
- MODERATOR will then set/update POLL parameters - if no ID it will default most recent, ID required if running multiple polls at once
- MODERATOR calls startPoll which will create a chat channel, per vote topic specifically for the poll that only can be seen by VOTER and MODERATOR
- BOT will listen to this channel for voter commands (i.e.!A or !B, matching the poll options).  votes will be tallied and displayed in the publicly-visible #governance-polls channel while vote continues.  BOT will also clean up chat in the voting channel so doesnt get clogged and all non-voting chatter will be deleted as well
- BOT will delete/archive the vote-colleciton chat channel upon vote close, and publish final results to #governance-polls for public consumption

### Future Applications

Not included in this proposal, but certainly part of the value is the future experiments that having our own bot will enable. 

Potential future features include:
    - We can track/display/reward voting history and can discover 'unusual activity' 
    - separate voter preference sliced by voter engagement/account history etc.
    - automatically assign voter roles based on discord statistics (no more moderator-approval necessary)
    - Connect the bot to on-chain data - (maybe distribute ERC-721 or other clever ideas with blockchain integration)

I would be very interested in discussing success/failures in this PoC and then making further proposals to work on this codebase

### Hosting

I am willing to self-host on my own hardware as the initial deployment (provided a small chance of potential instability is acceptable), but am open to coordinating with someone else if you already have a preferred hosting system for JS apps.  I am also willing to submit an additional proposal to manage the bot hosting, if you would like me to manage it longer-term.

## Previous work: 

I am a full stack JS dev with a lot of experience managing NodeJS applications and have spent hobby time in the past on Discord API/bots.

My professional history can be found on LinkedIn: psybull


## Estimated hours: 

- 5 hours planning
- 15 hours coding initial PoC
- 5 hours debugging/tweaking features based on feedback 

Total: 25 hours

## Price (SNX): 

25 hours x 25 SNX/hr = 625 SNX

## Ethereum Address: 

pay.psybull.eth
