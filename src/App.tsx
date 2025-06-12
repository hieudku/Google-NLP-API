import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './components/Button/Button';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from './components/HomeFeed/Feed'
import Dashboard from './components/Dashboard';
import ContactMe from './components/Misc/Contact';
import AboutThisApp from './components/Misc/About';
import axios from 'axios';
import { trackPageVisit } from './firebase';
import Aurora from './components/Misc/Aurora';
import Hyperspeed from './components/Misc/Hyperspeed';
import Particles from './components/Misc/Particles';
/*
const AppTest:React.FC = () => {
  const handleClick = () => {
    alert('testing button click success');
  };

  return (
    <div className="AppTest">
      <Button label="Click Test" onClick={handleClick}/>
    </div>
  )
}
*/

function App() {
  trackPageVisit();
  return (
    <div className="app-wrapper">
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={1000}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={true}
        disableRotation={true}
      />
    <Router>
    <div className="App">
      <Navbar />
      <Routes>
        <Route 
          path="/" 
          element={
            <div>
          {<Dashboard />}
            </div>
          }
          />
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/contact" element={<ContactMe />} />
        <Route path="/about" element={<AboutThisApp />} />
        <Route path="/sources" element={<Feed />} />
      </Routes>
    </div>
    </Router>
    </div>
  );
}
export default App;
