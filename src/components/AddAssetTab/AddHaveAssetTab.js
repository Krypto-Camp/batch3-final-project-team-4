import React from 'react'
import styled from 'styled-components';
import HaveNFTContent from '../HaveNFTContent';
import UserAssets from '../../pages/UserAssets';

export default function AddHaveAssetTab({ handleAssetClicked, setHavePrice, fetchedHaveData, setFetchedHaveData, handletHaveNFT}) {
    return (
      <>
        <h3> ADD ASSET </h3>
        <StyledButton 
          onClick={ () => handleAssetClicked(
            <HaveNFTContent fetchedHaveData={fetchedHaveData} setFetchedHaveData={setFetchedHaveData} handletHaveNFT={handletHaveNFT} />) }
        > 
          by address
        </StyledButton>
        <StyledButton 
          onClick={ () => handleAssetClicked(<UserAssets fetchedHaveData={fetchedHaveData} setFetchedHaveData={setFetchedHaveData} handletHaveNFT={handletHaveNFT}/>)}
        > 
          by searching in wallet
        </StyledButton>
        
        <StyledSwapCardTexts>
          leave a make-up price if needed: 
          <div> 
            <input type="number" defaultValue="0" onChange={e => setHavePrice(e.target.value)}/>  
            <p> eth </p>
          </div>
        </StyledSwapCardTexts>
      </>
      );
}


const StyledSwapCardTexts = styled.div`
  font-size: 1.5rem;
  font-family: "VT323";
  
  div { 
    display: flex;
    align-items: end;
    gap: 20px;
  }

  input {
    width: 150px;
  }

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
