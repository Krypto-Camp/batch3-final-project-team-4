import React from 'react'
import { Link } from "react-router-dom";

import styled from 'styled-components';

export default function Sidebar({ setMenuOpened, isMenuOpened }) {
  return (
    <StyledSidebar isMenuOpened={isMenuOpened}>
        <StyledBarArea isMenuOpened={isMenuOpened}>
            <Link to="viewswaps" onClick={() => setMenuOpened(false)}> Discover All Swaps </Link>
            <Link to="create-contract" onClick={() => setMenuOpened(false)}> Discover All Swaps </Link>
            <Link to="view-wallet-asset" onClick={() => setMenuOpened(false)}> View your assets </Link>
            <Link to="view-wallet-transaction" onClick={() => setMenuOpened(false)}> View your swaps </Link>
        </StyledBarArea>
    </StyledSidebar>
  )
}

const StyledSidebar = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    z-index:-1;
    border: none;
    height: ${({isMenuOpened}) => isMenuOpened && '100vh'};
    width: ${({isMenuOpened}) => isMenuOpened && '100vw'};
    // display: ${({isMenuOpened}) => isMenuOpened ? 'block' : 'none'};
    background: #0000005A;
`
const StyledBarArea = styled.button`
    position: absolute;
    top: 0;
    right: -100px;
    border: none;

    height: ${({isMenuOpened}) => isMenuOpened ? '100vh' : '0px'};
    width: ${({isMenuOpened}) => isMenuOpened ? '400px': '0px'};
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    padding-top: 15vh;
    padding-left: 30px;
    font-family:  "VT323";
    font-size: 2rem;

    transition: all 200ms ease-in-out; 

`