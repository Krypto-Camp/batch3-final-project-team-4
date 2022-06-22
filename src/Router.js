import { useState } from 'react'
import { Routes, Route, useLocation } from "react-router-dom"
import Homepage from "./pages/Homepage"
import ViewSwaps from "./pages/ViewSwaps"
import UserTransactions from "./pages/UserTransactions"
import UserAssets from "./pages/UserAssets"
import Navbar from "./components/Navbar"
import CreateSwap from './components/CreateSwap'
import { AnimatePresence } from 'framer-motion'

export default function Router() {
  const location = useLocation();
  const [switchNetReq, setSwitchNet] = useState(false);

  return (
    <>
      <Navbar switchNetReq={switchNetReq} setSwitchNet={setSwitchNet} />
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Homepage switchNetReq={switchNetReq} />} />
          <Route path="/viewswaps" element={<ViewSwaps switchNetReq={switchNetReq} />} />
          <Route path="/create-contract" element={<CreateSwap switchNetReq={switchNetReq} />} />

          {/* <Route path="/view-wallet-asset" element={<UserAssets switchNetReq={switchNetReq} />} />
          <Route path="/view-wallet-transaction" element={<UserTransactions switchNetReq={switchNetReq} />} /> */}
        </Routes>
      </AnimatePresence>

    </>
)
}
