import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    // Dynamic API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Get search query from URL: /search?q=something
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        if (query) {
            fetchResults();
        } else {
            setResults([]);
        }
    }, [query]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/programs/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error('Search fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const copyText = (id, btn) => {
        const textarea = document.getElementById(id);
        textarea.select();
        navigator.clipboard.writeText(textarea.value);
        btn.innerText = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerText = 'Copy';
            btn.classList.remove('copied');
        }, 2000);
    };

    return (
        <main className="page-content">
            <div className="lab-page">
                <div className="header">Search Results</div>
                <div className="date">{query ? `Results for "${query}"` : 'Enter a search term above'}</div>
                <div className="red-bar"></div>

                <div className="programs-container">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Searching...</div>
                    ) : results.length > 0 ? (
                        results.map((prog) => (
                            <div key={prog._id} className="program">
                                <h2>PROGRAM {prog.number}</h2>
                                <h3>{prog.title} <span style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '10px' }}>({prog.labType === 'weblab' ? 'Web Lab' : 'ML Lab'})</span></h3>
                                <textarea id={`code${prog._id}`} defaultValue={prog.code} readOnly></textarea>
                                <br />
                                <button className="copy-btn" onClick={(e) => copyText(`code${prog._id}`, e.target)}>Copy</button>
                            </div>
                        ))
                    ) : query && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>No programs found matching your search.</div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default SearchPage;
