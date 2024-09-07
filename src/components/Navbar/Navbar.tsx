import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Navbar:React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const clickOutsidePanel = (event: MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', clickOutsidePanel);
        return () => {
            document.removeEventListener('mousedown', clickOutsidePanel);
        };
    }, []);

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
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div className="navbar-brand">
                <div className="brand-logo">
                <p><strong>Unredacted</strong></p>
                <VisibilityIcon sx={{ fontSize: 30, color: '#f1f1f1' }}/>
                </div>
            </div>

            <div ref={panelRef} className={`navbar-panel ${isOpen ? 'open' : ''}`}>
                <img className="app-logo" src="/logo3.png" alt="App Logo" />
                <br />
                <br />
                <a className= "navbar-link" href="/login">Login</a>
                <a className= "navbar-link" href="/register">Register</a>
                <br />
                <br />
                <a className= "navbar-link" href="/">Home</a>
                <a className ="navbar-link" href="/search">Reddit</a>
                <a className= "navbar-link" href="/sources">Sources</a>
                <a className= "navbar-link" href="/about">About</a>
                <a className= "navbar-link" href="/contact">Contact</a>
                
                
            </div>
        </nav>
    );
};

export default Navbar;