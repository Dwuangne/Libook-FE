// import React, { useState } from 'react';
// import { toast } from "react-toastify";
// import { loginApi } from '../../api/UserApi';
// import { jwtDecode } from "jwt-decode";
// import axios from 'axios';

// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         try {
//             const response = await axios.post('https://localhost:7158/api/Auth/Login', { username, password });

//             if (!response.data.isEmailConfirmed) {
//                 setError('Please confirm your email before logging in.');
//                 return;
//             }

//             localStorage.setItem('token', response.data.token);
//             alert('Login successful');
//             // Redirect hoặc làm gì đó sau khi đăng nhập thành công
//         } catch (err) {
//             setError('Invalid credentials or email not confirmed');
//         }
//     };

//     return (
//         <div>
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Username</label>
//                     <input
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Password</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Login</button>
//             </form>
//             {error && <p>{error}</p>}
//         </div>
//     );
// };

// export default Login;
