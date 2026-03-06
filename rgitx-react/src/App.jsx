import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LabPage from './pages/LabPage';
import Admin from './pages/AdminPage';
import SearchPage from './pages/SearchPage';
import './index.css';

function App() {

  return (
    <>
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
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lab/:labType" element={<LabPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </>
  );
}

export default App;
