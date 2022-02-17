// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library DropperLib {
    
    struct Moment {
    string momentURI;
    uint256 totalMinted;
    uint256 mintRange;
    }

    struct Pack {
    string packURI;
    uint256 packCost;
    uint256[] rarityOdds;
    uint256 momentQuantity;
    uint256[] momentGuarantees;
    }
}

