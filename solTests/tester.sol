// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Dropper.sol";
import "../contracts/Collection.sol";
import {DropperInternals, CollectionInternals} from "./TestInternals.sol";

// TestDropper.deployed().then(function(instance) { t = instance })

contract TestDropper {
    Dropper dropper;
    Collection collection;
    DropperInternals dint;
    CollectionInternals cint;
    
    event subId(uint256 id);

    /*
    function beforeAll() public {}
    function afterAll() public {}
    function afterEach() public {}
    function beforeAll() public {}
    */

    function testTokenUri() public {
        dropper = Dropper(DeployedAddresses.Dropper());
        Assert.equal(dropper.tokenURI((1<<128)), "https://droppermoment1.com", "Moment URI not the same");
    }

    function testGetMoment() public {
        dropper = Dropper(DeployedAddresses.Dropper());

        uint momentId = 1<<128;
        string memory _momentURI = "https://droppermoment1.com";
        uint _totalMinted = 0;
        uint _mintRange = 160;
        (string memory momentURI, uint256 totalMinted, uint256 mintRange) = dropper.getMoment(momentId);

        Assert.equal(momentURI, _momentURI, "Moment URI should be the same");
        Assert.equal(totalMinted, _totalMinted, "Total Minted should start at 0");
        Assert.equal(mintRange, _mintRange, "Mint range should start at 160 for common moment");
    }

    function testGetPack() public {        
        dropper = Dropper(DeployedAddresses.Dropper());

        uint packId = 1;
        string memory packURI = "https://dropperpack1.com";
        uint packCost = 10000000;
        uint momentQuantity = 3;
        uint256[5] memory rarityOdds = [uint256(5250), uint256(3500), uint256(1000), uint256(240), uint256(10)];
        uint256[5] memory momentGuarantees = [uint256(0), uint256(0), uint256(1), uint256(0), uint256(0)];

        (string memory _packURI, 
        uint256 _packCost, 
        uint256[] memory _rarityOdds, 
        uint256 _momentQuantity, 
        uint256[] memory _momentGuarantees) = dropper.getPack(packId);

        Assert.equal(_packURI, packURI, "PackURI isnt the same");
        Assert.equal(_packCost, packCost, "packCost isnt the same");
        Assert.equal(_rarityOdds[0], rarityOdds[0], "rarityOdds isnt the same");
        Assert.equal(_momentQuantity, momentQuantity, "momentQuantity isnt the same");
        Assert.equal(_momentGuarantees[2], momentGuarantees[2], "momentGuarantees isnt the same");
    }

    function testGetNumber() public {
        cint = CollectionInternals(DeployedAddresses.CollectionInternals());
        Assert.isNotZero(cint._getNumber(), "Random number is 0");
    }

    /*
    function testGetSubId() public {
        collection = Collection(DeployedAddresses.Collection());
        cint = CollectionInternals(DeployedAddresses.CollectionInternals());

        for(uint i = 0; i < 50; i++) {
            uint256 result = collection.getSubId((5<<128), 3, i);
            Assert.equal(result, i, "subId isnt equal");
        }
    }
    */
}
