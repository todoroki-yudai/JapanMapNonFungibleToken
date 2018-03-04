pragma solidity 0.4.19;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract LandBase is ERC721Token {
    struct LandToken {
      uint256 id;
      string name;
      uint256 weiValue;
    }

    mapping (uint256 => LandToken) internal landTokens;
}
