// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma abicoder v2;

// Swap to access control since there are multiple children
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

abstract contract ContextMixin {
    function msgSender()
        internal
        view
        returns (address payable sender)
    {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }
        } else {
            sender = payable(msg.sender);
        }
        return sender;
    }
}

contract Dropper is ERC1155, ERC1155Burnable, Ownable, ContextMixin {

    event momentAdded(address indexed collection, uint256 indexed momentId, string momentURI);

    struct Moment {
        string momentURI;
        uint256 totalMinted;
        uint256 mintRange;
        uint256 collectionId;
    } 

    struct Pack {
        string packURI;
        uint256 packCost;
        uint256[] rarityOdds;
        uint256 momentQuantity;
        uint256[] momentGuarantees;
        uint256 collectionId;
    }

    //On Rinkeby: "0xf57b2c51ded3a29e6891aba85459d600256cf317"
    //On mainnet: "0xa5409ec958c83c3f309868babaca7c86dcb077c1"
    address _proxyRegistryAddress;
    string contractMetadata;
    string ipfsGateway = "ipfs://";
    mapping (address => uint256) public collectionId;
    mapping (uint256 => address) public getCollectionAddress;
    mapping (uint256 => Moment) public moments;
    mapping (uint256 => Pack) public packs;
    uint256 currentCollection;
    uint256 currentMomentId;
    uint256 currentPackId;

    constructor(string memory _contractMetadata) ERC1155 (_contractMetadata) {
        currentCollection = 0;
        currentMomentId = 0;
        currentPackId = 0;
        contractMetadata = _contractMetadata;
    }

    modifier onlyDropper(){
        require(collectionId[msg.sender] != 0);
        _;
    }

    function setMoment(
        string calldata _momentURI, 
        uint256 _totalMinted,
        uint256 _mintRange, 
        uint256 _momentId,
        uint256 _collectionId) 
    external  onlyDropper {
        moments[_momentId] = Moment({
            momentURI: _momentURI,
            totalMinted: _totalMinted,
            mintRange: _mintRange,
            collectionId: _collectionId});
        // emit creation event
    }

    function setPack(
        string calldata _packURI, 
        uint256 _packCost, 
        uint256[] calldata _rarityOdds, 
        uint256 _momentQuantity, 
        uint256[] calldata _momentGuarantees, 
        uint256 _packId,
        uint256 _collectionId) 
    external onlyDropper {
        
        packs[_packId] = Pack({
            packURI: _packURI,
            packCost: _packCost,
            rarityOdds: _rarityOdds,
            momentQuantity: _momentQuantity,
            momentGuarantees: _momentGuarantees,
            collectionId: _collectionId
        });
    }

    function setCollection(address _collection) external onlyOwner {
        require (_collection != address(0) && collectionId[_collection] == 0);
        currentCollection += 1;
        collectionId[_collection] = currentCollection;
        setApprovalForAll(_collection, true);
    }

    function setGateway(string calldata newGateway) external onlyOwner {
        ipfsGateway = newGateway;
    }

    function getMoment(uint256 _momentId) external view returns(string memory, uint256, uint256){
        return (
            moments[_momentId].momentURI, 
            moments[_momentId].totalMinted, 
            moments[_momentId].mintRange);
    }

    function getPack(uint256 _packId) external view returns(
        string memory,
        uint256,
        uint256[] memory,
        uint256,
        uint256[] memory
    ){
        Pack memory pack = packs[_packId];        
        return(
            pack.packURI, 
            pack.packCost, 
            pack.rarityOdds, 
            pack.momentQuantity, 
            pack.momentGuarantees);
    }

    function getId(uint256 _type) external onlyDropper returns(uint256) {
        if (_type == 1){
            currentMomentId += (1 << 128);
            return currentMomentId;
        } else if (_type == 2) {
            currentPackId += 1;
            return currentPackId;
        } else {
            revert();
        }
    }

    function incrementMomentMints(uint256 _momentId) external onlyDropper {
        moments[_momentId].totalMinted += 1;
    }

    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external onlyDropper {
        _mintBatch(to, ids, amounts, data);
    }

    function mint(address account, uint id, uint amount, bytes calldata data) external onlyDropper {
        _mint(account, id, amount, data);
    }

    function contractURI() public view returns(string memory){
        return string(abi.encodePacked(ipfsGateway,contractMetadata));
    }

    function uri(uint256 _tokenId) public override view returns(string memory){
        if (_tokenId >> 128 == 0) {
            return string(abi.encodePacked(ipfsGateway, packs[_tokenId].packURI));
        } else {
            _tokenId = (_tokenId >> 128);
            return string(abi.encodePacked(ipfsGateway, moments[(_tokenId<<128)].momentURI));
        }
    }

    function updateURI(string calldata _newURI) external onlyOwner{
        contractMetadata = _newURI;
    }

    function updateMomentURI(uint256 _momentId, string calldata _newURI) external onlyOwner{
        moments[_momentId].momentURI = _newURI;
    }

    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
        // if OpenSea's ERC1155 Proxy Address is detected, auto-return true
        if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        } else if (collectionId[_operator] != 0) {
            return true;
        }
        // otherwise, use the default ERC1155.isApprovedForAll()
        return ERC1155.isApprovedForAll(_owner, _operator);
    }

    function _msgSender()
        internal
        override
        view
        returns (address sender)
    {
        return ContextMixin.msgSender();
    }

    function withdrawToken(address payable recipient, address _tokenContract, uint256 _amount) payable public onlyOwner {
        if (_tokenContract==address(0)){
            (bool succeed, bytes memory data) = recipient.call{value: address(this).balance}("");
            require(succeed, "Failed to withdraw Ether");
        }
        IERC20 tokenContract = IERC20(_tokenContract);
        tokenContract.transfer(msg.sender, _amount);
    }
}