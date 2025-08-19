import express from 'express';
import EnqueteurRepository from '../Repository/enqueteurRepository.js';

const router = express.Router();

// Route pour obtenir tous les enquêteurs
router.get('/', async (req, res) => {
    try {
        const enqueteurs = await EnqueteurRepository.findAll();
        res.status(200).json(enqueteurs);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des enquêteurs.', error: error.message });
    }
});

// Route pour vérifier si le numéro PV existe
router.get('/verifier/:numero_pv', async (req, res) => {
    const { numero_pv } = req.params;
    try {
        const pvExists = await EnqueteurRepository.verifyPVNumber(numero_pv);
        return res.status(pvExists ? 200 : 404).json({ exists: !!pvExists });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification du numéro PV', error: error.message });
    }
});

// AJOUTER un nouvel enquêteur
router.post('/ajouter', async (req, res) => {
    try {
        const nouvelEnqueteur = await EnqueteurRepository.create(req.body);
        res.status(201).json(nouvelEnqueteur);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ 
            message: "Erreur lors de l'ajout de l'enquêteur", 
            error: error.message 
        });
    }
});

// MODIFIER un enquêteur
router.put('/modifier/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const enqueteur = await EnqueteurRepository.update(id, req.body);
        res.status(200).json(enqueteur);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ 
            message: "Erreur lors de la modification de l'enquêteur", 
            error: error.message 
        });
    }
});

// LIRE tous les enquêteurs
router.get('/lire', async (req, res) => {
    try {
        const enqueteurs = await EnqueteurRepository.findAll();
        res.status(200).json(enqueteurs);
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la récupération des enquêteurs", 
            error: error.message 
        });
    }
});

// LIRE un enquêteur spécifique
router.get('/lire/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const enqueteur = await EnqueteurRepository.findById(id);
        res.status(200).json(enqueteur);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ 
            message: "Erreur lors de la récupération de l'enquêteur", 
            error: error.message 
        });
    }
});

// SUPPRIMER un enquêteur
router.delete('/supprimer/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await EnqueteurRepository.delete(id);
        res.status(200).json(result);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ 
            message: "Erreur lors de la suppression de l'enquêteur", 
            error: error.message 
        });
    }
});

export default router;