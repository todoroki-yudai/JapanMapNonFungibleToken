pragma solidity 0.4.19;

import "zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract LandBase is ERC721Token {

    event Mint(uint256 indexed _tokenId,
               uint256 indexed _weiValue);

    struct LandToken {
      uint256 id;
      string name;
      uint256 weiValue;
    }

    mapping (uint256 => LandToken) internal landTokens;

    function getToken(uint256 _tokenId)
        public
        constant
        returns (uint256, string, uint256, address)
    {
        var token = landTokens[_tokenId];
        require(token.id != 0);
        return (token.id, token.name, token.weiValue, ownerOf(_tokenId));
    }

    modifier onlyNonexistentToken(uint256 _tokenId) {
        require(landTokens[_tokenId].id == 0);
        _;
    }

    function mint(uint256 _tokenId, string _name, uint256 _weiValue)
        public
        onlyNonexistentToken(_tokenId)
    {
        require(msg.sender != address(0));

        LandToken memory _token = LandToken({
            id: _tokenId,
            name: _name,
            weiValue: _weiValue
        });
        landTokens[_tokenId] = _token;
        _mint(msg.sender, _tokenId);

        Mint(_tokenId, _weiValue);
    }
}
