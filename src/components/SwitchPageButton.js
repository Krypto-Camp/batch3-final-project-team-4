import React from 'react'
import styled from 'styled-components';
import { Link, useLocation } from "react-router-dom";

export default function SwitchPageButton() {
  const location = useLocation();
  return (
    <StyledIconBtn >
        {
          location.pathname === '/viewswaps' ?
          
          <Link to="create-contract">  
            <StyledIcon viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" className="menu-icon">
            <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </StyledIcon>
          </Link>

          : location.pathname === '/create-contract' &&
           
          <Link to="viewswaps">  
            <StyledIcon viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" className="menu-icon">
              <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
              <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
            </StyledIcon>
          </Link>
        }

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
    fill: #000;

    &:hover {
      fill: red;
    }
`