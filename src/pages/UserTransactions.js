import { useState, useEffect } from 'react'
import styled from 'styled-components';

import { ethers } from 'ethers';
import { contractABI, contractAddress, erc721ContractABI } from '../configs/contract';
import { useSigner, useContract, useAccount } from 'wagmi'


export default function UserTransactions() {
  const { data: currentAccount } = useAccount();
  const [ userTransactionIDList , setUserTransactionIDList ] = useState(null);
  const [ parsedTransactionIDList , setParsedTransactionIDList ] = useState(null);
  const [ userTransactionDataList , setUserTransactinDataList ] = useState([]);
  const [ confirmSwapRes, setConfirmSwapRes ] = useState()

  const { data: wallet } = useAccount() 
  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    signerOrProvider: signer
  })

  const getUserSwapIDs = async() => {
    const res = await contract?.getUsersTransactions(wallet.address)
    setUserTransactionIDList(res)
  } 

  const getUserSwapHistory = async(parsedTransactionIDList) => {
    if(!parsedTransactionIDList) return

    let all_promise = []
    for (let i=0; i<parsedTransactionIDList.length; i++) { 
      all_promise.push( contract?.getTransactionsData(parsedTransactionIDList[i]) )
    }
    Promise.all(all_promise).then( swap => setUserTransactinDataList(swap))
    // const res = await contract?.getTransactionsData(0)
    // setAllSwaps(res)
  }

  useEffect(() => {
    if (!contract) return
    getUserSwapIDs().catch( e => console.log(e) )
  }, [contract])
  
  useEffect(() => {
    if(!userTransactionIDList ) return
    const parsedIDs = userTransactionIDList?.map( data => data.toNumber() )
    setParsedTransactionIDList(parsedIDs)
  }, [userTransactionIDList])

  useEffect(() => {
    getUserSwapHistory(parsedTransactionIDList).catch( e => console.log(e) )
  }, [parsedTransactionIDList])

  const confirmSwap = async(id, wantNFT, wantNFTtokenID ) => {
    // approve nft in wallet first 
    const nft_contract = new ethers.Contract(wantNFT, erc721ContractABI, signer);
    const approve_res = await nft_contract.approve(contractAddress, wantNFTtokenID)
    // sign contract
    const confirm_res = await contract?.confirmTransaction(id, wantNFT, wantNFTtokenID )
    setConfirmSwapRes(confirm_res)
  }


  const handleConfirm = e => {
    const transacId = e.target.id
    confirmSwap(transacId, userTransactionDataList[transacId][4], userTransactionDataList[transacId][0].toNumber()  ).catch( e => console.log(e) )
  }

  const parseStatus = (status) => {
    switch (status){
      case 0:
      return 'pending'
      case 1:
      return 'revoked'
      case 2:
      return 'completed'
      default:
        return ''
    }
  }


  return (
    <>
    <div>User Transactions History</div>
    {userTransactionDataList?.length ? 
      userTransactionDataList?.map( (swap, i) => 
        <StyledCardWrap key={i}>
          <StyledUpperContent>
            <StyledCol>
              <div> transcId: {swap[0].toNumber()} </div>
              <div> have: {swap[3]} </div>
              <div> tokenId: {swap[5].toNumber()} </div>
              <div> initiator: {swap[1]} </div>
            </StyledCol>

            <StyledCol>
              <div> want: {swap[4]} </div>
              <div> tokenId: {swap[6].toNumber()} </div>
              <div> target wallet: {swap[2]} </div>
            </StyledCol>
          </StyledUpperContent>

          <StyledCorner> 
            status: {parseStatus(swap[7].toNumber()) }         
            { swap[7].toNumber() === 0 && <button onClick={handleConfirm} id={i}> confirm </button> }

          </StyledCorner>
          {/* <StyledCorner> expiredDate: {swap[9].toNumber()} </StyledCorner> */}
        </StyledCardWrap> 
      ) : 'loading'
    }
    </>
  )
}



const StyledAllswapsContainer = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledCardWrap = styled.div`
  width: auto;
  height: auto;
  padding: 20px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: #fff2d9;
  border-radius: 20px;

  font-family: VT323;
  font-size:1.2rem;

`

const StyledUpperContent = styled.div`
  display: flex;
  
  justify-content: space-between;

`

const StyledCol = styled.div`
  width:500px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`
const StyledCorner = styled.div`
  width:100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
`