import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebase';
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom'; // Import Link

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('employee'); // Default role
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user role in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                role: role,
            });

            console.log("User registered:", user);
            navigate("/"); // Redirect to home page (or login page)

        } catch (error) {
            setError(error.message);
            console.error("Registration error:", error);
        }
    };

    return (
        <div className="register-container"> {/* Added a container class */}
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form"> {/* Added a form classname */}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="role">Role:</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
                        <option value="employee">Employee</option>
                        <option value="hr">HR Personnel</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="btn btn-primary">Register</button>
            </form>

            {/* Login Link */}
            <div className="login-link">
              <p>Already have an account?</p>
              <Link to="/login" className="btn btn-secondary">Login</Link>
            </div>
        </div>
    );
}

export default Register;