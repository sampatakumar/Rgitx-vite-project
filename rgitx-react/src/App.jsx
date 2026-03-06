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
  );
}

export default App;
