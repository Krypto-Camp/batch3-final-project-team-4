import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
// import ButtonPrimary from './ButtonPrimary';
import MenuButton from './MenuButton';
import styled from 'styled-components';
import Sidebar from './Sidebar';

import { useAccount, useConnect, useNetwork, chain } from 'wagmi'


/**
 * @TODO save account to localhost
 * @TODO display whole address when clicked
 */

export default function Navbar({ switchNetReq, setSwitchNet }) {
  const { connect, connectors } = useConnect();
  const { data: currentAccount } = useAccount();

  const [ isMenuOpened, setMenuOpened ] = useState(false);
  
  const connectAccount = async() => { 
      if ( currentAccount ) return;
      connect(connectors[0]); 
  }  

  const { activeChain, switchNetwork } = useNetwork({
      chainId: chain.rinkeby.id,
  });

  useEffect(() => {
    if (activeChain && activeChain.id !== chain.rinkeby.id) {
      setSwitchNet(true)
      switchNetwork && switchNetwork();

    } else {
      setSwitchNet(false)
    }
  }, [activeChain, switchNetwork] )


  return (
    <StyledNav className='nav'>
      <StyledTitle> 
        <Link to="/"> SWAP NFT </Link>
      </StyledTitle>

      <StyledButtonsWrap>
        { currentAccount 
        ? switchNetReq ? ( <StyledWallet> <p> pls switch net</p> </StyledWallet>) : ( <StyledWallet> <p> {currentAccount.address} </p> </StyledWallet>)
        : <StyledButton onClick={connectAccount}> connect wallet </StyledButton>
        }
        <MenuButton setMenuOpened={setMenuOpened} isMenuOpened={isMenuOpened}> menu </MenuButton>
      </StyledButtonsWrap>

      <Sidebar setMenuOpened={setMenuOpened} isMenuOpened={isMenuOpened}/>
      
    </StyledNav>
  )
}

const StyledNav = styled.div`
  position: sticky;
  top: 0;
  
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: auto;
  font-family: inherit;
  background: transparent;
`
const StyledTitle = styled.h1`
  // display: none;
  text-decoration: none;
`
const StyledButtonsWrap = styled.div`
  display: flex;
  gap: 15px;

`


const StyledWallet = styled.div`
  display: inline-flex;
  align-items: center; 
  align-self: center;
  
  height: auto;
  max-height: 35px;
  max-width: 150px;
  padding: 15px;
  font-size: .9rem;

  p {
    overflow: hidden;
    text-overflow: ellipsis;

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