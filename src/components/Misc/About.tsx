import React from 'react';

const AboutThisApp: React.FC = () => {
    return (
        <div className="about-text">
            <h3>Hello</h3>
            <ul>
                <li>Any user data will be securely stored on Firebase. I will not access, manage user accounts, or gather any personal information.</li>
                <li>I am a student, and this project is part of my practice in creating full-stack applications. It is not intended for commercial use in any way.</li>
            </ul>
        </div>
    );
};

export default AboutThisApp;