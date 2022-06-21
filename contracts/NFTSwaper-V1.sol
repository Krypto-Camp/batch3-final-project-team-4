//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFTSwaper is Pausable, Ownable {
    function Pay() public payable {}

    function Take(uint256 amount) public onlyOwner {
        payable(msg.sender).transfer(amount);
    }

    function Balance() public view returns (uint256) {
        return address(this).balance;
    }

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
        uint256 myETH;
        uint256 wantETH;
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
        uint256 _dueDate,
        uint256 _myETH,
        uint256 _wantETH
    ) public payable whenNotPaused {
        if (_receiver != address(0)) {
            require(
                _receiver != msg.sender,
                "Requestor can't be the same as receiver"
            );
        }
        if (address(_wantNFT) != address(0)) {
            require(
                _myNFT.ownerOf(_myToken) != _wantNFT.ownerOf(_wantToken),
                "Can't swap NFT to the same owner"
            );
        }
        require(
            _myNFT.ownerOf(_myToken) == msg.sender,
            "Owner of this token is not you"
        ); // check owner of the token
        if (_wantToken != 9999999 || _receiver != address(0)) {
            require(
                _wantNFT.ownerOf(_wantToken) == _receiver,
                "Owner of wanted token is not receiver"
            );
        } // check owner of the wanted token
        require(
            address(msg.sender).balance >= _myETH,
            "Not enough ETH in your wallet"
        ); // check ETH amount in requestor's wallet
        /* require(msg.value >= 0.01 ether); // creation swapfee */

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
                dueDate: _dueDate,
                myETH: _myETH,
                wantETH: _wantETH
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
        if (transaction.receiver != address(0)) {
            if (
                address(transaction.wantNFT) == address(0) ||
                transaction.wantToken == 9999999
            ) {
                require(
                    block.timestamp < transaction.dueDate,
                    "Request already expired"
                ); // dueDate check
                require(
                    msg.sender == transaction.receiver,
                    "Not correct receiver"
                ); // receiver check
                require(
                    transaction.myNFT.ownerOf(transaction.myToken) ==
                        transaction.requestor,
                    "Exchanged NFT doesn't exist in requestor wallet"
                ); // check requestor's exchanged token exist
                require(
                    transaction.state == uint256(transactionState.Pending),
                    "Already confirmed or Revoked"
                ); // check request if already confirmed or revoked
                require(
                    address(transaction.receiver).balance >=
                        transaction.wantETH,
                    "Not enough ETH in your wallet"
                ); // check ETH amount in receiver's wallet

                onlyOneTransfer(
                    transaction.myNFT,
                    transaction.myToken,
                    transaction.requestor,
                    transaction.receiver
                );

                payable(transaction.requestor).transfer(transaction.wantETH);

                transaction.state = uint256(transactionState.Completed);
            } else {
                require(
                    block.timestamp < transaction.dueDate,
                    "Request already expired"
                ); // dueDate check
                require(_wantNFT == transaction.wantNFT, "Not requested NFT"); // NFT check
                require(
                    _wantToken == transaction.wantToken,
                    "Not requested NFT Id"
                ); // NFT Id check
                require(
                    msg.sender == transaction.receiver,
                    "Not correct receiver"
                ); // receiver check
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
                require(
                    address(transaction.receiver).balance >=
                        transaction.wantETH,
                    "Not enough ETH in your wallet"
                ); // check ETH amount in receiver's wallet

                /* require(msg.value >= 0.01 ether); // confirmation swapfee */

                Exchange(
                    transaction.myNFT,
                    transaction.wantNFT,
                    transaction.myToken,
                    transaction.wantToken,
                    transaction.requestor,
                    transaction.receiver
                );

                payable(transaction.requestor).transfer(transaction.wantETH); // transfer ETH to requesotr
                payable(transaction.receiver).transfer(transaction.myETH); // transfer ETH to receiver

                transaction.state = uint256(transactionState.Completed);
            }
        } else {
            if (
                address(transaction.wantNFT) == address(0) ||
                transaction.wantToken == 9999999
            ) {
                require(
                    block.timestamp < transaction.dueDate,
                    "Request already expired"
                ); // dueDate check
                require(
                    transaction.myNFT.ownerOf(transaction.myToken) ==
                        transaction.requestor,
                    "Exchanged NFT doesn't exist in requestor wallet"
                ); // check requestor's exchanged token exist
                require(
                    transaction.state == uint256(transactionState.Pending),
                    "Already confirmed or Revoked"
                ); // check request if already confirmed or revoked
                require(
                    address(msg.sender).balance >= transaction.wantETH,
                    "Not enough ETH in your wallet"
                ); // check ETH amount in receiver's wallet

                onlyOneTransfer(
                    transaction.myNFT,
                    transaction.myToken,
                    transaction.requestor,
                    msg.sender
                );

                payable(transaction.requestor).transfer(transaction.wantETH);

                transaction.state = uint256(transactionState.Completed);
            } else {
                require(
                    block.timestamp < transaction.dueDate,
                    "Request already expired"
                ); // dueDate check
                require(_wantNFT == transaction.wantNFT, "Not requested NFT"); // NFT check
                require(
                    _wantToken == transaction.wantToken,
                    "Not requested NFT Id"
                ); // NFT Id check
                require(
                    transaction.myNFT.ownerOf(transaction.myToken) ==
                        transaction.requestor,
                    "Exchanged NFT doesn't exist in requestor wallet"
                ); // check requestor's exchanged token exist
                require(
                    transaction.wantNFT.ownerOf(transaction.wantToken) ==
                        msg.sender,
                    "Exchanged NFT doesn't exist in receiver wallet"
                ); // check receiver's exchanged token exist
                require(
                    transaction.state == uint256(transactionState.Pending),
                    "Already confirmed or Revoked"
                ); // check request if already confirmed or revoked
                require(
                    address(msg.sender).balance >= transaction.wantETH,
                    "Not enough ETH in your wallet"
                ); // check ETH amount in receiver's wallet

                /* require(msg.value >= 0.01 ether); // confirmation swapfee */

                Exchange(
                    transaction.myNFT,
                    transaction.wantNFT,
                    transaction.myToken,
                    transaction.wantToken,
                    transaction.requestor,
                    msg.sender
                );

                payable(transaction.requestor).transfer(transaction.wantETH); // transfer ETH to requesotr
                payable(msg.sender).transfer(transaction.myETH); // transfer ETH to receiver

                transaction.state = uint256(transactionState.Completed);
            }
        }
    }

    // Revoke confirmation
    function revokeTransaction(uint256 _transactionId) public whenNotPaused {
        Transaction storage transaction = transactions[_transactionId];
        require(
            msg.sender == transaction.requestor,
            "Need requestor to revoke"
        );
        payable(transaction.requestor).transfer(transaction.myETH);
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
        myNFT.transferFrom(requestor, receiver, myToken); // myNFT owner exchange
        wantNFT.transferFrom(receiver, requestor, wantToken); // wantNFT owner exchange
    }

    // Excute one NFT transferred function
    function onlyOneTransfer(
        IERC721 myNFT,
        uint256 myToken,
        address requestor,
        address receiver
    ) public payable whenNotPaused {
        myNFT.transferFrom(requestor, receiver, myToken); // myNFT owner exchange
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
            uint256 dueDate,
            uint256 myETH,
            uint256 wantETH
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
            transaction.dueDate,
            transaction.myETH,
            transaction.wantETH
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
