import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [labs, setLabs] = useState([]);

    // Dynamic API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/api/labs`)
            .then(res => res.json())
            .then(data => setLabs(data))
            .catch(err => console.error('Error fetching labs:', err));
    }, []);

    return (
        <main className="page-content">
            <div className="container">
                <div className="featured-title">Featured Labs</div>

                <div className="cards">
                    {labs.map(lab => (
                        <div
                            key={lab._id}
                            className="card"
                            onClick={() => navigate(`/lab/${lab.type}`)}
                        >
                            <div className="card-inner">{lab.name}</div>
                        </div>
                    ))}
                    {labs.length === 0 && <div style={{ color: '#666', textAlign: 'center', width: '100%', padding: '20px' }}>Loading labs...</div>}
                </div>
            </div>
        </main>
    );
};

export default HomePage;
