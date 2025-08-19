// Rout.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Views/Home';
import Enqueteur from './components/Enqueteur';
import LoginGroupeEnqueteur from './Views/LoginGroupeEnqueteur';
import Dashboard from './Views/Dashboard';
import Archives from './components/Archives';
import Unique from './components/Unique';
import Separe from './components/Separe';
import Judiciaire from './components/Judiciaire';
import HistogramPage from './components/Histogram';
import PrivateRoute from './services/PrivateRoute';  // Importer le composant PrivateRoute

const Rout = () => {
    return (
        <Routes>
            {/* Route pour la page de connexion */}
            <Route path="/" element={<LoginGroupeEnqueteur />} />

            {/* Route pour le Dashboard avec des sous-routes protégées */}
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />}>
                    <Route path="home" element={<Home />} />
                    <Route path="enqueteurs" element={<Enqueteur />} />
                    <Route path="unique" element={<Unique />} />
                    <Route path="judiciaire" element={<Judiciaire />} />
                    <Route path="separe" element={<Separe />} />
                    <Route path="archives" element={<Archives />} />
                    <Route path="histogram" element={<HistogramPage />} />
            </Route>

        </Routes>
    );
};

export default Rout;
