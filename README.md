# Synthetix Grants DAO

## Usage

### Voting

#### `createProposal`

This function allows proposers, which can be team or community members, the ability to create a prposal for funding of a receiver address for a specified amount. When the proposal is created, it is automatically counted as voted on by the proposer and assigned a unique number. Proposals remain in a submission phase for 2 days before they can be voted on.

#### `voteProposal`

After a proposal has been in the submission phase for 2 days, it enters the voting phase for the next 7 days. While in the voting phase, proposers may vote on the proposal. Community members may wish to withhold their votes in order to vote against a proposal. If a team member votes against a proposal, it is automatically deleted. Each proposal needs at least one team member to approve in order for the proposal to execute.

#### `deleteProposal`

If a proposal did not receive enough votes within the voting phase, this function may be called in order to clean up the smart contract's storage and to unlock the funds associated with the proposal.

### Team Only

#### `withdraw`

If extra tokens need to be withdrawn from the contract, this method may be used to retrieve them. This can only be called by team members and will not allow balances to be pulled out which are locked in proposals.

#### `addCommunityMember`

Community members may be added to the contract so that new addresses can propose funding and vote on existing proposals.

#### `removeCommunityMember`

Community members may be removed by a team member from being able to vote or propose grants. An array of proposals may also be specified to have that member's vote removed.

#### `addTeamMember`

Team members may be added to the contract since all proposals need at least one team approving vote.

#### `removeTeamMember`

Team members may also be removed from the contract, but a team member cannot remove themself. This prevents a scenario where no team members are on the contract, which would mean no proposals could be executed and no tokens could be withdrawn.

#### `updateToPass`

This function allows the number of votes required to pass a proposal to be updated. It should be noted that all proposals still require approval by at least one team member, even if this number has been met.

### Views

#### `withdrawable`

Returns the amount of tokens which may be withdrawn from the contract by team members. This excludes the amount locked in proposals.

#### `voted`

This function may be used to check if an address has voted on a proposal, regardless if they voted `true` or `false`.

#### `votingPhase`

This function may be used to check if a proposal is in the voting phase. It will return `true` if it is, `false` if not.

## Install

```
npm install
```

## Test

```
npm test
```
