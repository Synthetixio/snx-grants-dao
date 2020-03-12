pragma solidity 0.5.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

/**
 * @title Synthetix Grants DAO
 * @notice This contract allows for grants to be proposed and voted on by community members
 * and the Synthetix team. All proposals must receive at least one approving vote by a
 * Synthetix member before funds will transfer.
 */
contract GrantsDAO {

  using SafeMath for uint256;

  uint256 public constant SUBMISSION_PHASE = 2 days;
  uint256 public constant VOTING_PHASE = 9 days; // for 7 days after the submission phase
  uint256 public toPass;
  uint256 public counter = 1;
  uint256 public locked;

  IERC20 public SNX;

  struct Proposal {
    bool teamApproval;
    address receiver;
    uint256 amount;
    uint256 createdAt;
    uint256 approvals;
    string description;
    string url;
    mapping(address => bool) voted;
  }

  mapping(uint256 => Proposal) public proposals;
  mapping(uint256 => Proposal) public completeProposals;
  mapping(address => bool) public teamMembers;
  mapping(address => bool) public communityMembers;

  address[] private teamAddresses;
  address[] private communityAddresses;
  uint256[] private validProposals;
  uint256[] private completeProposalIds;

  event NewProposal(address receiver, uint256 amount, uint256 proposalNumber);
  event VoteProposal(uint256 proposal, address member, bool vote);
  event ExecuteProposal(address receiver, uint256 amount);
  event DeleteProposal(uint256 proposalNumber);

  /**
   * @notice Contract is created with an initial array of team and community members
   * which will be stored in mappings
   * @param _snx The address of the SNX token
   * @param _teamMembers An array of addresses for the team members
   * @param _communityMembers An array of addresses for the community members
   * @param _toPass The number of votes each proposal is required in order to execute
   */
  constructor(
    address _snx,
    address[] memory _teamMembers,
    address[] memory _communityMembers,
    uint256 _toPass
  ) public {
    require(_teamMembers.length > 0, "Need at least one teamMember");
    require(_toPass <= (_teamMembers.length + _communityMembers.length), "Invalid value to pass proposals");

    // Add members to their respective mappings and increase members count
    for (uint i = 0; i < _teamMembers.length; i++) {
      teamMembers[_teamMembers[i]] = true;
      teamAddresses.push(_teamMembers[i]);
    }
    for (uint i = 0; i < _communityMembers.length; i++) {
      communityMembers[_communityMembers[i]] = true;
      communityAddresses.push(_communityMembers[i]);
    }

    toPass = _toPass;
    SNX = IERC20(_snx);
  }

  /**
   * @notice Called by proposers (team or community) to propose funding for an address.
   * Emits NewProposal event.
   * @param _receiver The address to receive funds if proposal executes
   * @param _amount The amount that the receiver will receive
   * @param _description The description of the proposal
   * @return The proposal number for reference
   */
  function createProposal(
    address _receiver,
    uint256 _amount,
    string calldata _description,
    string calldata _url
  ) external onlyProposer() returns (uint256) {
    require(_amount > 0, "Amount must be greater than 0");
    require(_receiver != address(0), "Receiver cannot be zero address");
    uint256 available = SNX.balanceOf(address(this)).sub(locked);
    require(_amount <= available, "Unavailable funds on DAO");

    uint256 _counter = counter; // Pull counter into memory to save gas
    counter = _counter.add(1);

    proposals[_counter] = Proposal(
      false,
      _receiver,
      _amount,
      block.timestamp,
      1,
      _description,
      _url
    );

    // If a proposal is created by a team member, mark it as approved by the team
    if (teamMembers[msg.sender]) {
      proposals[_counter].teamApproval = true;
    }

    locked = locked.add(_amount);
    proposals[_counter].voted[msg.sender] = true;
    validProposals.push(_counter);

    emit NewProposal(_receiver, _amount, _counter);

    return _counter;
  }

  /**
   * @notice Called by proposers (team or community) to vote for a specified proposal.
   * Emits VoteProposal event.
   * @param _proposal The proposal number to vote on
   * @param _vote Boolean to indicate whether or not they approve of the proposal
   */
  function voteProposal(uint256 _proposal, bool _vote) external onlyProposer() {
    require(votingPhase(_proposal), "Proposal not in voting phase");
    require(!proposals[_proposal].voted[msg.sender], "Already voted");
    proposals[_proposal].voted[msg.sender] = true;

    if (_vote) {
      if (teamMembers[msg.sender]) {
        proposals[_proposal].teamApproval = true;
      }
      proposals[_proposal].approvals = proposals[_proposal].approvals.add(1);

      // Only execute if enough approvals AND the proposal has at least one teamApproval
      if (proposals[_proposal].approvals >= toPass && proposals[_proposal].teamApproval) {
        _executeProposal(_proposal);
      }
    } else {
      // Allows a team member to automatically kill a proposal
      if (teamMembers[msg.sender]) {
        _deleteProposal(_proposal);
        // Do not emit VoteProposal if deleting
        return;
      }
    }

    emit VoteProposal(_proposal, msg.sender, _vote);
  }

  /**
   * @notice Called by proposers to clean up storage and unlock funds.
   * Emits DeleteProposal event.
   * @param _proposal The proposal number to delete
   */
  function deleteProposal(uint256 _proposal) external onlyProposer() {
    require(block.timestamp > proposals[_proposal].createdAt.add(VOTING_PHASE), "Proposal not expired");
    _deleteProposal(_proposal);
  }

  /**
   * @notice Returns the addresses for the active community members
   * @return Array of community member addresses
   */
  function getCommunityMembers() external view returns (address[] memory) {
    return communityAddresses;
  }

  /**
   * @notice Gets the addresses for the active team members
   * @return Array of team member addresses
   */
  function getTeamMembers() external view returns (address[] memory) {
    return teamAddresses;
  }

  /**
   * @notice Gets the proposal IDs of active proposals
   * @return Unsorted array of proposal IDs
   */
  function getProposals() external view returns (uint256[] memory) {
    return validProposals;
  }

  /**
   * @notice Gets the proposal IDs of complete proposals
   * @return Unsorted array of proposal IDs
   */
  function getCompleteProposals() external view returns (uint256[] memory) {
    return completeProposalIds;
  }

  /**
   * @notice Called by team members to withdraw extra tokens in the contract
   * @dev Will not allow withdrawing balances locked in proposals
   * @param _receiver The address to receive tokens
   * @param _amount The amount to withdraw
   */
  function withdraw(address _receiver, uint256 _amount) external onlyTeamMember() {
    require(_amount <= withdrawable(), "Unable to withdraw amount");
    assert(SNX.transfer(_receiver, _amount));
  }

  /**
  * @notice Allows team members to withdraw any tokens aside from the current set SNX token
  * @dev Will not allow withdrawing of the current SNX token
  * @param _receiver The address to receive tokens
  * @param _amount The amount to withdraw
  * @param _erc20 The address of the ERC20 token being transferred
  *
  */
  function withdrawERC20(address _receiver, uint256 _amount, address _erc20) external onlyTeamMember() {
    if (_erc20 == address(SNX)) {
      require(_amount <= withdrawable(), "Unable to withdraw amount");
    }
    assert(IERC20(_erc20).transfer(_receiver, _amount));
  }

  /**
   * @notice Allows community members to be added as proposers and voters
   * @param _member The address of the community member
   */
  function addCommunityMember(address _member) external onlyTeamMember() {
    communityMembers[_member] = true;
    communityAddresses.push(_member);
  }

  /**
   * @notice Allows community members to be removed
   * @dev The caller can specify an array of proposals to have the member's vote removed
   * @param _member The address of the community member
   * @param _proposals The array of proposals to have the member's vote removed from
   */
  function removeCommunityMember(address _member, uint256[] calldata _proposals) external onlyTeamMember() {
    delete communityMembers[_member];
    for (uint i = 0; i < communityAddresses.length; i++) {
      if (communityAddresses[i] == _member) {
        communityAddresses[i] = communityAddresses[communityAddresses.length - 1];
        communityAddresses.length--;
      }
    }
    for (uint i = 0; i < _proposals.length; i++) {
      require(proposals[_proposals[i]].voted[_member], "Member did not vote for proposal");
      delete proposals[_proposals[i]].voted[_member];
      proposals[_proposals[i]].approvals = proposals[_proposals[i]].approvals.sub(1);
    }
  }

  /**
   * @notice Allows team members to be added
   * @param _member The address of the team member
   */
  function addTeamMember(address _member) external onlyTeamMember() {
    teamMembers[_member] = true;
    teamAddresses.push(_member);
  }

  /**
   * @notice Allows team members to be removed
   * @param _member The address of the team member
   */
  function removeTeamMember(address _member) external onlyTeamMember() {
    // Prevents the possibility of there being no team members
    require(msg.sender != _member, "Cannot remove self");
    delete teamMembers[_member];
    for (uint i = 0; i < teamAddresses.length; i++) {
      if (teamAddresses[i] == _member) {
        teamAddresses[i] = teamAddresses[teamAddresses.length - 1];
        teamAddresses.length--;
      }
    }
  }

  /**
   * @notice Allows the number of votes required to pass a proposal to be updated
   * @param _toPass The new value for the number of votes to pass a proposal
   */
  function updateToPass(uint256 _toPass) external onlyTeamMember() {
    require(_toPass > 0, "Invalid value to pass proposals");
    toPass = _toPass;
  }

  /**
  * @notice Allows team members to update the SNX proxy address being used
  * @param _proxy The new proxy address to be used
  */
  function updateProxyAddress(address _proxy) external onlyTeamMember() {
    require(_proxy != address(SNX), "Cannot set proxy address to the current proxy address");
    SNX = IERC20(_proxy);
  }

  /**
   * @notice Shows the balance of the contract which can be withdrawn by team members
   * @return The withdrawable balance
   */
  function withdrawable() public view returns (uint256) {
    return SNX.balanceOf(address(this)).sub(locked);
  }

  /**
   * @notice Displays the total balance of the contract, including locked and withdrawable
   * @return The balance of the contract
   */
  function totalBalance() external view returns (uint256) {
    return SNX.balanceOf(address(this));
  }

  /**
   * @notice Checks to see whether an address has voted on a proposal
   * @return Boolean indicating if the address has voted
   */
  function voted(address _member, uint256 _proposal) external view returns (bool) {
    return proposals[_proposal].voted[_member];
  }

  /**
   * @notice Check to see whether a proposal is in the voting phase
   * @param _proposal The proposal number to check
   * @return Boolean indicating if the proposal is in the voting phase
   */
  function votingPhase(uint256 _proposal) public view returns (bool) {
    uint256 createdAt = proposals[_proposal].createdAt;
    return createdAt <= block.timestamp.sub(SUBMISSION_PHASE) &&
      block.timestamp <= createdAt.add(VOTING_PHASE);
  }

  /**
   * @dev Private method to delete a proposal
   * @param _proposal The proposal number to delete
   */
  function _deleteProposal(uint256 _proposal) private {
    locked = locked.sub(proposals[_proposal].amount);
    delete proposals[_proposal];
    for (uint i = 0; i < validProposals.length; i++) {
      if (validProposals[i] == _proposal) {
        validProposals[i] = validProposals[validProposals.length - 1];
        validProposals.length--;
      }
    }
    emit DeleteProposal(_proposal);
  }

  /**
   * @dev Private method to execute a proposal
   * @param _proposal The proposal number to delete
   */
  function _executeProposal(uint256 _proposal) private {
    Proposal memory proposal = proposals[_proposal];
    completeProposalIds.push(_proposal);
    completeProposals[_proposal] = proposal;
    delete proposals[_proposal];
    for (uint i = 0; i < validProposals.length; i++) {
      if (validProposals[i] == _proposal) {
        validProposals[i] = validProposals[validProposals.length - 1];
        validProposals.length--;
      }
    }
    assert(SNX.transfer(proposal.receiver, proposal.amount));
    emit ExecuteProposal(proposal.receiver, proposal.amount);
  }

  /**
   * @dev Reverts if caller is not a team member
   */
  modifier onlyTeamMember() {
    require(teamMembers[msg.sender], "Not team member");
    _;
  }

  /**
   * @dev Reverts if caller is not a proposer (team or community member)
   */
  modifier onlyProposer() {
    require(
      teamMembers[msg.sender] ||
      communityMembers[msg.sender],
      "Not proposer"
    );
    _;
  }
}
