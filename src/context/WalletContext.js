
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'


export const WalletContext = React.createContext({
    currentAccount: null,
    setCurrentAccount: () => {},
    provider: null
});

const WalletContextProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        window.ethereum?.on("chainChanged", detectChain);
    }, [])

    useEffect(() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
    }, [])

    
    return (
        <WalletContext.Provider value={{ currentAccount, setCurrentAccount, provider}}>
            {children}
        </WalletContext.Provider>
    )
}
export default WalletContextProvider;



async function detectChain() {
    try {
        await window.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x4' }],
        })
    } catch(err) {
        if (err.code === -32002) {
            window.alert("請確認metamask鏈是否為Rinkeby");
          }
    }
}