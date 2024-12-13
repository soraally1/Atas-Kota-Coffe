import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Menu from './pages/Menu';
import Location from './pages/Location';
import Home from './pages/home';
import Item from './pages/Item';
import Keranjang from './pages/Keranjang';
import Login from './pages/Login';

function App() {

  return (
    <Router>
        <Navbar/>
        <Routes>
        <Route path="/" element={<Home/>}/>
        {/* <Route path='/' element={<Location/>}/> */}
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/Location" element={<Location/>}/>
        <Route path="/menu/item" element={<Item/>}/>
        <Route path="/cart" element={<Keranjang/>}/>
        <Route path="/login" element={<Login/>}/>
        </Routes>
        
    </Router>
  )
}

export default App
