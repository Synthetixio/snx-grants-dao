pragma solidity 0.5.13;

contract GrantsDAO {

  mapping(address => bool) public signers;

  constructor(address[] memory _signers) public {
    for (uint i = 0; i < _signers.length; i++) {
      signers[_signers[i]] = true;
    }
  }
}
