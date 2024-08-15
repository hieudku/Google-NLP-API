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

    return (
        <div className="authentication-container">
            <h2>Login</h2>
            <form onSubmit={manageLogin}>
                <div className="login-input">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="login-input">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="auth-button">Login</button>
            </form>
        </div>
    );
};

export default Login;