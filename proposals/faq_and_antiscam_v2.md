## Title of proposal: 
Additional features for the FAQ and antiscam Synthetix bots

## Description: 
This proposal is meant to sum up the additional features delivered and to be delivered in regards to the original scope and estimates to both FAQ and antiscam bots.
## Motivation: 
FAQ bot was very well accepted by the community. It's been very helpful in onboarding new users and helping with those frequent question,
but even more so with its dynamic features, such as gas and snx price feeds.  
Based on community feadback I have gathered and implemented many additional dynamic features, which have become immensely used, such as rewards calculator and gas price notification subscription.  
I have also gathered a list of features to be additionally implemented in the following few weeks.  

Antiscam bot was proven useful and helped in preventing bad actors from making a bigger impact on our discord.  
I additionally implemented a full sweep of all discord users in our discord, which helped up clean a few known spammers already residing in the server for some time.  
Per guardians request I added a feature to query users by id to get their bans history.  
I also added a check for any user that write in OTC channel whether they have been in the server for at least 7 days.  

## Additional information: 
### FAQ bot
#### Implemented additional features
* Rewards calculator in SNX based on debt pool and inflation schedule
* Rewards calculator in sUSD based on current exchange volume scaled to full week period
* Push notifications for users who subscribe to a gas threshold
* Exchange volume for the current period
* Current synths distribution in the debt pool
* Integrated peg feed with 1inch API
* Integrated SNX price feed with binance and kucoin API
* Countdown till rewards
* SNX tools integration for more data feeds to be added ad hoc
* Dashboard integration for more data feeds to be added ad hoc
* Custom gas price for rewards calculation
#### Features to be implemented
* On demand price feed for every synth
* All synths and their prices in one call sorted by top gainers
* sDefi details and breakdown
* sCex details and breakdown
* Introduce variables to be used in responses, e.g. {cRatio}
* Endpoint for minimun profitable SNX staking ammount at given gas price
* SNX price chart (to be checked for feasability)
* Long (DM) and short (channel) answer mode 

### Antiscam bot
#### Implemented additional features
* Full scan of all users
* Querying users by id
* OTC channel warnings
#### Features to be implemented
* Additional info when querying user:  
  * Joined date
  * Messages count
* Add a database to store message count per user
* Automated warnings on tagging team members (if wanted by core contributors)

## Previous work:
Bots are already built and live.   
This is my public toptal profile: https://www.toptal.com/resume/danijel-gornjakovic

## Estimated hours: 
* 50h FAQ bot implemented additional features
* 40h FAQ bot features to implements
* 40h Buffer for additional features and reacting to suggestions and feedback
* 130h total  
---

* 10h antiscam implemented additional features
* 20h antiscam features to implement
* 20h Buffer for additional features and reacting to suggestions and feedback
* 50h total

## Price (SNX): 
180h at 5 SNX per hour = 900 SNX
## Ethereum Address: 
0x461783A831E6dB52D68Ba2f3194F6fd1E0087E04 
