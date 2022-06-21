import './App.css';
import WalletContextProvider from './context/WalletContext';
import { BrowserRouter } from "react-router-dom"
import Router from './Router';
import styled from 'styled-components';
import { useMoralis } from "react-moralis";
import { useEffect } from 'react';

/**
 * @TODO Suspend!
 * @TODO Refactor ways of fetching.
 *       cache data
 * @TODO uninstall unused package.
 *  
 */
function App() {
  const { authenticate, isAuthenticated, user } = useMoralis();
  // useEffect(() => {
  //   authenticate()
  // }, [])

  return (
    // <WalletContextProvider>
      <div className="App">
        <BrowserRouter>
          <Router/>
        </BrowserRouter>
      </div>
  //  </WalletContextProvider>
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
