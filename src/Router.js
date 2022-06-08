import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import ViewSwaps from "./pages/ViewSwaps"
import Account from "./pages/Account"
import Navbar from "./components/Navbar"

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/viewswaps" element={<ViewSwaps />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </BrowserRouter>
)
}
