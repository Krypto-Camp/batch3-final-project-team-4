import { useRef } from 'react'
import styled from 'styled-components';

// import AddAssetTab from './AddAssetTab/AddAssetTab'

/**
 * @TODO fetch HAVE/WANT TAB data here and pass it to CreateSwapContext
 * need to submit it with form data
 */
export default function HaveNFTContent({ fetchedHaveData, setFetchedHaveData }) {
  const addrRef = useRef()
  const tokenIDRef = useRef()
  const loadNFT = e => {
    e.preventDefault();
    setFetchedHaveData({ haveNFTAddress:addrRef.current.value, haveTokenId:tokenIDRef.current.value })
  }

  return (
      <>
       <div>Load your NFT.</div>
        <StyledInputSec onSubmit={loadNFT}>
          <label> NFT address </label>
          <input type="text" ref={addrRef} defaultValue={fetchedHaveData?.haveNFTAddress}/>
          <label> NFT tokenID </label>
          <input type="text" ref={tokenIDRef} defaultValue={fetchedHaveData?.haveTokenId}/>
          <button type="submit"> Load </button>
        </StyledInputSec>
      </>
  )
}

const StyledInputSec = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-color: transparent;

  font-family: VT323;
`