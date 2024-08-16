import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './components/Button/Button';
import Navbar from './components/Navbar/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from './components/HomeFeed/Feed'
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
  return (
    <Router>
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
      <Feed />
    </div>
    </Router>
    
  );
}
export default App;
