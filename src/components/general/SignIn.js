import React, { useState } from 'react';
import { toast } from "react-toastify";
import { loginApi } from '../../api/UserApi';
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!username) {
            toast.error("The username is required", { autoClose: 1500 });
            return;
        }
        if (!password) {
            toast.error("The password is required", { autoClose: 1500 });
            return;
        }

        loginApi(username, password)
            .then((res) => {
                const accessToken = res?.data?.data;
                console.log(accessToken);
                const decodedAccessToken = jwtDecode(accessToken.jwtToken);
                console.log(decodedAccessToken);
                const username = decodedAccessToken?.username;
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("username", username);

                console.log("Sign In Successfully", res);
                setMessage('Login successfully.');
                toast.success("Login successfully", { autoClose: 1500 });

            })
            .catch((err) => {
                console.error("Login Failed", err);
                setError('Sign In failed.');
                toast.error("Login failed: please check your username and password and try again",
                    { autoClose: 1500 }
                );
            })
    };

    return (


        <div>
            <h2>Login</h2>
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
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default Login;
