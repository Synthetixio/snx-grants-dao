## Title of proposal: 
A bot to report known scammers and users trying to impersonate core team, guardians, etc...

## Description: 
There is a constant effort to protect discord members from getting scammed by impersonators.
Its possible to react to new joiners or users changing their names and report if an impersonation get detected.

Community member DKOB has offered resources where he keeps track of all banned spammers accross 500 discord channels.
Those scammers bounce arround and many will try to join synthetix discord. We can recognize them and report when they join.
## Motivation: 
The bot would react to events related to user joining or renaming and either push a message to report an impersonation or delete the user automatically if that is the approach chosen.
The bot will report if a know scammer joins based on the feed from 500 discord channels and their banned users.
The bot will reach to messages containing predefined curse/swear words and warn the user that they might be banned if they continue with that language. The bot will suggest to take that type of communicaiton to trollbox channel.
## Additional information: 
1. The bot will react  to guildMemberAdd event and check if the name ressembles that of a predefined list of protected names, or the name is in the list of known scammers
2. The bot will react  to guildMemberUpdate event and check if the name ressembles that of a predefined list of protected names, or the name is in the list of known scammers
3. If an impersonation is detected, a message is pushed to the channel "scam-protection" and guardins get a change to delete this user
4. Alternately, the user can be deleted programatically
5. The bot will also react to known swear/curse words outise trollbox channel and warn those users that they might be banned.
## Previous work: 
This is my public toptal profile: https://www.toptal.com/resume/danijel-gornjakovic

## Estimated hours: 
1. Implement the logic with impersonation detection
    1. User name matches a protected name fully
    2. User name resembles a protected name (e.g. KAINE)
    3. Implement pattern matching based on previous impersonation examples
    4. Implement image similarity check on avatar against the list of known avatars for privileged users
2. Implement logic to push messages to the scam-protection channel
3. Implement the list of protected names
4. Implement integration with DKOBs feed on known scammers
5. Report if a known scammers joins
6. Implement logic for known swear/curse words outside trollbox channel
- 100h


## Price (SNX): 
- 1000 SNX
## Ethereum Address: 
0x461783A831E6dB52D68Ba2f3194F6fd1E0087E04 
