import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext'; // Assurez-vous du chemin correct
import Rout from './Rout'; // Importation du fichier Rout.js

const App = () => {
    return (
        <AuthProvider> {/* Fournisseur du contexte */}
            <Router>
                <Rout /> {/* Ajout de la gestion des routes depuis Rout.js */}
            </Router>
        </AuthProvider>
    );
};

export default App;


/*<Route path="/home" element={<Home />} /> {/* Route pour la page Home */
/*<Route path="/nav" element={<Nav />} /> {/* Route pour la page Home */