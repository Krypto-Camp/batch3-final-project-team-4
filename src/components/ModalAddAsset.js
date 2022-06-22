import React from 'react'
import styled from 'styled-components';

export default function ModalAddAsset({ isModalOpened, setModalOpened, children }) {
    if (!isModalOpened) return null


    return (
        <>
        <StyledOverlay className='overlay' isModalOpened={isModalOpened}/> 
        <StyledModal className='modal'>
            <StyledModalBtn onClick={() => setModalOpened(false) }> X </StyledModalBtn>
            <div> 
                {children}
            </div>
            
        </StyledModal>
        
        </>
        
    )
}

const StyledModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    width:70vw;
    height:60vh;
    
    display: flex;
    justify-content: center;
    align-items: center;
    background: #4b0affA0;
`
const StyledModalBtn = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    margin: 20px;
    width: 20px;
    height: 20px;
    border: none;
    background: #FFF;
    z-index: 99;

    &:hover {
        background-color: #12f7ff;
      }
`



const StyledOverlay = styled.div`
    position:  fixed;
    width: 100vw;
    height: 100vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    background: ${({ isModalOpened }) => isModalOpened ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0)'};
    // opacity: ${({ isModalOpened }) => isModalOpened ? '.4' : '0'};
    // transition: opacity 500ms ease-in-out;
    // transition-delay: 500ms;
    // transition-property: opacity;

`

