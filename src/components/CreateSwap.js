import React, { useEffect, useState } from 'react'
import ModalAddAsset from './ModalAddAsset';
import HaveNFTContent from './HaveNFTContent';
import WantNFTContent from './WantNFTContent';
import styled from 'styled-components';

import { ethers } from 'ethers';
import { contractABI, contractAddress, erc721ContractABI } from '../configs/contract';
import { useSigner, useContract, useContractWrite } from 'wagmi'

/**
 * @TODO store all inputs in CreateSwapContext
 * 
 */
export default function CreateSwap({ switchNetReq }) {
  /**
   *  contract wise
   */
  const [fetchedHaveData, setFetchedHaveData] = useState({ haveTokenId:'101', haveNFTAddress:'0xfeD2cdE438AB93f6CbcceCfD5BE88Fe48a7f664D' });
  const [fetchedWantData, setFetchedWantData] = useState({ wantTokenId:'28', wantNFTAddress:'0x687D9F7Cdee1f1BA202F0447D81B3B4fba56fe4F', receiver: '0x0F1CD12F75508aa0420dA9cD9798D9cD93627bb3', amount:'' });
  const [expiredDate, setExpiredDate] = useState('');

  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    signerOrProvider: signer
  })
    
  const { data: createContractData, isError: createContractError, isLoading: isContractCreating, write: Transac } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    'createTransaction', 
    {
      args: [
        "0x683deC5cE4Bf562c3eF8167938021e800BD4DD99",
        "0x8709c25e88db15841ae937f577702e5e389267ca",
        "0xfeD2cdE438AB93f6CbcceCfD5BE88Fe48a7f664D",
        4,
        28,
      ]
    }
  )

  const createTransac = async(params) => {
    // format input params
    let paramArray = [params.receiver, params.haveNFTAddress, params.wantNFTAddress, params.haveTokenId, params.wantTokenId  ]
    // approve myNFT
    // const nft_contract = new ethers.Contract(params.haveNFTAddress, erc721ContractABI, signer);
    // const approve_res = await nft_contract.approve(contractAddress, params.haveTokenId)
    // console.log(approve_res)
    
    // createTransac()
    console.log(paramArray)
    const confirm_res = await contract?.createTransaction(...paramArray)
    console.log(confirm_res)
    // Transac()
  }

  /**
   *  app states wise
   */
  const [isModalOpened, setModalOpened] = useState(false);
  const [ModalContent, setModalContent] = useState(null); 

  const handleAssetClicked = (whichClicked) => {
    setModalOpened(true);
    setModalContent(whichClicked);
  }

  const handleSubmit = e => {
    e.preventDefault();
    createTransac({ ...fetchedHaveData, ...fetchedWantData });
    
  }
  

  return (
    <>
      <StyledElementsWrap>
           { !switchNetReq ? <div> Swap it happen! </div> :  <div> Please switch network. </div> }
          <StyledCardWrap>
            <StyledSwapCard>
              <p>  what you have  </p>
              <StyledButton 
                onClick={ () => handleAssetClicked(<HaveNFTContent fetchedHaveData={fetchedHaveData} setFetchedHaveData={setFetchedHaveData}/>)}
              > 
                add assets
              </StyledButton>
            </StyledSwapCard>

            <StyledSwapCard> 
              <p> and you're looking for </p>
              <StyledButton 
                onClick={ () => handleAssetClicked(<WantNFTContent fetchedWantData={fetchedWantData} setFetchedWantData={setFetchedWantData}/>)}
              > 
                add assets
              </StyledButton>
            </StyledSwapCard>
          </StyledCardWrap>

          <StyledForm > 
            <label> expiration date </label>
            <input type="date"/>
            <StyledButton type="submit" onClick={handleSubmit}> create swap </StyledButton>
          </StyledForm>
       </StyledElementsWrap>

        <ModalAddAsset isModalOpened={isModalOpened} setModalOpened={setModalOpened}> {ModalContent} </ModalAddAsset>
      </>
  )
}

const StyledElementsWrap = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);

  width: auto;
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  
`
const StyledCardWrap = styled.div`
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`
const StyledSwapCard = styled.div`
  width: 30vw;
  height: 30vh;
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-color: transparent;

  background: #FFF;
`
const StyledForm = styled.div`
  width: 500px;
  max-width: 90vw;
  height: 30vh;
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-color: transparent;
`


const StyledButton = styled.button`
  display: inline-flex;
  justify-content: center; 
  align-items: center; 
  padding: 15px;
  margin: 10px;

  height: auto;
  max-height: 35px;
  background-color: #f6df4c;
  border-radius: 5px;
  border-color: transparent;
  box-shadow: 0px 2px 2px 1px #0F0F0F;
  cursor: pointer;

  font-family: "VT323";
  font-size: 1.2rem;

`

