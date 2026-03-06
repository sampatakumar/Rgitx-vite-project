import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Dynamic API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    // Form states for Lab Management
    const [activeTab, setActiveTab] = useState('program');
    const [progNum, setProgNum] = useState('');
    const [progTitle, setProgTitle] = useState('');
    const [progCode, setProgCode] = useState('');
    const [labType, setLabType] = useState('weblab');
    const [labName, setLabName] = useState('');
    const [labDate, setLabDate] = useState('');
    const [generatedResult, setGeneratedResult] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [copied, setCopied] = useState(false);

    // Management States
    const [managePrograms, setManagePrograms] = useState([]);
    const [manageLoading, setManageLoading] = useState(false);
    const [manageLabType, setManageLabType] = useState('weblab');

    // Dynamic Labs State
    const [availableLabs, setAvailableLabs] = useState([]);
    const [labSlug, setLabSlug] = useState('');

    useEffect(() => {
        fetchAvailableLabs();
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn && activeTab === 'manage') {
            fetchManagePrograms();
        }
    }, [activeTab, manageLabType, isLoggedIn]);

    const fetchAvailableLabs = async () => {
        try {
            const response = await fetch(`${API_URL}/api/labs`);
            const data = await response.json();
            setAvailableLabs(data);
            if (data.length > 0 && !labType) {
                setLabType(data[0].type);
                setManageLabType(data[0].type);
            }
        } catch (err) {
            console.error('Error fetching available labs:', err);
        }
    };

    const fetchManagePrograms = async () => {
        setManageLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/programs/${manageLabType}`);
            const data = await response.json();
            setManagePrograms(data);
        } catch (err) {
            console.error('Fetch management error:', err);
        } finally {
            setManageLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this program?')) return;

        try {
            const response = await fetch(`${API_URL}/api/programs/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setManagePrograms(prev => prev.filter(p => p._id !== id));
            } else {
                alert('Failed to delete program.');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting program.');
        }
    };

    const handleDeleteLab = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Lab?')) return;

        try {
            const response = await fetch(`${API_URL}/api/labs/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                const deletedLab = availableLabs.find(l => l._id === id);
                setAvailableLabs(prev => prev.filter(l => l._id !== id));

                // If the deleted lab was currently selected, reset selections
                if (deletedLab && manageLabType === deletedLab.type) {
                    const remaining = availableLabs.filter(l => l._id !== id);
                    setManageLabType(remaining.length > 0 ? remaining[0].type : '');
                }
                if (deletedLab && labType === deletedLab.type) {
                    const remaining = availableLabs.filter(l => l._id !== id);
                    setLabType(remaining.length > 0 ? remaining[0].type : '');
                }
            } else {
                alert('Failed to delete lab.');
            }
        } catch (err) {
            console.error('Delete lab error:', err);
            alert('Error deleting lab.');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                setIsLoggedIn(true);
                setLoginError('');
            } else {
                setLoginError(data.message || 'Invalid email or password.');
                toast.error('Bakchodi mat kar padayi start kar');
            }
        } catch (err) {
            toast.error('Bakchodi mat kar padayi start kar');
            console.error('Login error:', err);
            setLoginError('Server error. check console.');
        }
    };


    const saveToDatabase = async () => {
        if (!progNum || !progTitle || !progCode || !labType) {
            alert('Please fill in all fields.');
            return;
        }

        setIsSaving(true);
        setSaveStatus('Saving...');

        try {
            const response = await fetch(`${API_URL}/api/programs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    number: progNum,
                    title: progTitle,
                    code: progCode,
                    labType: labType
                })
            });

            if (response.ok) {
                setSaveStatus('Program saved to database successfully! ✓');
                setTimeout(() => setSaveStatus(''), 3000);
                // Clear form
                setProgNum('');
                setProgTitle('');
                setProgCode('');
            } else {
                setSaveStatus('Failed to save to database. ✗');
            }
        } catch (err) {
            console.error('Save error:', err);
            setSaveStatus('Server error. check console. ✗');
        } finally {
            setIsSaving(false);
        }
    };

    const createLabInDB = async () => {
        if (!labName || !labSlug) {
            alert('Please provide Lab Name and URL Slug.');
            return;
        }

        setIsSaving(true);
        setSaveStatus('Creating lab...');

        try {
            const response = await fetch(`${API_URL}/api/labs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: labName,
                    type: labSlug,
                    date: labDate
                })
            });

            if (response.ok) {
                setSaveStatus('Lab category created successfully! ✓');
                fetchAvailableLabs(); // Refresh dropdowns
                setTimeout(() => setSaveStatus(''), 3000);
                setLabName('');
                setLabSlug('');
                setLabDate('');
            } else {
                setSaveStatus('Failed to create lab. ✗');
            }
        } catch (err) {
            console.error('Lab creation error:', err);
            setSaveStatus('Server error. ✗');
        } finally {
            setIsSaving(false);
        }
    };

    const generateSnippetOnly = () => {
        const num = progNum || 'X';
        const title = progTitle || 'Untitled Program';
        const snippet = `<!-- ================= PROGRAM ${num} ================= -->
<div class="program">
    <h2>PROGRAM ${num}</h2>
    <h3>${title}</h3>

    <textarea id="code${num}">
${progCode}
    </textarea><br>

    <button class="copy-btn" onclick="copyText('code${num}', this)">Copy</button>
</div>
<hr>`;
        setGeneratedResult(snippet);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isLoggedIn) {
        return (
            <main className="page-content">
                <div className="upload-container" style={{ maxWidth: '400px', marginTop: '50px' }}>
                    <div className="header">Admin Login</div>
                    <form className="upload-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Don't even look at it"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Don't even try it"
                                required
                            />
                        </div>
                        {loginError && <div style={{ color: '#ef4444', marginBottom: '10px', textAlign: 'center' }}>{loginError}</div>}
                        <button type="submit" className="generate-btn">Login</button>
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="page-content">
            <ToastContainer
  position="top-center"
  autoClose={4000}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
  toastStyle={{
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "14px",
    color: "#fff",
    padding: "14px",
    boxShadow: "0 10px 35px rgba(0,0,0,0.35)"
  }}
  progressStyle={{
    background: "linear-gradient(90deg,#00f5ff,#7c3aed)"
  }}
/>
            <div className="upload-container">
                <div className="header">Lab Management Console</div>

                <div className="upload-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'program' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('program'); setGeneratedResult(''); }}
                    >
                        Add Program
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('manage'); setGeneratedResult(''); }}
                    >
                        Manage Programs
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'lab' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('lab'); setGeneratedResult(''); }}
                    >
                        Manage Labs
                    </button>
                    <button
                        className="tab-btn"
                        style={{ marginLeft: 'auto', background: 'rgba(239, 68, 68, 0.2)' }}
                        onClick={() => setIsLoggedIn(false)}
                    >
                        Logout
                    </button>
                </div>

                {activeTab === 'program' && (
                    <div className="upload-form">
                        <div className="form-group">
                            <label>Lab Type</label>
                            <select value={labType} onChange={(e) => setLabType(e.target.value)} style={{ background: '#000', color: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #333' }}>
                                {availableLabs.map(lab => (
                                    <option key={lab._id} value={lab.type}>{lab.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Program Number</label>
                            <input type="text" value={progNum} onChange={(e) => setProgNum(e.target.value)} placeholder="11" />
                        </div>
                        <div className="form-group">
                            <label>Program Title</label>
                            <input type="text" value={progTitle} onChange={(e) => setProgTitle(e.target.value)} placeholder="Advanced Layout" />
                        </div>
                        <div className="form-group">
                            <label>Source Code</label>
                            <textarea value={progCode} onChange={(e) => setProgCode(e.target.value)} placeholder="Paste code here..." style={{ height: '200px' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="generate-btn" style={{ flex: 1 }} onClick={saveToDatabase} disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save to Database'}
                            </button>
                            <button className="generate-btn" style={{ flex: 1, background: '#4b5563' }} onClick={generateSnippetOnly}>
                                Preview Snippet
                            </button>
                        </div>
                        {saveStatus && <div style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', color: saveStatus.includes('successfully') ? '#10b981' : '#ef4444' }}>{saveStatus}</div>}
                    </div>
                )}

                {activeTab === 'manage' && (
                    <div className="upload-form">
                        <div className="form-group">
                            <label>Filter by Lab Type</label>
                            <select value={manageLabType} onChange={(e) => setManageLabType(e.target.value)} style={{ background: '#000', color: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #333' }}>
                                {availableLabs.map(lab => (
                                    <option key={lab._id} value={lab.type}>{lab.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="manage-list" style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                            {manageLoading ? (
                                <div style={{ textAlign: 'center' }}>Loading...</div>
                            ) : managePrograms.length > 0 ? (
                                managePrograms.map(prog => (
                                    <div key={prog._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '10px', border: '1px solid #222' }}>
                                        <div>
                                            <span style={{ color: '#ef4444', fontWeight: 'bold', marginRight: '10px' }}>#{prog.number}</span>
                                            <span style={{ color: '#fff' }}>{prog.title}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(prog._id)}
                                            style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#666' }}>No programs found for this lab.</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'lab' && (
                    <div className="upload-form">
                        <div style={{ marginBottom: '30px' }}>
                            <div className="form-group">
                                <label>Lab Name</label>
                                <input type="text" value={labName} onChange={(e) => setLabName(e.target.value)} placeholder="Computer Graphics Lab" />
                            </div>
                            <div className="form-group">
                                <label>URL Slug (Type)</label>
                                <input type="text" value={labSlug} onChange={(e) => setLabSlug(e.target.value)} placeholder="cg" />
                            </div>
                            <div className="form-group">
                                <label>Date (Optional)</label>
                                <input type="text" value={labDate} onChange={(e) => setLabDate(e.target.value)} placeholder="March 07, 2025" />
                            </div>
                            <button className="generate-btn" onClick={createLabInDB} disabled={isSaving}>
                                {isSaving ? 'Creating...' : 'Create Lab Category'}
                            </button>
                            {saveStatus && <div style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold', color: saveStatus.includes('successfully') ? '#10b981' : '#ef4444' }}>{saveStatus}</div>}
                        </div>

                        <div className="manage-list" style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
                            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Existing Labs</h3>
                            {availableLabs.length > 0 ? (
                                availableLabs.map(lab => (
                                    <div key={lab._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '10px', border: '1px solid #222' }}>
                                        <div>
                                            <span style={{ color: '#fff', fontWeight: 'bold' }}>{lab.name}</span>
                                            <span style={{ color: '#888', marginLeft: '10px', fontSize: '0.85rem' }}>/{lab.type}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteLab(lab._id)}
                                            style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', color: '#666' }}>No labs available.</div>
                            )}
                        </div>
                    </div>
                )}

                {generatedResult && (
                    <div className="output-area">
                        <div className="output-header">
                            <div className="featured-title" style={{ marginBottom: 0 }}>Generated Result Preview</div>
                            <button
                                className={`copy-btn ${copied ? 'copied' : ''}`}
                                onClick={handleCopy}
                            >
                                {copied ? 'Copied! ✓' : 'Copy to Clipboard'}
                            </button>
                        </div>
                        <textarea readOnly value={generatedResult} style={{ height: '300px' }} />
                    </div>
                )}
            </div>
        </main>
    );
};

export default Admin;