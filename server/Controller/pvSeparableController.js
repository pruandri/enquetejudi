import express from 'express';
import multer from 'multer';
import pvSeparableRepository from '../Repository/pvSeparableRepository.js';
import mime from 'mime-types';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// GET: Récupérer tous les PVs Séparés
router.get('/', async (req, res) => {
    try {
        const pvs = await pvSeparableRepository.findAll();
        res.json(pvs);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors du chargement des PVs Séparés' });
    }
});

// Route pour vérifier si le numéro PV existe
router.get('/verifierSepare/:numero_pv', async (req, res) => {
    const { numero_pv } = req.params;
    try {
        const pvExists = await pvSeparableRepository.checkPVExists(numero_pv);
        
        if (pvExists) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(404).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification du numéro PV' });
    }
});

// POST: Ajouter un nouveau PV Séparé
router.post('/', upload.single('fichier_pv'), async (req, res) => {
    try {
        const pvData = {
            numero_pv: req.body.numero_pv,
            numero_ttr: req.body.numero_ttr,
            nombre_piece: req.body.nombre_piece,
            nombre_feuillet: req.body.nombre_feuillet,
            date_pv: req.body.date_pv,
            date_ttr: req.body.date_ttr,
            nature_infraction: req.body.nature_infraction,
            qualification: req.body.qualification,
            nom_personne_soupconne: req.body.nom_personne_soupconne,
            nom_victime: req.body.nom_victime,
            lieu_infraction: req.body.lieu_infraction,
            date_infraction: req.body.date_infraction,
            fichier_pv: req.file ? req.file.buffer : null
        };

        const pv = await pvSeparableRepository.create(pvData);
        res.json(pv);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du PV Séparé' });
    }
});

// Route pour récupérer le fichier d'un PV Séparé
router.get('/fichier/:numero_pv', async (req, res) => {
    try {
        const fichier_pv = await pvSeparableRepository.getFile(req.params.numero_pv);

        if (fichier_pv) {
            const mimeType = mime.lookup(fichier_pv.name) || 'application/pdf';
            res.set('Content-Type', mimeType);
            res.set('Content-Disposition', 'inline');
            res.send(fichier_pv);
        } else {
            res.status(404).send('Fichier non trouvé');
        }
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération du fichier');
    }
});

// PUT: Mettre à jour un PV Séparé existant
router.put('/:numero_pv', upload.single('fichier_pv'), async (req, res) => {
    try {
        const { numero_pv } = req.params;
        const updateData = {
            numero_ttr: req.body.numero_ttr,
            nombre_piece: req.body.nombre_piece,
            nombre_feuillet: req.body.nombre_feuillet,
            date_pv: req.body.date_pv,
            date_ttr: req.body.date_ttr,
            nature_infraction: req.body.nature_infraction,
            qualification: req.body.qualification,
            nom_personne_soupconne: req.body.nom_personne_soupconne,
            nom_victime: req.body.nom_victime,
            lieu_infraction: req.body.lieu_infraction,
            date_infraction: req.body.date_infraction,
            fichier_pv: req.file ? req.file.buffer : undefined
        };

        const pv = await pvSeparableRepository.update(numero_pv, updateData);
        res.json(pv);
    } catch (error) {
        if (error.message === 'PV Séparé non trouvé.') {
            return res.status(404).json({ error: 'PV Séparé non trouvé.' });
        }
        res.status(500).json({ error: 'Erreur lors de la mise à jour du PV Séparé.' });
    }
});

// DELETE: Supprimer un PV Séparé
router.delete('/:numero_pv', async (req, res) => {
    try {
        const { numero_pv } = req.params;
        await pvSeparableRepository.delete(numero_pv);
        res.json({ message: 'PV Séparé supprimé avec succès.' });
    } catch (error) {
        if (error.message === 'PV Séparé non trouvé.') {
            return res.status(404).json({ error: 'PV Séparé non trouvé.' });
        }
        res.status(500).json({ error: 'Erreur lors de la suppression du PV Séparé.' });
    }
});

export default router;