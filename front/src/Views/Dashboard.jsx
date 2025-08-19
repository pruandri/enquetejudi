// Dashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // Importer Outlet pour les sous-routes
import Nav from './Nav'; // Assurez-vous d'importer votre composant Nav


const Dashboard = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Nav />
            <div style={{ marginLeft: '200px', padding: '20px', flex: 1 }}> {/* Espace pour le contenu */}
                <Outlet /> {/* C'est ici que le contenu des sous-routes sera rendu */}
            </div>
        </div>
    );
};

export default Dashboard;
