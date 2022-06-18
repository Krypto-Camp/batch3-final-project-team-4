import React, { useEffect, useState } from 'react'
import styled from 'styled-components';

import { useMoralisWeb3Api } from "react-moralis";

export default function UserAssets() {
  const [ walletNFTs, setWalletNFT ] = useState(null);
  const Web3Api = useMoralisWeb3Api();

  const fetchNFTs = async () => {
    // get NFTs for current user on Mainnet
    // const userEthNFTs = await Web3Api.account.getNFTs();
    // console.log(userEthNFTs);
    // get testnet NFTs for user
    const testnetNFTs = await Web3Api.Web3API.account.getNFTs({
      chain: "rinkeby",
    });
    // console.log(testnetNFTs);
    setWalletNFT(testnetNFTs);
    // get polygon NFTs for address
    // const options = {
    //   chain: "0x4",
    //   address: "0xa6A53158A0A30AA8C3Dbf71E5234bA058b2458B6",
    // };
    // const polygonNFTs = await Web3Api.account.getNFTs(options);
    // console.log(polygonNFTs);
  };

  useEffect(() => {
// console.log(Web3Api)
      fetchNFTs();
  }, [Web3Api]);

  /**
   * @TODO add pagenation
   */
  return (
    <div>
      <div>UserAssets</div>
      { 
       walletNFTs?.result?.map( (nft, i) => (
        <StyledCardWrap key={i}> 
           <div>{nft.name}</div>
           <div>{nft.contract_type}</div>
           <div>token_address: {nft.token_address}</div>
           <div>token_id: {nft.token_id}</div>
        </StyledCardWrap>
      ))}
    </div>
  )
}

const StyledCardWrap = styled.div`
  width: auto;
  height: auto;
  padding: 20px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  background: #fff2d9;
  border-radius: 20px;

  font-family: VT323;
  font-size:1.2rem;

`
