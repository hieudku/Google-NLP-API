import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './Auth.css';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const manageRegister = (e:React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords dont match");
            return;
        }

        // firebase registration

        console.log('Registering with: ', email, password);
    };
    // registration form
    return (
        <div className="auth-container">
            <h2>Create An Account</h2>
            <form onSubmit={manageRegister}>

                <div className="form-input">
                    <input
                        type="Email"
                        placeholder='Email'
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                </div>

                <div className="form-input">
                    <input
                        type="Password"
                        placeholder="Password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                </div>

                <div className="form-input">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        />
                </div>

                <button type="submit" className="form-button">Register</button>

            </form>
        </div>
    );
};

export default Register;