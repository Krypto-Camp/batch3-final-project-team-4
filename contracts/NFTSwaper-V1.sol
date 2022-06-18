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
        uint256 dueDate; // add dueDate
    }

    Transaction[] public transactions;

    // Transactions of users
    mapping(address => uint256[]) public usersTransactions;

    /* Approve Token (fail)
    function approveToken(IERC721 NFT) public {
        NFT.setApprovalForAll(address(this), true);
    } */

    // Request creation
    function createTransaction(
        address _receiver,
        IERC721 _myNFT,
        IERC721 _wantNFT,
        uint256 _myToken,
        uint256 _wantToken,
        uint256 _dueDate
    ) public payable whenNotPaused {
        require(
            _receiver != msg.sender,
            "Requestor can't be the same as receiver"
        );
        require(
            _myNFT.ownerOf(_myToken) != _wantNFT.ownerOf(_wantToken),
            "Can't swap NFT to the same owner"
        ); //Optional
        // require(msg.value >= 0.01 ether); // creation swapfee

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
                state: uint256(transactionState.Pending),
                dueDate: _dueDate
            })
        );

        // Add transactions of users
        usersTransactions[msg.sender].push(Id);
        usersTransactions[_receiver].push(Id);
    }

    // Confirm transaction

    function confirmTransaction(
        uint256 _transactionId,
        IERC721 _wantNFT,
        uint256 _wantToken
    ) public payable whenNotPaused {
        Transaction storage transaction = transactions[_transactionId]; // another method
        require(
            block.timestamp < transaction.dueDate,
            "Request already expired"
        ); // dueDate check
        require(_wantNFT == transaction.wantNFT, "Not requested NFT"); // NFT check
        require(_wantToken == transaction.wantToken, "Not requested NFT Id"); // NFT Id check
        require(msg.sender == transaction.receiver, "Not correct receiver"); // receiver check
        require(
            transaction.myNFT.ownerOf(transaction.myToken) ==
                transaction.requestor,
            "Exchanged NFT doesn't exist in requestor wallet"
        ); // check requestor's exchanged token exist
        require(
            transaction.wantNFT.ownerOf(transaction.wantToken) ==
                transaction.receiver,
            "Exchanged NFT doesn't exist in receiver wallet"
        ); // check receiver's exchanged token exist
        require(
            transaction.state == uint256(transactionState.Pending),
            "Already confirmed or Revoked"
        ); // check request if already confirmed or revoked

        /* require(msg.value >= 0.01 ether); // confirmation swapfee */

        Exchange(
            transaction.myNFT,
            transaction.wantNFT,
            transaction.myToken,
            transaction.wantToken,
            transaction.requestor,
            transaction.receiver
        );

        transaction.state = uint256(transactionState.Completed);
    }

    // Revoke confirmation
    function revokeTransaction(uint256 _transactionId) public whenNotPaused {
        Transaction storage transaction = transactions[_transactionId];
        require(
            msg.sender == transaction.requestor,
            "Need requestor to revoke"
        );
        transaction.state = uint256(transactionState.Revoked);
    }

    // Excute NFT exchanged function
    function Exchange(
        IERC721 myNFT,
        IERC721 wantNFT,
        uint256 myToken,
        uint256 wantToken,
        address requestor,
        address receiver
    ) public payable whenNotPaused {
        /* require(msg.value > 0.01 ether); // swapfee */
        myNFT.transferFrom(requestor, receiver, myToken); //myNFT owner exchange
        wantNFT.transferFrom(receiver, requestor, wantToken); //wantNFT owner exchange
    }

    // Get transactions of users
    function getUsersTransactions(address usersAddress)
        public
        view
        returns (uint256[] memory)
    {
        return usersTransactions[usersAddress];
    }

    // Get all transactions count
    function getAllTransactionsCount() public view returns (uint256) {
        return transactions.length;
    }

    // Get transactions data
    function getTransactionsData(uint256 _transactionId)
        public
        view
        returns (
            uint256 transactionId,
            address requestor,
            address receiver,
            IERC721 myNFT,
            IERC721 wantNFT,
            uint256 myToken,
            uint256 wantToken,
            uint256 state,
            uint256 dueDate
        )
    {
        Transaction storage transaction = transactions[_transactionId];

        return (
            transaction.transactionId,
            transaction.requestor,
            transaction.receiver,
            transaction.myNFT,
            transaction.wantNFT,
            transaction.myToken,
            transaction.wantToken,
            transaction.state,
            transaction.dueDate
        );
    }

    // Pause Contract
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
