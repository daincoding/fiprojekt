import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import ApiTest from "./pages/ApiTest.jsx";

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apitest" element={<ApiTest />} />
            </Routes>
        </>
    )
}

export default App