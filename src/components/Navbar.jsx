// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Navbar() {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            let isMounted = true; // Prevent state updates after unmount
            try {
                if (currentUser) {
                    setUser(currentUser);
                    const userDocRef = doc(db, "users", currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists() && isMounted) {
                        setUserRole(userDocSnap.data().role);
                    } else if (isMounted) {
                        setUserRole('unknown');
                    }
                } else {
                    setUser(null);
                    setUserRole(null);
                }
            } catch (error) {
                console.error("Error fetching user role in Navbar:", error);
                // Consider setting an error state here for more robust error handling
                if (isMounted) {
                  setUserRole('error'); // Indicate an error
                }

            } finally {
              if (isMounted){
                setLoading(false);
              }
            }
            return () => {
              unsubscribe();
              isMounted = false;}
        });


    }, []);

    if (loading) {
        return <nav className="navbar">Loading...</nav>;  // Minimal loading state
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    MotorPh Payroll
                </Link>
                <ul className="nav-menu">
                    {!user && (
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-links">
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-links">
                                    Register
                                </Link>
                            </li>
                        </>
                    )}

                    {user && (
                        <>
                            <li className="nav-item">
                                <Link to="/" className="nav-links">
                                    Home
                                </Link>
                            </li>
                            {/* Role-Based Links */}
                            {userRole === 'admin' && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-links"> {/* Example admin link */}
                                        Admin
                                    </Link>
                                </li>
                            )}
                            {userRole === 'admin' && (
                                <li className="nav-item">
                                    <Link to="/register-employee" className="nav-links">
                                        Register Employee
                                    </Link>
                                </li>
                            )}
                            {userRole === 'hr' && (
                                <li className="nav-item">
                                    <Link to="/hr" className="nav-links"> {/* Example HR link */}
                                        HR
                                    </Link>
                                </li>
                            )}
                             {/* Add more role-based links as needed */}
                            <li className="nav-item">
                                <button onClick={() => auth.signOut()} className="nav-links-signout">
                                    Sign Out
                                </button>
                            </li>

                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;