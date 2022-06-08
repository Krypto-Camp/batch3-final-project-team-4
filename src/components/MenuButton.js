import React from 'react'
import styled from 'styled-components';

export default function MenuButton({ setMenuOpened, isMenuOpened}) {
  return (
    <StyledIconBtn onClick={() => setMenuOpened(!isMenuOpened)}>
        <StyledIcon viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="menu-icon"><g ><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g></StyledIcon>
    </StyledIconBtn>
  )
}

const StyledIconBtn = styled.button`
    background: none;
    border: none;
    padding: 0;
`
const StyledIcon = styled.svg`
    width: 35px;
    height: 35px;
    cursor: pointer;
    fill: var(--medium-gray);
    
    &:hover {
        fill: #FFF;
    }
`