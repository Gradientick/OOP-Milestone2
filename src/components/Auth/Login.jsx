// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom'; // Import Link

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // User is signed in.
            console.log("User logged in:", userCredential.user);
            navigate("/"); // Redirect to home page (or role-specific dashboard)
        } catch (error) {
            setError(error.message);
            console.error("Login error:", error);
        }
    };

    return (
        <div className="login-container"> {/* Added a container class */}
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form"> {/* Added a form class */}
                <div className="form-group"> {/* Added a form-group class */}
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control" /* Added a form-control class */
                    />
                </div>
                <div className="form-group"> {/* Added a form-group class */}
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control" /* Added a form-control class */
                    />
                </div>
                {error && <p className="error-message">{error}</p>} {/* Used the error-message class */}
                <button type="submit" className="btn btn-primary">Login</button> {/* Added btn classes */}
            </form>

            {/* Register Button with Link */}
            <div className="register-link">
                <p>Don't have an account?</p>
                <Link to="/register" className="btn btn-secondary">Register</Link> {/* Added btn classes */}
            </div>
        </div>
    );
}

export default Login;