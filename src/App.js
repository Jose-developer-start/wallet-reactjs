import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Wallet from "./pages/Wallet";

function App() {
  
  /*
  const ws = new WebSocket('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
  ws.onmessage = (e)=>{
    console.log(e)
  }*/
  return (
    <>
    <Router>
      <Navbar />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
    </Router>
    </>
  );
}

export default App;
