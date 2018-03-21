pragma solidity 0.4.19;

import "zeppelin-solidity/contracts/math/SafeMath.sol";

import "./LandBase.sol";


/**
 * @title Prefecture
 */
contract PrefectureToken is LandBase {
    using SafeMath for uint256;

    string public constant symbol = "PFT";
    string public constant name = "Prefecture";

    event Snatch(uint256 indexed _tokenId,
               uint256 indexed _weiValue,
               address _from,
               address indexed _to);

    /**
    * @dev Claims the ownership of a given token ID
    * @param _tokenId uint256 ID of the token being claimed by the msg.sender
    */
    function _takeOwnership(uint256 _tokenId) private {
      // require(isApprovedFor(msg.sender, _tokenId));
      clearApprovalAndTransfer(ownerOf(_tokenId), msg.sender, _tokenId);
    }

    // payable
    /* function snatch(uint256 _tokenId, uint256 _addWei) */
    function snatch(uint256 _tokenId)
        public
        payable
    {
        // check value
        var token = landTokens[_tokenId];
        require(token.id != 0);

        var _origOwner = ownerOf(_tokenId);
        require(msg.sender != _origOwner);
        require(msg.value >= token.weiValue);

        // change value
        token.weiValue = msg.value;

        // transfer eth
        _origOwner.transfer(msg.value);
        // transfer token
        _takeOwnership(_tokenId);

        Snatch(_tokenId, msg.value, _origOwner, msg.sender);
    }
}
