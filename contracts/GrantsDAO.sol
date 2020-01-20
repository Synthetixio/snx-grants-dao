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
  uint256 public members;
  uint256 public locked;

  IERC20 public SNX;

  struct Proposal {
    bool teamApproval;
    address receiver;
    uint256 amount;
    uint256 createdAt;
    uint256 approvals;
    mapping(address => bool) voted;
  }

  mapping(uint256 => Proposal) public proposals;
  mapping(address => bool) public teamMembers;
  mapping(address => bool) public communityMembers;

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
      members++;
    }
    for (uint i = 0; i < _communityMembers.length; i++) {
      communityMembers[_communityMembers[i]] = true;
      members++;
    }

    toPass = _toPass;
    SNX = IERC20(_snx);
  }

  /**
   * @notice Called by proposers (team or community) to propose funding for an address.
   * Emits NewProposal event.
   * @param _receiver The address to receive funds if proposal executes
   * @param _amount The amount that the receiver will receive
   */
  function createProposal(
    address _receiver,
    uint256 _amount
  ) external onlyProposer() {
    require(_amount > 0, "Amount must be greater than 0");
    require(_receiver != address(0), "Receiver cannot be zero address");
    uint256 available = SNX.balanceOf(address(this)).sub(locked);
    require(_amount <= available, "Unavailable funds on DAO");

    uint256 _counter = counter; // Pull counter into memory to save gas
    counter = _counter.add(1);

    proposals[_counter] = Proposal(false, _receiver, _amount, block.timestamp, 1);

    // If a proposal is created by a team member, mark it as approved by the team
    if (teamMembers[msg.sender]) {
      proposals[_counter].teamApproval = true;
    }

    locked = locked.add(_amount);
    proposals[_counter].voted[msg.sender] = true;

    emit NewProposal(_receiver, _amount, _counter);
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
   * @notice Called by team members to withdraw extra tokens in the contract
   * @dev Will not allow withdrawing balances locked in proposals
   * @param _receiver The address to receive tokens
   * @param _amount The amount to withdraw
   */
  function withdraw(address _receiver, uint256 _amount) external onlyTeamMember () {
    require(_amount <= withdrawable(), "Unable to withdraw amount");
    assert(SNX.transfer(_receiver, _amount));
  }

  /**
   * @notice Allows community members to be added as proposers and voters
   * @param _member The address of the community member
   */
  function addCommunityMember(address _member) external onlyTeamMember() {
    communityMembers[_member] = true;
  }

  /**
   * @notice Allows community members to be removed
   * @dev The caller can specify an array of proposals to have the member's vote removed
   * @param _member The address of the community member
   * @param _proposals The array of proposals to have the member's vote removed from
   */
  function removeCommunityMember(address _member, uint256[] calldata _proposals) external onlyTeamMember() {
    delete communityMembers[_member];
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
  }

  /**
   * @notice Allows team members to be removed
   * @param _member The address of the team member
   */
  function removeTeamMember(address _member) external onlyTeamMember() {
    // Prevents the possibility of there being no team members
    require(msg.sender != _member, "Cannot remove self");
    delete teamMembers[_member];
  }

  /**
   * @notice Shows the balance of the contract which can be withdrawn by team members
   * @return The withdrawable balance
   */
  function withdrawable() public view returns (uint256) {
    return SNX.balanceOf(address(this)).sub(locked);
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
    emit DeleteProposal(_proposal);
  }

  /**
   * @dev Private method to execute a proposal
   * @param _proposal The proposal number to delete
   */
  function _executeProposal(uint256 _proposal) private {
    Proposal memory proposal = proposals[_proposal];
    delete proposals[_proposal];
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
