import React, { useState } from 'react'
import ModalAddAsset from './ModalAddAsset';
import HaveNFTContent from './HaveNFTContent';
import WantNFTContent from './WantNFTContent';
import styled from 'styled-components';

import { ethers, BigNumber } from 'ethers';
import { contractABI, contractAddress } from '../configs/contract';
import {
    useAccount,
    useContractRead,
    useContractWrite,
    chain
} from 'wagmi'

/**
 * @TODO store all inputs in CreateSwapContext
 * 
 */
export default function CreateSwap({ switchNetReq }) {
  /**
   *  contract wise
   */
  const [fetchedHaveData, setFetchedHaveData] = useState({ title: 'have', haveTokenId:'', haveNFTAddress:'' });
  const [fetchedWantData, setFetchedWantData] = useState({ title: 'want', wantTokenId:'', wantNFTAddress:'', amount:'' });
  const [expiredDate, setExpiredDate] = useState('');

  const { data: createContractData, isError: createContractError, isLoading: isContractCreating, write: createTransaction } = useContractWrite(
    {
      addressOrName: contractAddress,
      contractInterface: contractABI,
    },
    'createTransaction', 
    {
      args: [
        "0x683deC5cE4Bf562c3eF8167938021e800BD4DD99",
        "0x8709c25e88db15841ae937f577702e5e389267ca",
        4,
        0,
        false, 
        1,
        0
      ]
    }
  )


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
    console.log("handleSubmit")
    createTransaction();
  }
  

  return (
    <>
      <StyledElementsWrap>
           { !switchNetReq ? <div> Swap it happen! </div> :  <div> Please switch network. </div> }
          <StyledCardWrap>
            <StyledSwapCard>
              <p>  what you have  </p>
              <StyledButton onClick={ () => handleAssetClicked(<HaveNFTContent fetchedHaveData={fetchedHaveData}/>)}> add assets</StyledButton>
            </StyledSwapCard>

            <StyledSwapCard> 
              <p> and you're looking for </p>
              <StyledButton onClick={ () => handleAssetClicked(<WantNFTContent fetchedWantData={fetchedWantData}/> )}> add assets</StyledButton>
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
const StyledInput = styled.div`
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