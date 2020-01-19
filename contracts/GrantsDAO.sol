pragma solidity 0.5.13;

contract GrantsDAO {

  mapping(address => bool) public teamSigners;
  mapping(address => bool) public communitySigners;

  constructor(
    address[] memory _teamSigners,
    address[] memory _communitySigners
  ) public {
    for (uint i = 0; i < _teamSigners.length; i++) {
      teamSigners[_teamSigners[i]] = true;
    }
    for (uint i = 0; i < _communitySigners.length; i++) {
      communitySigners[_communitySigners[i]] = true;
    }
  }
}
