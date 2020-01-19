pragma solidity 0.5.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GrantsDAO {

  struct Proposal {
    bool active;
    address receiver;
    uint256 amount;
    uint256 createdAt;
  }

  uint256 public counter = 1;
  IERC20 public SNX;

  mapping(uint256 => Proposal) public proposals;
  mapping(address => bool) public teamMembers;
  mapping(address => bool) public communityMembers;

  event NewProposal(address receiver, uint256 amount);

  constructor(
    address _snx,
    address[] memory _teamMembers,
    address[] memory _communityMembers
  ) public {
    for (uint i = 0; i < _teamMembers.length; i++) {
      teamMembers[_teamMembers[i]] = true;
    }
    for (uint i = 0; i < _communityMembers.length; i++) {
      communityMembers[_communityMembers[i]] = true;
    }

    SNX = IERC20(_snx);
  }

  function createProposal(
    address _receiver,
    uint256 _amount
  ) external onlyProposer() {
    require(_amount <= SNX.balanceOf(address(this)), "Invalid funds on DAO");
    proposals[counter] = Proposal(true, _receiver, _amount, block.timestamp);
    counter++;
    emit NewProposal(_receiver, _amount);
  }

  modifier onlyProposer() {
    require(
      teamMembers[msg.sender] ||
      communityMembers[msg.sender],
      "Not proposer"
    );
    _;
  }
}
