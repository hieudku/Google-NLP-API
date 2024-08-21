import React from 'react';
import './misc.css';

const ContactMe: React.FC = () => {
    return (
        <div className="misc-text">
            <ul>
                <li>Feel free to contact me on any issues, suggestions or collaboration regarding the project at:</li>
                <li>Email: hieu.dcu@gmail.com</li>
                <li><a href='https://github.com/hieudku'>My Github profile</a></li>
            </ul>
        </div>
    );
};

export default ContactMe;