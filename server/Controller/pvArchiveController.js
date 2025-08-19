import express from 'express';
import multer from 'multer';
import PVArchiveRepository from '../Repository/pvArchiveRepository.js';


// Configurez le stockage pour multer (en mémoire ou sur disque)
const storage = multer.memoryStorage(); // ou utilisez diskStorage si vous souhaitez stocker sur le disque
const upload = multer({ storage });
const mime = await import('mime-types');
const router = express.Router();

// Route pour obtenir tous les PV Archive
router.get('/', async (req, res) => {
    try {
        const archives = await PVArchiveRepository.findAll();
        res.status(200).json(archives);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des archives.' });
    }
});

// Route pour vérifier si le numéro PV existe
router.get('/verifier/:numero_pv', async (req, res) => {
    const { numero_pv } = req.params;
    try {
        const pvExist = await PVArchiveRepository.verifyPVNumero(numero_pv);
        res.status(pvExist ? 200 : 404).json({ exists: !!pvExist });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la vérification du numéro PV' });
    }
});

// Route pour récupérer le fichier d'un PV Judiciaire spécifique
router.get('/fichier/:numero_pv', async (req, res) => {
    try {
        const pv = await PVArchiveRepository.findFilePV(req.params.numero_pv);
        if (pv && pv.fichier_pv) {
            const mimeType = mime.lookup(pv.fichier_pv) || 'application/pdf'; // Utilisation de mime-types pour trouver le type MIME
            res.set('Content-Type', mimeType);
            res.set('Content-Disposition', 'inline');
            res.send(pv.fichier_pv);
        } else {
            res.status(404).json({ error: 'Fichier non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du fichier' });
    }
});

// Route pour créer un nouveau PV Archive
router.post('/', upload.single('fichier_pv'), async (req, res) => {
    const { numero_pv, date_pv, nature_infraction, auteur_infraction, qualification, decision } = req.body;
    const fichier_pv = req.file ? req.file.buffer : null;

    try {
        const newArchive = await PVArchiveRepository.create({
            numero_pv,
            date_pv,
            nature_infraction,
            auteur_infraction,
            qualification,
            decision,
            fichier_pv
        });
        res.status(201).json(newArchive);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'archive.' });
    }
});

// Route pour obtenir un PV Archive par numéro
router.get('/:numero_pv', async (req, res) => {
    const { numero_pv } = req.params;
    try {
        const archive = await PVArchiveRepository.findByNumero(numero_pv);
        if (archive) {
            res.status(200).json(archive);
        } else {
            res.status(404).json({ message: 'Archive non trouvée.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'archive.' });
    }
});

// Route pour mettre à jour un PV Archive
router.put('/:numero_pv', upload.single('fichier_pv'), async (req, res) => {
    const { numero_pv } = req.params;
    const { date_pv, nature_infraction, auteur_infraction, qualification, decision } = req.body;
    const fichier_pv = req.file ? req.file.buffer : null;

    try {
        const archive = await PVArchiveRepository.update(numero_pv, {
            date_pv,
            nature_infraction,
            auteur_infraction,
            qualification,
            decision,
            fichier_pv
        });

        if (archive) {
            res.status(200).json(archive);
        } else {
            res.status(404).json({ message: 'Archive non trouvée.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'archive.' });
    }
});

// Route pour supprimer un PV Archive
router.delete('/:numero_pv', async (req, res) => {
    const { numero_pv } = req.params;

    try {
        const deleted = await PVArchiveRepository.delete(numero_pv);
        if (deleted) {
            res.status(204).send();  // 204 No Content
        } else {
            res.status(404).json({ message: 'Archive non trouvée.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'archive.' });
    }
});

// Route pour obtenir les statistiques de PV Archive
router.get('/pv_archive/statistiques', async (req, res) => {
    const { annee } = req.query;

    try {
        const resultats = await PVArchiveRepository.getStatistiquesByAnnee(annee);
        res.json(resultats);
    } catch (error) {
        if (error.message === "L'année doit être un nombre valide.") {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques.' });
    }
});

// Route pour télécharger un PV
router.get('/pv_archive/download/:numero_pv', async (req, res) => {
    try {
        const fileInfo = await PVArchiveRepository.downloadPV(req.params.numero_pv);
        if (!fileInfo) {
            return res.status(404).send('Fichier non trouvé');
        }

        res.download(fileInfo.filePath, fileInfo.fileName);
    } catch (error) {
        res.status(500).send('Erreur lors du téléchargement du fichier');
    }
});

export default router;