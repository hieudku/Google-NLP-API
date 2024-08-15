import React from 'react';
import './Button.css';

interface ButtonHandles {
    label: string;
    onClick :() => void;
}

const Button:React.FC<ButtonHandles> = ({label, onClick}) => {
    return (
        <button className="responsive-button" onClick={onClick}>
            {label}
        </button>
    );
};

export default Button