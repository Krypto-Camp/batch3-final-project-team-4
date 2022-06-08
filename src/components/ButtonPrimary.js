import React from 'react'
import styled from 'styled-components';

/**
 * @TODO Make global scss color variable. also set btn type from props.
 */

export default function ButtonPrimary({children}) {
  return (
    <StyledButton> {children} </StyledButton>
  )
  
}

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