import React, { useState } from 'react'
import styled from 'styled-components';

import { contractABI, contractAddress } from '../configs/contract';
import {
    useAccount,
    useContractRead,
    useContractWrite,
    chain
} from 'wagmi'


export default function ViewSwaps() {
  const [ filter, setFilter ] = useState('expiredDate'); // staus


  const { data: transactions0, isTransactions0Error, isTransactions0Loading }  = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    'transactions',
    { args: [0] },
    // { watch: true },
  )
  const { data: transactions1, isTransactions1Error, isTransactions1Loading }  = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    'transactions',
    { args: [1] },
    // { watch: true },
  )

  const { data: transactions2, isTransactions2Error, isTransactions2Loading }  = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    'transactions',
    { args: [2] },
    // { watch: true },
  )

  // console.log(transactions2.)
  // console.log(transactions2)

  /**
   * pop up modal for detail and ask comfirm
   * confirm transc button 
   * 
   */
  // const { data: confirmData, isError: confirmError, isLoading: isConfirming, write: confirmTransaction } = useContractWrite(
  //   {
  //     addressOrName: contractAddress,
  //     contractInterface: contractABI,
  //   },
  //   'mint'
  // )


  return (
    <StyledAllswapsContainer>
      <h3> All swaps records </h3>

      <StyledSearch>
        <input type="text" id="search-bar" placeholder="Search for NFT address here.."/>
        <div> or </div>
        <label > by filter:</label>
        <select name="filter" >
          <option value="expiredDate"> expired date </option>
          <option value="status"> status </option>
        </select>
      </StyledSearch>

      <StyledCardWrap>
        <StyledUpperContent>
          <StyledCol>
            <div> have: {transactions0[3]} </div>
            <div> tokenId: {transactions0[4].toNumber()} </div>
            <div> initiator: {transactions0[1]} </div>
          </StyledCol>

          <StyledCol>
            <div> want: {transactions0[3]} </div>
            <div> tokenId: {transactions0[0].toNumber()} </div>
            <div> amount: {transactions0[8].toNumber()} </div>
            <div> target wallet: {transactions0[2]} </div>
          </StyledCol>
        </StyledUpperContent>

        <StyledCorner> status: {transactions0[6].toNumber() ? 'completed' : 'pending'} </StyledCorner>
        <StyledCorner> expiredDate: {transactions0[9].toNumber()} </StyledCorner>
      </StyledCardWrap>

      <StyledCardWrap>
        <StyledUpperContent>
          <StyledCol>
            <div> have: {transactions1[3]} </div>
            <div> tokenId: {transactions1[4].toNumber()} </div>
            <div> initiator: {transactions1[1]} </div>
          </StyledCol>

          <StyledCol>
            <div> want: {transactions1[3]} </div>
            <div> tokenId: {transactions1[0].toNumber()} </div>
            <div> amount: {transactions1[8].toNumber()} </div>
            <div> target wallet: {transactions0[2]} </div>
          </StyledCol>
        </StyledUpperContent>

        <StyledCorner> status: {transactions1[6].toNumber() ? 'completed' : 'pending'} </StyledCorner>
        <StyledCorner> expiredDate: {transactions1[9].toNumber()} </StyledCorner>
      </StyledCardWrap>

      <StyledCardWrap>
        <StyledUpperContent>
          <StyledCol>
            <div> have: {transactions2[3]} </div>
            <div> tokenId: {transactions2[4].toNumber()} </div>
            <div> initiator: {transactions2[1]} </div>
          </StyledCol>

          <StyledCol>
            <div> want: {transactions2[3]} </div>
            <div> tokenId: {transactions2[0].toNumber()} </div>
            <div> amount: {transactions2[8].toNumber()} </div>
            <div> target wallet: {transactions0[2]} </div>
          </StyledCol>
        </StyledUpperContent>

        <StyledCorner> status: {transactions2[6].toNumber() ? 'completed' : 'pending'} </StyledCorner>
        <StyledCorner> expiredDate: {transactions2[9].toNumber()} </StyledCorner>
      </StyledCardWrap>



      {/* <div> tokenId: {transactions.haveTokenId} </div>
      <div> initiator: {transactions.initiator} </div>

      <div> want: {transactions.contractAddress} </div>
      <div> tokenId: {transactions.wantTokenId} </div>
      <div> amount: {transactions.amount} </div>
      
      <div> status: {transactions.state ? 'completed' : 'pending'} </div>
      <div> status: {transactions.expiredDate} </div> */}

    </StyledAllswapsContainer>
  )
}

const StyledAllswapsContainer = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const StyledSearch = styled.div`
  width: 400px;
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