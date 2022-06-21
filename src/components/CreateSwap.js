import React, { useEffect, useState, useRef } from 'react'
import ModalAddAsset from './ModalAddAsset';
import HaveNFTContent from './HaveNFTContent';
import WantNFTContent from './WantNFTContent';
import styled from 'styled-components';

import { ethers } from 'ethers';
import { contractABI, contractAddress, erc721ContractABI } from '../configs/contract';
import { useSigner, useContract, useContractWrite } from 'wagmi'
import UserAssets from '../pages/UserAssets';

/**
 * @TODO click wallet nft load data
 * @TODO load nft
 * @TODO add inputs: margin prices. 
 *        if have one, Take() first before create contract, (do it in one function?)
 * @TODO if just for sale, make _wantToken = 9999999
 *  
 * @TODO field sanitizing and validation. required field. 
 * @TODO useWaitForTransaction and add loader
 */
export default function CreateSwap() {


  const [fetchedHaveData, setFetchedHaveData] = useState({ haveTokenId:'8', haveNFTAddress:'0xd728a5ca148db9e7eb7f419389a6b59ba3bb61fa' });
  const [fetchedWantData, setFetchedWantData] = useState({ wantTokenId:'1', wantNFTAddress:'0x4af4e1fd1184ba6abd1d1c7cf3d7f8afc1d75116', receiver: '0x0F1CD12F75508aa0420dA9cD9798D9cD93627bb3', amount:'' });
  const [expireIn, setExpireIn] = useState(7);
  const [havePrice, setHavePrice] = useState(0);
  const [wantPrice, setWantPrice] = useState(0);
  const [ haveNFTData, setHaveNFTdata] = useState()
  const [ wantNFTData, setWantNFTdata] = useState()
  const [renderHaveInputForms, setRenderHaveInputForms] = useState(true)
  const [renderWantInputForms, setRenderWantInputForms] = useState(true)


  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: contractABI,
    signerOrProvider: signer
  })
  


  const calculateExpiredDate = (days) => {
    return days*24*60*60 + Math.floor(Date.now() / 1000)
  }
  const formatPrice = (price) => {
    return parseInt(price)*1000000000000000000
  }
  
  const createTransac = async(params) => {

    // format input params
    let paramArray = [
      params?.receiver , 
      params?.haveNFTAddress , 
      params?.wantNFTAddress || '0x0000000000000000000000000000000000000000', 
      params?.haveTokenId || 0, 
      params?.wantTokenId || 9999999, 
      calculateExpiredDate(expireIn), 
      formatPrice(havePrice) , 
      formatPrice(wantPrice) ]
    
      console.log(paramArray)
    // approve myNFT
    const nft_contract = new ethers.Contract(params.haveNFTAddress, erc721ContractABI, signer);
    await nft_contract.approve(contractAddress, params.haveTokenId).catch( e => console.log(e) )

    const create_res = await contract?.createTransaction(...paramArray).catch( e => console.log(e) )
    console.log(create_res)
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

  const handleExpire = e => {
    setExpireIn(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault();
    createTransac({ ...fetchedHaveData, ...fetchedWantData });
  }
  const handleReset = e => {
    e.preventDefault();
    setFetchedHaveData({});
    setFetchedWantData({});
    setHaveNFTdata({});
    setWantNFTdata({});
    setRenderHaveInputForms(true);
    setRenderWantInputForms(true);
  }
  
  // useEffect(() => {
  //   console.log("haveNFTDataRef.current",haveNFTDataRef.current)
  // }, [haveNFTDataRef.current])

  function handletHaveNFT(newValue) {
    setHaveNFTdata(newValue);
    setRenderHaveInputForms(false)
  }
  function handletWantNFT(newValue) {
    setWantNFTdata(newValue);
    setRenderWantInputForms(false)
  }

  useEffect(() => {
    console.log(haveNFTData)
  }, [haveNFTData?.image_url])

  return (
    <StyledCreateSwapContainer>
      <StyledElementsWrap>

          <StyledCardWrap >
            <StyledSwapCard >
              {renderHaveInputForms && (
                <>
                  <h3> ADD ASSET </h3>
                  <StyledButton 
                    onClick={ () => handleAssetClicked(
                      <HaveNFTContent fetchedHaveData={fetchedHaveData} setFetchedHaveData={setFetchedHaveData} handletHaveNFT={handletHaveNFT} setModalOpened={setModalOpened}/>) }
                  > 
                    by address
                  </StyledButton>
                  <StyledButton 
                    onClick={ () => handleAssetClicked(
                      <UserAssets fetchedHaveData={fetchedHaveData} setFetchedHaveData={setFetchedHaveData} handletHaveNFT={handletHaveNFT} setModalOpened={setModalOpened}/>) }
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
              )}

              <StyledNFTImg>
                <img src={haveNFTData?.image_url} alt=""/>
              </StyledNFTImg>
            </StyledSwapCard>

            <StyledSwapCard> 
              {
                renderWantInputForms  && (
                  <>
                    <p> and you're looking for </p>
                    <StyledButton 
                      onClick={ () => handleAssetClicked(
                      <WantNFTContent fetchedWantData={fetchedWantData} setFetchedWantData={setFetchedWantData} handletWantNFT={handletWantNFT} setModalOpened={setModalOpened}/>)}
                    > 
                      by address
                    </StyledButton>
                    <StyledSwapCardTexts>
                      leave a make-up price if you'd like to: 
                      <div> 
                        <input type="number" defaultValue="0"  onChange={e => setWantPrice(e.target.value)}/>  
                        <p> eth </p>
                      </div>
                    </StyledSwapCardTexts>
                  </>
                )
              }
              <StyledNFTImg>
                <img src={wantNFTData?.image_url} alt=""/>
              </StyledNFTImg>

            </StyledSwapCard>
          </StyledCardWrap>

          <StyledForm> 
            <h3> YOUR CONTRACT</h3>
            <StyledInfo> 
                <StyledInfoCol>
                  <p> your NFT: {haveNFTData?.nft_address } # {haveNFTData?.token_id }</p>
                  <p> {haveNFTData?.schema_name } </p>
                  <p> name: {haveNFTData?.name } </p>
                  <p> make-up price: { havePrice } </p>
                </StyledInfoCol>
              

                <StyledInfoCol>
                  <p> trade for NFT: {wantNFTData?.nft_address } # {wantNFTData?.token_id }</p>
                  <p> {wantNFTData?.schema_name } </p>
                  <p> name: {wantNFTData?.name } </p>
                  <p> make-up price: { wantPrice } </p>
                </StyledInfoCol>
            </StyledInfo>
            <StyledSubmits>
              <div>
              <StyledLabel> expiration date: </StyledLabel>
              <StyledInput type="number" onChange={handleExpire} defaultValue={expireIn} />
              </div>
              <StyledButton type="submit" onClick={handleSubmit}> create swap </StyledButton>
              <StyledButton onClick={handleReset}> reset swap </StyledButton>
            </StyledSubmits>
          </StyledForm>
       </StyledElementsWrap>

        <ModalAddAsset isModalOpened={isModalOpened} setModalOpened={setModalOpened}> {ModalContent} </ModalAddAsset>
      </StyledCreateSwapContainer>
  )
}



const StyledNFTImg = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  z-index:-1;
`
const StyledInfo= styled.div`
  display: inline-grid;
  grid-template-columns: 400px 400px;
  height:90%;
  gap: 100px;
  
  font-size: 1.5rem;
  font-family: "VT323";
`
const StyledSubmits= styled.div`
  display: flex;
  height:10%;
  gap: 100px;

`
const StyledLabel= styled.label`
  width: 200px;
  font-size: 1.5rem;
  font-family: "VT323";
`
const StyledInput= styled.input`
  width: 200px;
`
const StyledInfoCol= styled.div`
  max-width: 400px;
`
// ==========================================
const StyledCreateSwapContainer = styled.div`
  position: absolute;
  top:0;
  left:0;
  height: 100vh;
  width: 100%;

  background: rgb(223,173,155);
  background: linear-gradient(153deg, rgba(223,173,155,0.9612219887955182) 9%, rgba(166,196,213,1) 34%, rgba(81,78,158,1) 84%, rgba(7,5,43,1) 100%);
`
const StyledElementsWrap = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  height: 90vh;
  width: auto;
  // margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  
`
const StyledCardWrap = styled.div`
  position: relative;
  width: auto;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledSwapCard = styled.div`
  width: 500px;
  height: 500px;
  margin: 40px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 5px;
  border-radius: 5px;
  border-color: transparent;
  
`
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
const StyledForm = styled.div`
position: relative;

  width: 90vw;
  height: 40vh;
  // margin: 40px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border-color: transparent;
  background: #FFFFFF50;
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

