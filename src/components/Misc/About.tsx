import React from 'react';
import './misc.css';

const AboutThisApp: React.FC = () => {
    return (
        <div className="misc-text">
            <h3>Hi there!</h3>
            <ul>
                <li>User data will be encrypted and securely stored on Firebase by google standard. I will not access, manage user accounts, or gather any personal information.</li>
                <li>I am a student, and this project is a part of my practice in creating full-stack applications. It is not intended for commercial use in any ways.</li>
            </ul>
        </div>
    );
};

export default AboutThisApp;