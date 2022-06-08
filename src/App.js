import { useState } from 'react';
import './App.css';
import WalletContextProvider from './context/WalletContext';
import Router from './Router';
import styled from 'styled-components';

function App() {


  return (
    <WalletContextProvider>
      <div className="App">
        <Router/>
      </div>
   </WalletContextProvider>
  );
}

export default App;


const StyledApp = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  // padding: 15px;
  font-family: inherit;

  
`
