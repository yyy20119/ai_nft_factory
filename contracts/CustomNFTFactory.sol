// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CustomNFTFactory {
    uint256 public contractCounter;
    mapping(uint256 => address) public contracts;
    mapping(address => address[]) public collections;

    function createNFTContract(
        string memory _name,
        string memory _symbol,
        string memory _uri
    ) public returns (address) {
        ERC721Custom newContract = new ERC721Custom(_name, _symbol, _uri, msg.sender);
        contracts[contractCounter] = address(newContract);
        collections[msg.sender].push(address(newContract));
        contractCounter++;
        return address(newContract);
    }

    function getCollection(address owner) public view returns (address[] memory) {
        return collections[owner];
    }
}

contract ERC721Custom is ERC721 {
    string public TOKEN_URI = "";

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri,
        address owner
    ) ERC721(_name, _symbol) {
        TOKEN_URI = _uri;
        _safeMint(owner, 0);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }
}
