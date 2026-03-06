import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProgramCard from '../components/ProgramCard';

const LabPage = () => {
    const { labType } = useParams();
    const [programs, setPrograms] = useState([]);
    const [labInfo, setLabInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        setLoading(true);
        // Fetch lab info and programs in parallel
        Promise.all([
            fetch(`${API_URL}/api/labs`).then(res => res.json()),
            fetch(`${API_URL}/api/programs/${labType}`).then(res => res.json())
        ])
            .then(([labs, programsData]) => {
                const currentLab = labs.find(l => l.type === labType);
                setLabInfo(currentLab);
                setPrograms(programsData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching lab data:', err);
                setLoading(false);
            });
    }, [labType]);

    return (
        <main className="page-content">
            <div className="lab-page">
                <div className="header">{labInfo ? labInfo.name : labType?.toUpperCase()}</div>
                <div className="date">{labInfo?.date ? `on ${labInfo.date}` : ''}</div>
                <div className="red-bar"></div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>Loading programs...</div>
                ) : programs.length > 0 ? (
                    programs.map(prog => (
                        <ProgramCard key={prog._id} number={prog.number} title={prog.title} code={prog.code} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>No programs found for this lab.</div>
                )}
            </div>
        </main>
    );
};

export default LabPage;
