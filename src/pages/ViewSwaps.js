import React, { useState, useEffect } from 'react'
import styled from 'styled-components';

import { ethers } from 'ethers';
import { contractABI, contractAddress, erc721ContractABI } from '../configs/contract';
import { useSigner, useContract, useAccount } from 'wagmi'


export default function ViewSwaps() {
  const [ filter, setFilter ] = useState('expiredDate') // status
  const [ swapsCount, setSwapsCount ] = useState(null) 
  const [ allSwaps, setAllSwaps ] = useState([]) 
  const [ confirmSwapRes, setConfirmSwapRes ] = useState()
  
  const { data: wallet } = useAccount() 
  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    signerOrProvider: signer
  })
    
    const getSwapsCount = async() => {
      const res = await contract?.getAllTransactionsCount()
      setSwapsCount(res)
    }
    const getAllSwaps = async() => {
      let all_promise = []
      for (let i=0; i<swapsCount; i++) { 
        all_promise.push( contract?.getTransactionsData(i) )
      }
      Promise.all(all_promise).then( swap => setAllSwaps(swap))
      // const res = await contract?.getTransactionsData(0)
      // setAllSwaps(res)
    }

    useEffect(() => {
      if (!contract) return
      getSwapsCount().catch( e => console.log(e) )
    }, [contract])

    useEffect(() => {
      getAllSwaps().catch( e => console.log(e) )
    }, [swapsCount])
    
    useEffect(() => {
      // console.log(allSwaps )
    }, [allSwaps])


  /**
   * @TODO pop up modal for detail and ask comfirm
   * @TODO TEST THIS ASYNC
   * @TODO OR CHECK APPROVED BEFORE CONFIRM
   */
  const confirmSwap = async(id, wantNFT, wantNFTtokenID ) => {
    // sign contract
    const confirm_res = await contract?.confirmTransaction(id, wantNFT, wantNFTtokenID )
    setConfirmSwapRes(confirm_res)
  }

  const handleApprove = (e ) => {
    e.preventDefault()
    const transacId = e.target.id
    // console.log(allSwaps[transacId] )
    // approve nft in wallet first 
    const nft_contract = new ethers.Contract(allSwaps[transacId][4], erc721ContractABI, signer);
    const approve_res = nft_contract.approve(contractAddress, allSwaps[transacId][6].toNumber()  )
  }
  const handleConfirm = e => {
    e.preventDefault()
    const transacId = e.target.id
    confirmSwap(transacId, allSwaps[transacId][4], allSwaps[transacId][0].toNumber()  ).catch( e => console.log(e) )
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

      {allSwaps.length ? 
      allSwaps.map( (swap, i) => 
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
            { swap[7].toNumber() === 0 && <button onClick={handleApprove} id={i}> approve </button> }
            { swap[7].toNumber() === 0 && <button onClick={() => handleConfirm(swap[4], swap[0].toNumber())} id={i}> confirm </button> }
          
          </StyledCorner>
          {/* <StyledCorner> expiredDate: {swap[9].toNumber()} </StyledCorner> */}
        </StyledCardWrap> 
      ) : 'loading'
      }


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