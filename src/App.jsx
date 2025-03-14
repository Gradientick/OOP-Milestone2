// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, BrowserRouter } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Navbar from './components/navbar';
import Home from './pages/Home';
import './styles.css';
import AdminRegister from './components/AdminRegister';
import { auth } from './firebase'; // Import your Firebase auth
import { onAuthStateChanged } from 'firebase/auth';

function App() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const idTokenResult = await currentUser.getIdTokenResult();
                    setIsAdmin(!!idTokenResult.claims.admin);
                } catch (error) {
                    console.error("Error getting ID token:", error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false); // Set loading to false after auth check
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or a more elaborate loading spinner
    }


    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
                <Route path="/" element={<Home />} />

                <Route
                    path="/register-employee"
                    // element={isAdmin ? <AdminRegister /> : <Navigate to="/" />}
                    element={<AdminRegister/> }/>
                {/* Add more routes as needed */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;