import express from 'express';
import multer from 'multer';
import pvUniqueRepository from '../Repository/pvUniqueRepository.js';
const mime = await import('mime-types');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route pour récupérer tous les PV Uniques
router.get('/', async (req, res) => {
    try {
        const pvs = await pvUniqueRepository.findAll();
        res.json(pvs);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du chargement des PVs' });
    }
});

// Route pour vérifier si le numéro PV existe
router.get('/verifierUnique/:numero_pv', async (req, res) => {
    const { numero_pv } = req.params;
    try {
        const exists = await pvUniqueRepository.verifyPVNumber(numero_pv);
        
        if (exists) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(404).json({ exists: false });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du numéro PV:', error);
        res.status(500).json({ message: 'Erreur lors de la vérification du numéro PV' });
    }
});

// Route pour créer un nouveau PV Unique
router.post('/', upload.single('fichier_pv'), async (req, res) => {
    try {
        const pvData = {
            numero_pv: req.body.numero_pv,
            numero_ttr: req.body.numero_ttr,
            date_pv: req.body.date_pv,
            date_ttr: req.body.date_ttr,
            nature_infraction: req.body.nature_infraction,
            qualification: req.body.qualification,
            nom_personne_soupconne: req.body.nom_personne_soupconne,
            nom_victime: req.body.nom_victime,
            lieu_infraction: req.body.lieu_infraction,
            date_infraction: req.body.date_infraction,
        };

        const pv = await pvUniqueRepository.create(pvData, req.file ? req.file.buffer : null);
        res.json(pv);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du PV Unique' });
    }
});

// Route pour récupérer le fichier d'un PV Unique spécifique
router.get('/fichier/:numero_pv', async (req, res) => {
    try {
        const fichierPv = await pvUniqueRepository.findFileByPVNumber(req.params.numero_pv);
        
        if (fichierPv) {
            const mimeType = mime.lookup(fichierPv.name) || 'application/pdf';
            res.set('Content-Type', mimeType);
            res.set('Content-Disposition', 'inline');
            res.send(fichierPv);
        } else {
            res.status(404).send('Fichier non trouvé');
        }
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération du fichier');
    }
});

// Route pour mettre à jour un PV Unique spécifique
router.put('/:numero_pv', upload.single('fichier_pv'), async (req, res) => {
    try {
        const { numero_pv } = req.params;
        const updatedData = {
            numero_ttr: req.body.numero_ttr,
            date_pv: req.body.date_pv,
            date_ttr: req.body.date_ttr,
            nature_infraction: req.body.nature_infraction,
            qualification: req.body.qualification,
            nom_personne_soupconne: req.body.nom_personne_soupconne,
            nom_victime: req.body.nom_victime,
            lieu_infraction: req.body.lieu_infraction,
            date_infraction: req.body.date_infraction,
        };

        const pv = await pvUniqueRepository.update(numero_pv, updatedData, req.file ? req.file.buffer : null);
        res.json(pv);
    } catch (error) {
        if (error.message === 'PV Unique non trouvé.') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erreur lors de la mise à jour du PV Unique.' });
    }
});

// Route pour supprimer un PV Unique spécifique
router.delete('/:numero_pv', async (req, res) => {
    try {
        const { numero_pv } = req.params;
        await pvUniqueRepository.delete(numero_pv);
        res.json({ message: 'PV Unique supprimé avec succès.' });
    } catch (error) {
        if (error.message === 'PV Unique non trouvé.') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erreur lors de la suppression du PV Unique.' });
    }
});

export default router;