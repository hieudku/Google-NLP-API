import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from './components/Button/Button';
import Navbar from './components/Navbar/Navbar';

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
    <div className="App">
      <Navbar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App;
