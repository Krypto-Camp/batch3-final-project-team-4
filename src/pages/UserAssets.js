import React, { useEffect, useState } from 'react'
import styled from 'styled-components';

import { useAccount } from 'wagmi';
import { useMoralisWeb3Api } from "react-moralis";
import { motion, AnimateSharedLayout } from "framer-motion";
import { useSwipeable } from "react-swipeable";

export default function UserAssets({ fetchedHaveData, setFetchedHaveData, handletHaveNFT, setModalOpened }) {
  const [ walletNFTs, setWalletNFT ] = useState(null);
  const { data: wallet } = useAccount();
  
  const renderTokensForOwner = (ownerAddress) => {
    fetch(
      `https://testnets-api.opensea.io/api/v1/assets?owner=${ownerAddress}`,
      // `https://testnets-api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=0&limit=30`,
      { method: "GET", headers: { Accept: "application/json" } }
    ).then(response => response.json()).then(({ assets }) => {
      // console.log('assets: ',assets)

      let formattedData = assets.reduce((formattedAsset, attr, i) => { 
        formattedAsset.push({
          description: attr.description || '',
          name: attr.name || '',
          token_id: attr.token_id || '',
          nft_address: attr.asset_contract.address || '',
          schema_name: attr.asset_contract.schema_name || '',
          image_url: attr.image_url || '',
          id: attr.id || '',
          owner: attr.owner.address || ''
        })
        return formattedAsset
      }, [])
      // console.log('formattedData: ', formattedData)
      setWalletNFT(formattedData);
    })
  }
  
  useEffect(() => {
    renderTokensForOwner(wallet?.address)
  }, [])

  // useEffect(() => {
  //   console.log(walletNFTs)
  // }, [walletNFTs]);

  const handleLoad = e => {
    // console.log(walletNFTs[currentPage])
    setFetchedHaveData(walletNFTs[currentPage])
    handletHaveNFT(walletNFTs[currentPage])
    setModalOpened(false)
  }

  const [currentPage, setCurrentPage] = useState(0);

  const handleSwipe = (dir) => {
    if (dir === "left") {
      if (currentPage >= walletNFTs.length-1 ) return
      if (currentPage <= walletNFTs.length -1) setCurrentPage( curr => curr + 1)
    }
    if (dir === "right") {
      if (!currentPage) return
      if (currentPage <= walletNFTs.length -1) setCurrentPage( curr => curr - 1)
    }
  };
  
  const [cursorStyle, setCursorStyle] = useState('grab');

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true,
    onSwiping: () => setCursorStyle('grabbing'),
    onSwiped: () => setCursorStyle('grab'),
  });


  return (
    <StyledCardContainer {...handlers} cursorStyle={cursorStyle} >
          <StyledCardRow className='row' >
          { walletNFTs?.map( (nft, i) => ( 
              <StyledContenWrap
                  key={i}
                  as={motion.div}
                  className='content-wrap'
                  initial={{ scale: 0, rotation: -180}}
                  animate={{
                    rotate: 0, 
                    left: `${(i-currentPage)*60 -30}vw`,
                    scale: i === currentPage ? 1 : 0.9,
                  }}
                  transition={{
                    type:"spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                <StyledCardWarp className="card-wrap" key={i} image_url={nft?.image_url}> 
                    <StyledCardTop className="card-top" >
                        <StyledCardItems>NFT address: {nft.nft_address}</StyledCardItems>
                        <StyledCardItems>{nft.name}</StyledCardItems>
                        <StyledCardItems># {nft.token_id}</StyledCardItems>
                        <StyledCardItems>{nft.schema_name}</StyledCardItems>
                    </StyledCardTop>
                    
                    <StyledButton onClick={handleLoad}> Confirm Load </StyledButton>
                </StyledCardWarp>

            </StyledContenWrap>

            ))}
            
          </StyledCardRow>


    </StyledCardContainer>
  )
}

const StyledCardContainer = styled.div`
  // position: absolute;
  // top:0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${({cursorStyle}) => cursorStyle }
`

const StyledCardRow = styled.div`
  position: relative;
`

const StyledContenWrap = styled(motion.div)`
  position: absolute;
  top: -25vh;
  // transform: translateY(-50%);
  width:50vw;
  height:50vh;

  

  overflow: hidden;
  border-radius: 20px;
`

const StyledCardWarp = styled.div`
  position:absolute;
  
  width: 50vw;
  height: 50vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;


  border-radius: 20px;

  font-family: VT323;
  font-size: 1.2rem;
  background-image: ${({image_url}) => `url( ${image_url} )`} ;
  background-repeat: no-repeat;
  background-position: center;
`
const StyledCardTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;

`
const StyledCardItems = styled.div`
  max-width: 80%;
  overflow: hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
  padding: 10px;
  margin: 5px;

  border: 1px solid #000;
  border-radius: 30px;
  background: #FFFFFF80;
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
    background-color: #12f7ff;
  }
`