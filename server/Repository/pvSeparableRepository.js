import { PVSeparable, PVJudiciaire, PVUnique, PVArchive } from '../models.js';

class PVSeparableRepository {
    // Récupérer tous les PVs Séparés
    async findAll() {
        try {
            return await PVSeparable.findAll();
        } catch (error) {
            console.error('Erreur lors du chargement des PVs Séparés:', error);
            throw error;
        }
    }

    // Vérifier si le numéro PV existe
    async checkPVExists(numero_pv) {
        try {
            const [pvExist, pvUniqueExist, pvArchiveExist] = await Promise.all([
                PVJudiciaire.findOne({ where: { numero_pv } }),
                PVUnique.findOne({ where: { numero_pv } }),
                PVArchive.findOne({ where: { numero_pv } })
            ]);

            return pvExist || pvUniqueExist || pvArchiveExist;
        } catch (error) {
            console.error('Erreur lors de la vérification du numéro PV:', error);
            throw error;
        }
    }

    // Créer un nouveau PV Séparé
    async create(pvData) {
        try {
            return await PVSeparable.create(pvData);
        } catch (error) {
            console.error('Erreur lors de la création du PV Séparé:', error);
            throw error;
        }
    }

    // Récupérer un PV Séparé par son numéro
    async findByNumero(numero_pv) {
        try {
            return await PVSeparable.findOne({ where: { numero_pv } });
        } catch (error) {
            console.error('Erreur lors de la recherche du PV Séparé:', error);
            throw error;
        }
    }

    // Mettre à jour un PV Séparé
    async update(numero_pv, updateData) {
        try {
            const pv = await this.findByNumero(numero_pv);
            
            if (!pv) {
                throw new Error('PV Séparé non trouvé.');
            }

            return await pv.update(updateData);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du PV Séparé:', error);
            throw error;
        }
    }

    // Supprimer un PV Séparé
    async delete(numero_pv) {
        try {
            const pv = await this.findByNumero(numero_pv);
            
            if (!pv) {
                throw new Error('PV Séparé non trouvé.');
            }

            await pv.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du PV Séparé:', error);
            throw error;
        }
    }

    // Récupérer le fichier d'un PV Séparé
    async getFile(numero_pv) {
        try {
            const pv = await this.findByNumero(numero_pv);
            
            if (pv && pv.fichier_pv) {
                return pv.fichier_pv;
            }
            
            return null;
        } catch (error) {
            console.error('Erreur lors de la récupération du fichier PV:', error);
            throw error;
        }
    }
}

export default new PVSeparableRepository();