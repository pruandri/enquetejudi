import express from 'express';
import cors from 'cors';
import sequelize from './db.js'; // Import de la connexion à la base de données
import pvUniqueRouters from './Controller/pvUniqueController.js'; // Chemin corrigé
import pvSeparableRouters from './Controller/pvSeparableController.js'; // Chemin corrigé
import pvJudiciaireRouters from './Controller/pvJudiciaireController.js';
import pvArchiveRouter from './Controller/pvArchiveController.js';
import enqueteurRouter from './Controller/enqueteurController.js';  // Chemin correct vers enqueteurRouters.js
import groupeEnqueteurRouter from './Controller/groupeEnqueteurController.js';
import statistiquesRouters from './Controller/statistiquesController.js';  // Assurez-vous que le chemin est correct

const app = express();
app.use(cors());
app.use(express.json());

// Synchronisation des modèles avec la base de données
sequelize.sync()
    .then(() => console.log('Base de données synchronisée'))
    .catch(err => console.error('Erreur de synchronisation', err));

// Utilisation des routes
app.use('/groupe-enqueteur', groupeEnqueteurRouter);
app.use('/api/enqueteurs', enqueteurRouter);
app.use('/pvs-unique', pvUniqueRouters);
app.use('/pvs-separe', pvSeparableRouters);
app.use('/pv_judiciaire', pvJudiciaireRouters);
app.use('/pv_archive', pvArchiveRouter);
app.use('/statistiques', statistiquesRouters);  // Changer le chemin pour les statistiques

// Démarrer le serveur
app.listen(8081, () => {
    console.log('Serveur démarré sur le port 8081');

});
