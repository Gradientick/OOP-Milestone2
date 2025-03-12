// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebase'; // Import db
import { doc, getDoc } from 'firebase/firestore'; // Import doc, getDoc
import { useNavigate } from 'react-router-dom';

function Home() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null); // Add user state
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { // Make the callback async
            if (currentUser) {
                setUser(currentUser); // Set the user
            } else {
                navigate('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Home Page</h1>
            {user ? (
                <>
                    <p>You are logged in as: {user.email}</p>
                    <button onClick={() => auth.signOut()}>Sign Out</button>
                </>
            ) : null}
        </div>
    );
}

export default Home;