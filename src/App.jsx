import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import Menu from './pages/Menu';
import Location from './pages/Location';
import Home from './pages/home';

function App() {

  return (
    <Router>
        <Navbar/>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/menu" element={<Menu/>}/>
        <Route path="/Location" element={<Location/>}/>
        </Routes>
        
    </Router>
  )
}

export default App
