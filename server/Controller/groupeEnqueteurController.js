import express from 'express';
import GroupeEnqueteurRepository from '../Repository/groupeEnqueteurRepository.js';

const router = express.Router();

// Route pour récupérer tous les groupes d'enquêteurs
router.get('/', async (req, res) => {
    try {
        const groupes = await GroupeEnqueteurRepository.findAll();
        res.status(200).json(groupes);
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la récupération des groupes d\'enquêteurs', 
            error: error.message 
        });
    }
});

// Route pour authentifier un groupe d'enquêteur
router.post('/login', async (req, res) => {
    try {
        const { matricule, numero_groupe, grade, email, motdepasse } = req.body;

        // Vérification de l'existence d'un groupe avec les informations fournies
        const groupe = await GroupeEnqueteurRepository.authenticate({
            matricule,
            numero_groupe,
            grade,
            email,
            motdepasse
        });

        if (groupe) {
            res.status(200).json({ message: 'Connexion réussie', groupe });
        } else {
            res.status(404).json({ message: 'Identifiants incorrects. Veuillez réessayer.' });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Erreur lors de la vérification des identifiants', 
            error: error.message 
        });
    }
});

export default router;