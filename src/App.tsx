import React, { useEffect } from 'react';
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
import {usePageTracking} from './firebase';
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
  useEffect(() => {
    usePageTracking();
  }, [location.pathname]);
  return (
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
    
  );
}
export default App;
