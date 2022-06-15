// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NFTSwap is Initializable, ERC721Upgradeable, PausableUpgradeable, OwnableUpgradeable {

    // Transaction State 
    // 0 uint256()  
    // 1 uint256() 
   enum TransactionState {
       PENDING, 
       COMPLETED 
   }
   
   // Transaction struct 
   struct Transaction {
       uint transactionId;
       address initiator;
       address receiver;
       address contractAddress;
       uint256 haveTokenId;
       uint256 wantTokenId;
       uint state;
       bool designated; // option
       uint amount; // option
       uint256 expiredDate; // option
   }

   // mapping from address => transaction 
   mapping(address => uint []) public ownerTransactions; 

   // transactions list
   Transaction[] public transactions;

   // modifier isAddress(address ethereumAddress) {
   //     string memory regex = "^0x[0-9a-f]{40}$";
   //     require(!ethereumAddress.matches(regex),"invalid address");
   //     _;
   // }

   // Check address is not zero
   modifier isZeroAddress(address _ethereumAddress) {
       require(_ethereumAddress != address(0), "Can't input zero address");
       _;
   }

   // Check transaction exist
   modifier transactionExists(uint _transactionId) {
       require(_transactionId < transactions.length, "Transaction does not exist");
       _;
   }

   // Check transaction state is completed
   modifier transactionIsCompleted(uint _transactionId) {
       require(!(uint(transactions[_transactionId].state) == 1), "transaction already completed");
       _;
   }

   // Check is transaction receiver
   modifier isTransactionReceiver(uint _transactionId) {
       require(transactions[_transactionId].receiver == msg.sender,"You're not the transaction receiver");
       _;
   }

   // Check swap address is not equal
   modifier notSameAddress(address _initiator, address _reciver) {
       require(_initiator != _reciver ,"Initiator address can't equal reciver address (Not same address in the transaction)");
        _;
   }

   // Check swap token id is correct
   modifier isCorrectTokenIdToSwap(uint _transactionId, uint _wantTokenId) {
       require(transactions[_transactionId].wantTokenId == _wantTokenId,"The Swap NFT token is incorrect");
       _;
   }

   // Check token of owner
   modifier isTokenOwner(address _contractAddress, uint256 _tokenId) {
       // call another contract ownerOf
       require(ERC721(_contractAddress).ownerOf(_tokenId) == msg.sender, "You're not token owner");
       _;
   }

   // Check token of owner
   modifier isTokenApproved(address _contractAddress, uint256 _tokenId) {
         // call another contract getApproved
       require(ERC721(_contractAddress).getApproved(_tokenId) != address(0), "Please approve token first");
       _;
   }

   // function test(address _contractAddress, uint256 _tokenId) public view returns (bool) {
   //     return ERC721(_contractAddress).getApproved(_tokenId) != address(0);
   // }
   
   constructor() {
       _disableInitializers();
   }
   
   function createTransaction(
       address _receiver,
       address _contractAddress,
       uint256 _haveTokenId,
       uint256 _wantTokenId,
       bool _designated,
       uint _amount,
       uint256 _expiredDate
   ) public
       isTokenOwner(_contractAddress,_haveTokenId)
       isTokenApproved(_contractAddress,_haveTokenId)
   {

       require(_receiver != msg.sender,"Initiator address can't equal reciver address (Not same address in the transaction)");
       require(ERC721(_contractAddress).ownerOf(_haveTokenId) != ERC721(_contractAddress).ownerOf(_wantTokenId),"Can't not swap nft to same owner");

       // get transaction current total count
       uint index = transactions.length;
       
       // push transaction data to transactions
       transactions.push(
           Transaction({
               transactionId:index,
               initiator:msg.sender,
               receiver:_receiver,
               contractAddress:_contractAddress,
               haveTokenId:_haveTokenId,
               wantTokenId:_wantTokenId,
               state:uint(TransactionState.PENDING),
               designated:_designated,
               amount:_amount,
               expiredDate:_expiredDate
           })
       );

       // push transaction data to ownerTransactions for initiator 
       ownerTransactions[msg.sender].push(index);

       // push transaction data to ownerTransactions for receiver
       ownerTransactions[_receiver].push(index);
   }

   function confirmTransaction(
       address _contractAddress,
       uint _transactionId,
       uint _wantTokenId
   ) public
       transactionExists(_transactionId)
       transactionIsCompleted(_transactionId)
       isTransactionReceiver(_transactionId)
       isCorrectTokenIdToSwap(_transactionId,_wantTokenId)
       isTokenOwner(_contractAddress,_wantTokenId)
       isTokenApproved(_contractAddress,_wantTokenId)
   {
       // get transaction data
       Transaction storage transaction = transactions[_transactionId];

       // update transaction state to completed
       transaction.state = uint(TransactionState.COMPLETED);

       //excute NFT swap
       _excuteSwap(transaction.transactionId);
   }
   
   function _excuteSwap(uint _transactionId) private {
       
       // get transaction data
       Transaction storage transaction = transactions[_transactionId];
       
       // initiator transfer to receiver haveTokenId
       ERC721(transaction.contractAddress).transferFrom(
           transaction.initiator,
           transaction.receiver,
           transaction.haveTokenId           
       );

       // receiver transfer to initiator wantTokenId
       ERC721(transaction.contractAddress).transferFrom(
           transaction.receiver,
           transaction.initiator,
           transaction.wantTokenId      
       );
   }
   
   function getOwnerTransactions(address ownerAddress) public view returns (uint[] memory) {
       return ownerTransactions[ownerAddress];
   }

   function getTransactionCount() public view returns (uint) {
       return transactions.length;
   }
   
   function getTransaction(uint _transactionId) 
       public 
       view 
           transactionExists(_transactionId)
       returns(
           uint transactionId,
           address initiator,
           address receiver,
           address contractAddress,
           uint256 haveTokenId,
           uint256 wantTokenId,
           uint256 state,
           bool designated,
           uint amount,
           uint256 expiredDate
       )
   {

       Transaction storage transaction = transactions[_transactionId];

       return (
           transaction.transactionId,
           transaction.initiator,
           transaction.receiver,
           transaction.contractAddress,
           transaction.haveTokenId,
           transaction.wantTokenId,
           transaction.state,
           transaction.designated,
           transaction.amount,
           transaction.expiredDate
       );
   }

   function initialize() initializer public {
       __ERC721_init("NFTSWAP", "NFTS");
       __Pausable_init();
       __Ownable_init();
   }

   function pause() public onlyOwner {
       _pause();
   }

   function unpause() public onlyOwner {
       _unpause();
   }

   function _beforeTokenTransfer(address from, address to, uint256 tokenId)
       internal
       whenNotPaused
       override
   {
       super._beforeTokenTransfer(from, to, tokenId);
   }
}    