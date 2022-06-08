import React, { useState } from 'react'
import ModalAddAsset from './ModalAddAsset';
import HaveNFTContent from './HaveNFTContent';
import WantNFTContent from './WantNFTContent';
import styled from 'styled-components';

/**
 * @TODO store all inputs in CreateSwapContext
 * 
 */
export default function CreateSwap() {
  const [is1stChecked, set1stChecked] = useState(false);
  const [is2rdChecked, set2rdChecked] = useState(false);
  const [isModalOpened, setModalOpened] = useState(false);
  const [ModalContent, setModalContent] = useState(null); 
  const [fetchedHaveData, setFetchedHaveData] = useState('user selects what has to be traded');
  const [fetchedWantData, setFetchedWantData] = useState('user selects onchain NFT right here');

  const handleAssetClicked = (whichClicked) => {
    setModalOpened(true);
    setModalContent(whichClicked);
  }
  const handleSubmit = () => {
    console.log("handleSubmit")
  }
  

  return (
    <>
      <StyledElementsWrap>
          <h2> Swap it happen! </h2>
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

          <StyledForm onSubmit={handleSubmit}> 
            <label> any specific address? </label>
            <input type="text"/>
            <label> expiration date </label>
            <input type="date"/>

            <div>
              <label> Use Legacy Swap Code </label>
              <input className={`checkbox ${is1stChecked ? "checkbox--active" : ""}`} type="checkbox" checked={is1stChecked} onChange={() => set1stChecked(!is1stChecked)}/>
            </div>
            <div>
            <label> Use Legacy Signature Method </label>
            <input className={`checkbox ${is2rdChecked ? "checkbox--active" : ""}`} type="checkbox" checked={is2rdChecked} onChange={() => set2rdChecked(!is2rdChecked)}/>
            </div>
            <StyledButton> create swap </StyledButton>

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