import express from 'express';
import { getQualificationRates } from '../Repository/statistiquesRepository.js'; // Import du repository

const router = express.Router();

router.get('/qualification_rate', async (req, res) => {
    try {
        const { annee, mois } = req.query; // Récupération des paramètres de requête

        console.log(`Requête reçue pour l'année: ${annee}, mois: ${mois}`);

        // Récupération des données via le repository
        const results = await getQualificationRates(annee, mois);

        if (!results || results.length === 0) {
            return res.status(404).json({ message: `Aucune donnée trouvée pour l'année ${annee} et le mois ${mois}` });
        }

        const data = results.map(result => ({
            month: result.dataValues.month,
            year: result.dataValues.year,
            qualification: result.dataValues.qualification,
            count: result.dataValues.count
        }));

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors du chargement des données' });
    }
});

export default router;
