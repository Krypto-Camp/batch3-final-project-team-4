import { useState } from 'react'
import CreateSwap from '../components/CreateSwap'
// import ButtonPrimary from '../components/ButtonPrimary';
import styled from 'styled-components';


export default function Homepage({ switchNetReq }) {
    const [pressedSwap, setPressedSwap] = useState(false);

    const handleClick = () => {
      setPressedSwap(true);
    };
  
    
    return (
      <StyledCreateSwap className='create-swap' pressedSwap={pressedSwap}>
          <StyledElementsWrap >
            {
              !pressedSwap && 
              <>
                <StyledTexts> all your swaps belong to us </StyledTexts>
                <StyledTexts> make it as EASY as you can ever imagine </StyledTexts>
                <StyledTexts className='underline'> with zero swap fees! </StyledTexts>
              </>
             }
            { pressedSwap 
              ? <CreateSwap switchNetReq={switchNetReq}/>
              : <StyledButton onClick={handleClick}> SWAP IT NOW </StyledButton>
            }            
          </StyledElementsWrap>
      </StyledCreateSwap>

      
  )
}

const StyledCreateSwap = styled.div`
  position: absolute;
  top:0;
  left:0;
  height: 100vh;
  width: 100%;
  z-index: -1;
  display: flex;
  justify-content:  ${({pressedSwap}) => pressedSwap ? 'center' : 'start'};
  align-items: center;

  // padding: 15px;
  font-family: inherit;

  background: rgb(223,173,155);
  background: linear-gradient(153deg, rgba(223,173,155,0.9612219887955182) 9%, rgba(166,196,213,1) 34%, rgba(81,78,158,1) 84%, rgba(7,5,43,1) 100%);

`
const StyledElementsWrap = styled.div`
  width: auto;
  margin: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  
`
const StyledTexts = styled.div`
  margin: 10px;
  font-family: "VT323";
  font-size: 2.4rem;
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