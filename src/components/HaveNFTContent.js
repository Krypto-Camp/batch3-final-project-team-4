import { useRef } from 'react'
import styled from 'styled-components'
import { renderNFTData } from '../utils/functions'
// import AddAssetTab from './AddAssetTab/AddAssetTab'
/**
 * @TODO fetch HAVE/WANT TAB data here and pass it to CreateSwapContext
 * need to submit it with form data
 */
export default function HaveNFTContent({  fetchedHaveData, setFetchedHaveData, handletHaveNFT, setModalOpened}) {
  const addrRef = useRef()
  const tokenIDRef = useRef()

  const loadNFT = e => {
    e.preventDefault();
    if (addrRef.current.value && tokenIDRef.current.value) renderNFTData(addrRef.current.value, tokenIDRef.current.value, handletHaveNFT )
    setFetchedHaveData({ haveNFTAddress:addrRef.current.value, haveTokenId:tokenIDRef.current.value }) 
    setModalOpened(false)
  }


  return (
        <>
          <Styledtitle>Load your NFT.</Styledtitle>
          <StyledInputSec onSubmit={loadNFT}>
            <label> NFT address </label>
            <input type="text" ref={addrRef} defaultValue={fetchedHaveData?.haveNFTAddress}/>
            <label> NFT tokenID </label>
            <input type="text" ref={tokenIDRef} defaultValue={fetchedHaveData?.haveTokenId}/>
            <StyledButton type="submit"> Load NFT </StyledButton>
          </StyledInputSec>
        </>
      
  )
}

const Styledtitle= styled.h2`
  color: #FFF;
  font-size: 1.6rem;
`

const StyledInputSec = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-color: transparent;
  color: #FFF;
  font-size: 1.4rem;
  font-family: VT323;
`

const StyledButton = styled.button`
  display: inline-flex;
  justify-content: center; 
  align-items: center; 
  padding: 15px;
  margin: 10px;

  height: auto;
  max-height: 35px;
  background-color: #ebff12;
  border-radius: 5px;
  border-color: orange;
  box-shadow: 0px 2px 2px 1px #0F0F0F;
  cursor: pointer;

  font-family: "VT323";
  font-size: 1.2rem;

  &:hover {
    background-color: #000;
    color: #FFF;
    box-shadow: 0px 2px 2px 1px #0F0F0F30;
  }
`

