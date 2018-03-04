pragma solidity 0.4.19;

import "./LandBase.sol";


/**
 * @title Prefecture
 */
contract Prefecture is LandBase {

    string public constant symbol = "PFT";
    string public constant name = "Prefecture";

    function getToken(uint256 _tokenId)
        public
        constant
        returns (uint256, string, uint256, address)
    {
        var token = landTokens[_tokenId];
        if(token.id == 0) throw;
        return (token.id, token.name, token.weiValue, ownerOf(_tokenId));
    }

    function mint(uint256 id, string name, uint256 weiValue)
        public
    {
        require(msg.sender != address(0));
        LandToken memory _token = LandToken({
            id: id,
            name: name,
            weiValue: weiValue
        });
        landTokens[id] = _token;
        _mint(msg.sender, id);
    }

    // payable
    // TODO: how to specify tokenId by app
    function deposit(address _to, uint256 _tokenId)
        public
        payable
    {
        // check value
        var token = landTokens[_tokenId];
        if(token.id == 0) throw;
        require(msg.value >= token.weiValue);

        // change value
        token.weiValue = msg.value;

        // transfer eth
        // TODO: withdraw ?
        _to.transfer(msg.value);
        // transfer token
        transfer(_to, _tokenId);
    }

    /**
    * @dev Claims the ownership of a given token ID
    * @param _tokenId uint256 ID of the token being claimed by the msg.sender
    */
    function _takeOwnership(uint256 _tokenId) private {
      // require(isApprovedFor(msg.sender, _tokenId));
      clearApprovalAndTransfer(ownerOf(_tokenId), msg.sender, _tokenId);
    }

    // payable
    // TODO: how to specify tokenId by app
    function snatch(uint256 _tokenId)
        public
        payable
    {
        // check value
        var token = landTokens[_tokenId];
        if(token.id == 0) throw;

        var _origOwner = ownerOf(_tokenId);
        require(msg.sender != _origOwner);
        require(msg.value >= token.weiValue);

        // change value
        token.weiValue = msg.value + 1;

        // transfer eth
        // TODO: withdraw ?
        _origOwner.transfer(msg.value);
        // transfer token
        _takeOwnership(_tokenId);
    }
}
