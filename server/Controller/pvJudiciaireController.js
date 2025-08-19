import express from 'express';
import multer from 'multer';
import { Buffer } from 'buffer';
import pvJudiciaireRepository from '../Repository/pvJudiciaireRepository.js';

// Configuration de multer pour gérer le téléchargement de fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const mime = await import('mime-types');

// Route pour récupérer tous les PV
router.get('/', async (req, res) => {
    try {
        const pvJudiciaires = await pvJudiciaireRepository.findAll();
        res.status(200).json(pvJudiciaires);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des PV' });
    }
});

// Route pour vérifier si le numéro PV existe
router.get('/verifierJudiciaire/:numero_pv', async (req, res) => {
    const { numero_pv } = req.params;
    try {
        const pvExists = await pvJudiciaireRepository.verifyPVNumber(numero_pv);
        
        if (pvExists) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(404).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification du numéro PV' });
    }
});

// Route pour ajouter un PV
router.post('/', upload.single('fichier_pv'), async (req, res) => {
    try {
        const {
            numero_pv,
            date_pv,
            motif_inculpation,
            qualification,
            type_mandat,
            personne_concerne,
            lieu_infraction,
            date_infraction
        } = req.body;
        
        const fichier_pv = req.file ? Buffer.from(req.file.buffer) : null;

        const pvJudiciaire = await pvJudiciaireRepository.create({
            numero_pv,
            date_pv,
            motif_inculpation,
            qualification,
            type_mandat,
            personne_concerne,
            lieu_infraction,
            date_infraction,
            fichier_pv
        });

        res.status(201).json(pvJudiciaire);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du PV' });
    }
});

// Route pour récupérer le fichier d'un PV Judiciaire spécifique
router.get('/fichier/:numero_pv', async (req, res) => {
    try {
        const fichier_pv = await pvJudiciaireRepository.findFileByNumero(req.params.numero_pv);
        
        if (fichier_pv) {
            // On utilise ici 'application/pdf' comme type MIME par défaut
            const mimeType = 'application/pdf';
            res.set('Content-Type', mimeType);
            res.set('Content-Disposition', 'inline');  // Affichage direct dans le navigateur
            res.send(fichier_pv); // Envoi du contenu du fichier
        } else {
            // Fichier non trouvé
            res.status(404).json({ error: 'Fichier non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
    }
});

// Route pour récupérer un PV par ID
router.get('/:numero_pv', async (req, res) => {
    try {
        const { numero_pv } = req.params;
        const pvJudiciaire = await pvJudiciaireRepository.findByNumero(numero_pv);

        if (!pvJudiciaire) {
            return res.status(404).json({ error: 'PV non trouvé' });
        }

        res.status(200).json(pvJudiciaire);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du PV' });
    }
});

// Route pour mettre à jour un PV par ID
router.put('/:numero_pv', upload.single('fichier_pv'), async (req, res) => {
    try {
        const { numero_pv } = req.params;
        const {
            date_pv,
            motif_inculpation,
            qualification,
            type_mandat,
            personne_concerne,
            lieu_infraction,
            date_infraction
        } = req.body;

        const fichier_pv = req.file ? Buffer.from(req.file.buffer) : null;

        const updatedPV = await pvJudiciaireRepository.update(numero_pv, {
            date_pv,
            motif_inculpation,
            qualification,
            type_mandat,
            personne_concerne,
            lieu_infraction,
            date_infraction,
            fichier_pv
        });

        if (!updatedPV) {
            return res.status(404).json({ error: 'PV non trouvé' });
        }

        res.status(200).json(updatedPV);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du PV' });
    }
});

// Route pour supprimer un PV par ID
router.delete('/:numero_pv', async (req, res) => {
    try {
        const { numero_pv } = req.params;
        const deleted = await pvJudiciaireRepository.delete(numero_pv);

        if (!deleted) {
            return res.status(404).json({ error: 'PV non trouvé' });
        }

        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du PV' });
    }
});

export default router;