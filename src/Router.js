import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import ViewSwaps from "./pages/ViewSwaps"
import UserTransactions from "./pages/UserTransactions"
import UserAssets from "./pages/UserAssets"
import Navbar from "./components/Navbar"

export default function Router() {
  const [switchNetReq, setSwitchNet] = useState(false);

  return (
    <BrowserRouter>
      <Navbar switchNetReq={switchNetReq} setSwitchNet={setSwitchNet} />

      <Routes>
        <Route path="/" element={<Homepage switchNetReq={switchNetReq} />} />
        <Route path="/viewswaps" element={<ViewSwaps switchNetReq={switchNetReq} />} />
        <Route path="/view-wallet-asset" element={<UserAssets switchNetReq={switchNetReq} />} />
        <Route path="/view-wallet-transaction" element={<UserTransactions switchNetReq={switchNetReq} />} />
      </Routes>
    </BrowserRouter>
)
}
