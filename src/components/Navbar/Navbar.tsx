import React, { useState } from 'react';
import './Navbar.css';

const Navbar:React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">App Name</div>
            <button className="navbar-toggle" onClick={toggleMenu}>
            ☰
            </button>
            <div className={`navbar-menu ${isOpen ? 'open' : ''}`}>
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;