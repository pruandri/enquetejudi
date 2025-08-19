import { PVUnique, PVJudiciaire, PVSeparable, PVArchive } from '../models.js';

class PVUniqueRepository {
    /**
     * Récupère tous les PV Uniques
     * @returns {Promise<Array>} Liste de tous les PV Uniques
     */
    async findAll() {
        try {
            return await PVUnique.findAll();
        } catch (error) {
            console.error('Erreur lors de la récupération des PVs:', error);
            throw error;
        }
    }

    /**
     * Vérifie si un numéro de PV existe dans différentes tables
     * @param {string} numero_pv - Numéro de PV à vérifier
     * @returns {Promise<boolean>} True si le PV existe, False sinon
     */
    async verifyPVNumber(numero_pv) {
        try {
            const [pvExist, pvSeparableExist, pvArchiveExist] = await Promise.all([
                PVJudiciaire.findOne({ where: { numero_pv } }),
                PVSeparable.findOne({ where: { numero_pv } }),
                PVArchive.findOne({ where: { numero_pv } })
            ]);

            return !!(pvExist || pvSeparableExist || pvArchiveExist);
        } catch (error) {
            console.error('Erreur lors de la vérification du numéro PV:', error);
            throw error;
        }
    }

    /**
     * Crée un nouveau PV Unique
     * @param {Object} pvData - Données du PV Unique
     * @param {Buffer} [fichierPv] - Fichier PV optionnel
     * @returns {Promise<Object>} PV Unique créé
     */
    async create(pvData, fichierPv = null) {
        try {
            return await PVUnique.create({
                ...pvData,
                fichier_pv: fichierPv
            });
        } catch (error) {
            console.error('Erreur lors de la création du PV Unique:', error);
            throw error;
        }
    }

    /**
     * Récupère un fichier PV par son numéro
     * @param {string} numero_pv - Numéro de PV
     * @returns {Promise<Object|null>} Fichier PV ou null
     */
    async findFileByPVNumber(numero_pv) {
        try {
            const pv = await PVUnique.findByPk(numero_pv);
            return pv && pv.fichier_pv ? pv.fichier_pv : null;
        } catch (error) {
            console.error('Erreur lors de la récupération du fichier PV:', error);
            throw error;
        }
    }

    /**
     * Met à jour un PV Unique
     * @param {string} numero_pv - Numéro de PV à mettre à jour
     * @param {Object} updatedData - Données mises à jour
     * @param {Buffer} [fichierPv] - Nouveau fichier PV optionnel
     * @returns {Promise<Object>} PV Unique mis à jour
     */
    async update(numero_pv, updatedData, fichierPv = null) {
        try {
            const pv = await PVUnique.findOne({ where: { numero_pv } });

            if (!pv) {
                throw new Error('PV Unique non trouvé.');
            }

            return await pv.update({
                ...updatedData,
                fichier_pv: fichierPv || pv.fichier_pv
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du PV Unique:', error);
            throw error;
        }
    }

    /**
     * Supprime un PV Unique
     * @param {string} numero_pv - Numéro de PV à supprimer
     * @returns {Promise<void>}
     */
    async delete(numero_pv) {
        try {
            const pv = await PVUnique.findOne({ where: { numero_pv } });

            if (!pv) {
                throw new Error('PV Unique non trouvé.');
            }

            await pv.destroy();
        } catch (error) {
            console.error('Erreur lors de la suppression du PV Unique:', error);
            throw error;
        }
    }
}

export default new PVUniqueRepository();