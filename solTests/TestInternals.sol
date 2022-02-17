// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../contracts/Dropper.sol";
import "../contracts/Collection.sol";

contract DropperInternals is Dropper {

}

contract CollectionInternals is Collection {

    constructor(uint lockdate, address dropper) Collection(lockDate, dropper) {

    }

    function _getNumber() public returns (uint256) { return getNumber(); }

    // Modify to take parameter rather than rely on a droppercall
    function _getSubId(
        uint256 _momentId, 
        uint256 _rarityId, 
        uint256 _seed) 
        public returns (uint256) {
        return getSubId(_momentId, _rarityId, _seed);
    }

    function _getRarity(
        uint256 _rarityMinimum, 
        uint256[] memory _rarityOdds, 
        uint256 _seed) internal pure 
        returns (uint256) {
        return getRarity(_rarityMinimum, _rarityOdds, _seed);
    }

}