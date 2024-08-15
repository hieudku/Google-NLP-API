import React, { useState } from 'react';
import './Auth.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const manageLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // firebase auth
        console.log('logged in with: ', email, password);
    };
    // login form
    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={manageLogin}>
                <div className="form-input">
                    <input
                        type="email"
                        placeholder='Email'
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-input">
                    <input
                        type="password"
                        placeholder='Password'
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="form-button">Login</button>
            </form>
        </div>
    );
};

export default Login;