import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar:React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            
            <button className="navbar-toggle" onClick={toggleMenu}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M3 6H21M3 12H21M3 18H21"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div className="navbar-brand">App Name</div>

            <div className={`navbar-panel ${isOpen ? 'open' : ''}`}>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
                <br />
                <br />
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                
                
            </div>
        </nav>
    );
};

export default Navbar;