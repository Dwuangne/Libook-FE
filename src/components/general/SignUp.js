import React, { useState } from 'react';
// import axios from 'axios';
import { toast } from 'react-toastify';
import { signUpApi } from '../../api/UserApi';
// import { UserApi, signUpApi } from '../../api/UserApi';
//import { useNavigate } from "react-router-dom";


const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    //const [showPassword, setShowPassword] = useState(false);
    //const [loading, setLoading] = useState(false);
    //const navigate = useNavigate();

    // const passwordVisibility = () => {
    //     setShowPassword(!showPassword);
    // }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Confirm password must be the same as password", {
                autoClose: 1500,
            });
            return;
        }
        if (password.length < 8 || confirmPassword.length < 8) {
            toast.error(
                "Password's length and confirm password is at least 8 character", {
                autoClose: 1500,
            });
            return;
        }
        if (
            username === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            toast.error("Please input all fields", { autoClose: 1500 });
            return;
        }


        try {
            signUpApi(username, password)
                .then((response) => {

                    console.log("Sign Up Successfully", response);
                    setMessage('Registration successful! Please check your email to confirm your account.');
                    toast.success(`Sign Up Successfully`, { autoClose: 1500 });
                    // setTimeout(() => {
                    //     setLoading(true);
                    // }, 2000);
                    // setTimeout(() => {
                    //     navigate("");
                    // }, 5000);
                })
                .catch((error) => {
                    console.error("Sign Up Failed", error);
                    setError('Registration failed.');
                    toast.error("Sign Up Failed.", { autoClose: 1500 });
                });



        } catch (err) {
            console.error("Error fetching user data", err);
            setError('Registration failed. Please try again.');
            toast.error("Error checking username availability", { autoClose: 1500 });
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default Register;
