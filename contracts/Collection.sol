// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./Dropper.sol";
import "./EIP712MetaTransaction.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Collection is
    Ownable,
    ReentrancyGuard,
    EIP712MetaTransaction("CollectionBiconomy", "1")
{
    mapping(uint256 => uint256[]) public momentsByRarity;
    mapping(uint256 => mapping(uint256 => bool)) usedIds;
    mapping(uint256 => bool) public packsInCollection;
    mapping(uint256 => uint256[]) ones;

    uint256[] baseMintRange = [160, 90, 40, 10, 1];
    uint256[] rarityOdds = [5250, 3500, 1000, 240, 10];
    uint256 public lockDate;
    uint256 lastRNG = block.difficulty;
    uint256 public packsMinted = 0;
    uint256 public collectionId;
    IERC20 mUSDC = IERC20(address(0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174));
    Dropper dropper;

    uint256 constant basisPoints = 10000;
    uint256 constant numRarities = 5;

    modifier mintLock() {
        if (7500 <= packsMinted) {
            require(
                block.timestamp <= lockDate,
                "This collection is no longer minting"
            );
        }
        _;
    }

    constructor(address _dropper) {
        lockDate = block.timestamp + 2 weeks;
        dropper = Dropper(_dropper);
        collectionId = dropper.collectionId(address(this));
    }

    function initializeCollection(
        string[] calldata _momentURI,
        uint256[] memory _momentRarity,
        string[] calldata _packURI,
        uint256[] memory _packCost,
        uint256[] memory _momentsPerPack,
        uint256[][] calldata _rarityGuarantees,
        uint256[][] calldata _rarityOdds
    ) external onlyOwner {
        for (uint256 i = 0; i < _momentURI.length; i++) {
            uint256 _mintRange = baseMintRange[_momentRarity[i]];
            uint256 _momentId = dropper.getId(1);
            dropper.setMoment(
                _momentURI[i],
                0,
                _mintRange,
                _momentId,
                collectionId
            );
            momentsByRarity[_momentRarity[i]].push(_momentId);
            // emit creation event
        }

        for (uint256 i = 0; i < _packURI.length; i++) {
            uint256 _packId = dropper.getId(2);

            dropper.setPack(
                _packURI[i],
                _packCost[i],
                _rarityOdds[i],
                _momentsPerPack[i],
                _rarityGuarantees[i],
                _packId,
                collectionId
            );

            packsInCollection[_packId] = true;

            uint256[] memory onesArray = new uint256[](_momentsPerPack[i]);
            for (uint256 x = 0; x < _momentsPerPack[i]; x++) {
                onesArray[x] = 1;
            }
            ones[_packId] = onesArray;
        }
    }

    function buyPacks(uint256 _packId, uint256 _quantity) external mintLock {
        require(packsInCollection[_packId], "Pack not in collection");
        (, uint256 cost, , , ) = dropper.getPack(_packId);
        cost = cost * _quantity;

        // require(
        //     mUSDC.transferFrom(msgSender(), address(this), cost) == true,
        //     "Unable to transfer mUSDC. setApproval or increase balance."
        // );

        packsMinted += _quantity;
        dropper.mint(msgSender(), _packId, _quantity, "");
    }

    function buyPacksWithMoonPay(
        uint256 _packId,
        uint256 _quantity,
        address _destination
    ) external mintLock {
        require(packsInCollection[_packId], "Pack not in collection");
        (, uint256 cost, , , ) = dropper.getPack(_packId);
        cost = cost * _quantity;

        // require(
        //     mUSDC.transferFrom(msgSender(), address(this), cost) == true,
        //     "Unable to transfer mUSDC. setApproval or increase balance."
        // );

        packsMinted += _quantity;
        dropper.mint(_destination, _packId, _quantity, "");
    }

    function openPacks(uint256 _packId) external nonReentrant {
        require(packsInCollection[_packId], "Pack id not in collection");
        require(
            dropper.balanceOf(msgSender(), _packId) > 0,
            "Insufficient packs"
        );

        dropper.burn(msgSender(), _packId, 1);

        (
            ,
            ,
            ,
            uint256 momentsPerPack,
            uint256[] memory momentGuarantees
        ) = dropper.getPack(_packId);
        uint256 minted = 0;

        // Store the moment ids for the pack
        uint256[] memory momentIds = new uint256[](momentsPerPack);

        // Mint the guaranteed rarities first
        // Check each rarity level guarantees
        for (
            uint256 guaranteeIndex = 0;
            guaranteeIndex < momentGuarantees.length - 1;
            guaranteeIndex++
        ) {
            if (momentGuarantees[guaranteeIndex] > 0) {
                // Create moments with a minimum rarity
                for (
                    uint256 guaranteeNum = 0;
                    guaranteeNum < momentGuarantees[guaranteeIndex];
                    guaranteeNum++
                ) {
                    // Add them to the pack momentIds
                    uint256 momentId = genMoment(guaranteeIndex);
                    momentIds[minted] = momentId;
                    minted += 1;
                }
            }
        }

        uint256 remainder = momentsPerPack - minted;
        for (
            uint256 remainingMoments = 0;
            remainingMoments < remainder;
            remainingMoments++
        ) {
            uint256 momentId = genMoment(0);
            momentIds[minted % momentsPerPack] = momentId;
            minted += 1;
        }
        dropper.mintBatch(msgSender(), momentIds, ones[_packId], "");
    }

    function uri(uint256 _tokenId) external view returns (string memory) {
        return dropper.uri(_tokenId);
    }

    function genMoment(uint256 _minRarity) internal returns (uint256) {
        uint256 seed = getNumber(); //super.VRF();
        uint256 rarity = getRarity(_minRarity, seed);
        uint256 numMomentsOfRarity = momentsByRarity[rarity].length;
        require(numMomentsOfRarity > 0, "A rarity has no moments");
        uint256 momentsIndex = (seed % numMomentsOfRarity);
        uint256 momentId = momentsByRarity[rarity][momentsIndex];

        if (rarity == numRarities - 1) {
            for (uint256 i = 0; i < numMomentsOfRarity; i++) {
                (, uint256 totalMinted, ) = dropper.getMoment(
                    momentsByRarity[rarity][
                        (momentsIndex + i) % (numMomentsOfRarity)
                    ]
                );
                if (totalMinted == 0) {
                    dropper.incrementMomentMints(momentId);
                    return momentId;
                }
            }
            // Mint a moment of the next highest rarity
            // This logic needs to be looped if the top 2 rarities are both unique
            // This does not check for numMomentsOfRarity > 0
            momentId = momentsByRarity[numRarities - 2][
                (seed % momentsByRarity[numRarities - 2].length)
            ];
        }

        momentId = momentId + getSubId(momentId, rarity, seed);
        return (momentId);
    }

    function getRarity(uint256 _rarityMinimum, uint256 _seed)
        internal
        view
        returns (uint256)
    {
        uint256 num = _seed % 10000;
        uint256 rarity = 0;

        for (uint256 i = rarityOdds.length - 1; i > 0; i--) {
            if (num < rarityOdds[i]) {
                rarity = i;
                break;
            } else {
                num = num - rarityOdds[i];
            }
        }
        if (_rarityMinimum > rarity) {
            return _rarityMinimum;
        } else {
            return rarity;
        }
    }

    function getSubId(
        uint256 _momentId,
        uint256 _rarityId,
        uint256 _seed
    ) internal returns (uint256) {
        uint256 subId = 0;
        uint256 _baseMintRange = baseMintRange[_rarityId];
        (string memory _uri, uint256 totalMinted, uint256 mintRange) = dropper
            .getMoment(_momentId);

        assert(_rarityId != numRarities - 1);

        if (totalMinted == mintRange) {
            mintRange = mintRange * 2;
        }

        if (mintRange > _baseMintRange) {
            subId = (mintRange / 2) + 1 + (_seed % (mintRange / 2));
        } else {
            subId = (_seed % mintRange) + 1;
        }

        while (usedIds[_momentId][subId]) {
            subId += 1;
            if (subId > mintRange) {
                if (mintRange > _baseMintRange) {
                    subId = (mintRange / 2) + 1;
                } else {
                    subId = 1;
                }
            }
        }
        usedIds[_momentId][subId] = true;
        dropper.setMoment(
            _uri,
            (totalMinted + 1),
            mintRange,
            _momentId,
            collectionId
        );
        return subId;
    }

    // Optimize code to use a single gen for all randomness in a single txn
    function getNumber() internal returns (uint256) {
        uint256 number = uint256(
            keccak256(abi.encodePacked(block.timestamp, msgSender(), lastRNG))
        );
        lastRNG = number;
        return number;
    }

    function updateOdds(uint256[] memory newOdds) external onlyOwner {
        rarityOdds = newOdds;
    }

    function withdrawToken(address _tokenContract) external onlyOwner {
        address payable cAddr = payable(
            0xAf53fb52E86F66b42458b0e91371117a92661301
        );
        address payable dAddr = payable(
            0x8445E32b4e67e89191000B845B71700898700723
        );

        IERC20 tokenContract = IERC20(_tokenContract);
        uint256 balance = tokenContract.balanceOf(address(this));
        uint256 cCut = (balance * 75) / 100;
        uint256 dCut = (balance * 25) / 100;

        require(tokenContract.transfer(cAddr, cCut), "Transfer Failed");
        require(tokenContract.transfer(dAddr, dCut), "Transfer Failed");
    }
}
