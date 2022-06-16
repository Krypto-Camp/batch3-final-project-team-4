//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFTSwaper is Pausable, Ownable {
    // Request state
    enum transactionState {
        Pending, //0
        Revoked, //1
        Completed //2
    }

    // Transaction struct
    struct Transaction {
        uint256 transactionId;
        address requestor;
        address receiver;
        IERC721 myNFT;
        IERC721 wantNFT;
        uint256 myToken;
        uint256 wantToken;
        uint256 state;
    }

    Transaction[] public transactions;

    // Approve Token
    function approveToken(IERC721 NFT) public {
        NFT.setApprovalForAll(address(this), true);
    }

    // Request creation
    function createTransaction(
        address _receiver,
        IERC721 _myNFT,
        IERC721 _wantNFT,
        uint256 _myToken,
        uint256 _wantToken
    ) public payable whenNotPaused {
        require(
            _receiver != msg.sender,
            "Requestor can't be the same as receiver"
        );
        require(
            _myNFT.ownerOf(_myToken) != _wantNFT.ownerOf(_wantToken),
            "Can't swap NFT to the same owner"
        ); //Optional
        require(msg.value >= 0.01 ether); // creattion swapfee

        uint256 Id = transactions.length;

        transactions.push(
            Transaction({
                transactionId: Id,
                requestor: msg.sender,
                receiver: _receiver,
                myNFT: _myNFT,
                wantNFT: _wantNFT,
                myToken: _myToken,
                wantToken: _wantToken,
                state: uint256(transactionState.Pending)
            })
        );
    }

    // Confirm transaction

    function confirmTransaction(
        uint256 _transactionId,
        IERC721 _wantNFT,
        uint256 _wantToken
    ) public payable whenNotPaused {
        // Transaction storage transaction = transactions[_transactionId]; // another method
        require(
            _wantNFT == transactions[_transactionId].wantNFT,
            "Not requested NFT"
        ); //NFT確認
        require(
            _wantToken == transactions[_transactionId].wantToken,
            "Not requested NFT"
        ); //NFT Id 確認
        require(
            msg.sender == transactions[_transactionId].receiver,
            "Not correct receiver"
        ); // 交換者確認
        require(
            transactions[_transactionId].state ==
                uint256(transactionState.Pending),
            "Already confirmed or Revoked"
        );
        require(msg.value >= 0.01 ether); // confirmation swapfee

        Exchange(
            transactions[_transactionId].myNFT,
            transactions[_transactionId].wantNFT,
            transactions[_transactionId].myToken,
            transactions[_transactionId].wantToken,
            transactions[_transactionId].requestor,
            transactions[_transactionId].receiver
        );

        transactions[_transactionId].state = uint256(
            transactionState.Completed
        );
    }

    // Revoke confirmation
    function revokeTransaction(uint256 _transactionId) public whenNotPaused {
        require(
            msg.sender == transactions[_transactionId].requestor,
            "Need requestor to revoke"
        );
        transactions[_transactionId].state = uint256(transactionState.Revoked);
    }

    function Exchange(
        IERC721 myNFT,
        IERC721 wantNFT,
        uint256 myToken,
        uint256 wantToken,
        address requestor,
        address receiver
    ) public payable whenNotPaused {
        // require(msg.value > 0.01 ether); // swapfee
        myNFT.transferFrom(requestor, receiver, myToken); //myNFT owner exchange
        wantNFT.transferFrom(receiver, requestor, wantToken); //wantNFT owner exchange
    }

    //Pause Contract
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
