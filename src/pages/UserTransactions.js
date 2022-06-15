import React, { useState } from 'react'
import styled from 'styled-components';

import { contractABI, contractAddress } from '../configs/contract';
import { useAccount, useContractRead } from 'wagmi'


export default function UserTransactions() {
  const { data: currentAccount } = useAccount();
  const [ userTransactinList , setUserTransactinList ] = useState([]);

  const { data: ownerTransactionData, isOwnerTransactionError, isOwnerTransactionLoading }  = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    'getOwnerTransactions',
    { args: ["0x428Ed3C462f561cc63c84b82D1846751FBef3028"] },
    // { watch: true },
  )
  // console.log(ownerTransactionData)

  /**
   * @Fix 無法遍歷
   */
  // ownerTransactionData.map( addr => console.log(addr.toNumber() ) )

  const { data: transactionsData0, isTransactions0Error, isTransactions0Loading }  = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    'getTransaction',
    { args: [0] },
    // { watch: true },
  )
  const { data: transactionsData1, isTransactions1Error, isTransactions1Loading }  = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    'getTransaction',
    { args: [1] },
    // { watch: true },
  )



// console.log(transactionsData2)


  return (
    <>
    <div>User Transactions History</div>
    
    <StyledCardWrap>
        <StyledUpperContent>
          <StyledCol>
            <div> have: {transactionsData0[3]} </div>
            <div> tokenId: {transactionsData0[4].toNumber()} </div>
            <div> initiator: {transactionsData0[1]} </div>
          </StyledCol>

          <StyledCol>
            <div> want: {transactionsData0[3]} </div>
            <div> tokenId: {transactionsData0[0].toNumber()} </div>
            <div> amount: {transactionsData0[8].toNumber()} </div>
            <div> target wallet: {transactionsData0[2]} </div>
          </StyledCol>
        </StyledUpperContent>

        <StyledCorner> status: {transactionsData0[6].toNumber() ? 'completed' : 'pending'} </StyledCorner>
        <StyledCorner> expiredDate: {transactionsData0[9].toNumber()} </StyledCorner>
    </StyledCardWrap>

    <StyledCardWrap>
        <StyledUpperContent>
          <StyledCol>
            <div> have: {transactionsData1[3]} </div>
            <div> tokenId: {transactionsData1[4].toNumber()} </div>
            <div> initiator: {transactionsData1[1]} </div>
          </StyledCol>

          <StyledCol>
            <div> want: {transactionsData1[3]} </div>
            <div> tokenId: {transactionsData1[0].toNumber()} </div>
            <div> amount: {transactionsData1[8].toNumber()} </div>
            <div> target wallet: {transactionsData1[2]} </div>
          </StyledCol>
        </StyledUpperContent>

        <StyledCorner> status: {transactionsData1[6].toNumber() ? 'completed' : 'pending'} </StyledCorner>
        <StyledCorner> expiredDate: {transactionsData1[9].toNumber()} </StyledCorner>
    </StyledCardWrap>
    
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