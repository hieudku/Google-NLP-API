import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GlitchText from '../Misc/GlitchText';

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
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div className="navbar-brand">
                <GlitchText
                speed={1}
                enableShadows={true}
                enableOnHover={false}
                className='custom-class'
                >
                unREDACTED
                </GlitchText>
            </div>

            <div ref={panelRef} className={`navbar-panel ${isOpen ? 'open' : ''}`}>
                <br />
                <br />
                <a className="navbar-link" href="/login">
                    <GlitchText
                        speed={1}
                        enableShadows={true}
                        enableOnHover={true}
                        className="glitch-nav"
                    >
                        Login
                    </GlitchText>
                    </a>
                                <a className="navbar-link" href="/register">
                    <GlitchText
                        speed={1}
                        enableShadows={true}
                        enableOnHover={true}
                        className="glitch-nav"
                    >
                        Register
                    </GlitchText>
                    </a>
                <br />
                <br />
                                <a className="navbar-link" href="/">
                    <GlitchText
                        speed={1}
                        enableShadows={true}
                        enableOnHover={true}
                        className="glitch-nav"
                    >
                        Home
                    </GlitchText>
                    </a>
                <a className="navbar-link" href="/sources">
                    <GlitchText
                        speed={1}
                        enableShadows={true}
                        enableOnHover={true}
                        className="glitch-nav"
                    >
                        Sources
                    </GlitchText>
                    </a>
                <a className="navbar-link" href="/about">
                    <GlitchText
                        speed={1}
                        enableShadows={true}
                        enableOnHover={true}
                        className="glitch-nav"
                    >
                        About
                    </GlitchText>
                    </a>
                <a className="navbar-link" href="/contact">
                    <GlitchText
                        speed={1}
                        enableShadows={true}
                        enableOnHover={true}
                        className="glitch-nav"
                    >
                        Contact
                    </GlitchText>
                    </a>
            </div>
        </nav>
    );
};

export default Navbar;