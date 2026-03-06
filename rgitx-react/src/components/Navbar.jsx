import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Dynamic API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const toggleMenu = () => setIsOpen(!isOpen);
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
            e.target.value = '';
            setIsOpen(false);
        }
    };

    return (
        <header className="navbar">
            <h1 className="logo" onClick={() => navigate('/')}>RGITX</h1>

            <nav className={`nav-links ${isOpen ? 'active' : ''}`} id="navLinks">
                <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>

                <div className="search-container" style={{ display: 'inline-block', marginLeft: '20px' }}>
                    <input
                        type="text"
                        placeholder="Search programs..."
                        onKeyDown={handleSearchKeyDown}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid #333',
                            color: '#fff',
                            padding: '5px 12px',
                            borderRadius: '20px',
                            outline: 'none',
                            fontSize: '0.9rem',
                            width: '180px'
                        }}
                    />
                </div>
                <NavLink to="/admin" onClick={() => setIsOpen(false)}>Admin</NavLink>
            </nav>

            <div className="hamburger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </header>
    );
};

export default Navbar;
