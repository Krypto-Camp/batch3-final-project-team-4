import { useRef } from 'react'
import styled from 'styled-components';
import { renderNFTData } from '../utils/functions'



/**
 * @TODO fetch HAVE/WANT TAB data here and pass it to CreateSwapContext
 * need to submit it with form data
 */
export default function WantNFTContent({ fetchedWantData, setFetchedWantData, handletWantNFT, setModalOpened }) {
  const addrRef = useRef()
  const tokenIDRef = useRef()
  const receiverRef = useRef()
  const loadNFT = e => {
    e.preventDefault();
    if (addrRef.current.value && tokenIDRef.current.value) renderNFTData(addrRef.current.value, tokenIDRef.current.value, handletWantNFT )
    setFetchedWantData({ wantNFTAddress:addrRef.current.value, wantTokenId:tokenIDRef.current.value, receiver:receiverRef.current.value })
    setModalOpened(false)
  }

  return (
    <>
    <div> Target NFT</div>
    <StyledInputSec onSubmit={loadNFT}>
      <label> Receiver address </label>
      <input type="text" ref={receiverRef} defaultValue={fetchedWantData?.receiver}/>
      <label> NFT address </label>
      <label> leave a blank if you want it for sale</label>
      <input type="text" ref={addrRef} defaultValue={fetchedWantData?.wantNFTAddress}/>
      <label> NFT tokenID </label>
      <label> leave a blank if you want it for sale</label>
      <input type="text" ref={tokenIDRef} defaultValue={fetchedWantData?.wantTokenId} />
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