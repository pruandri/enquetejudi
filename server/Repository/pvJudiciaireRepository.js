import { PVJudiciaire, PVUnique, PVSeparable, PVArchive } from '../models.js';

class PVJudiciaireRepository {
    // Récupérer tous les PV
    async findAll() {
        try {
            return await PVJudiciaire.findAll();
        } catch (error) {
            console.error('Erreur lors de la récupération des PV:', error);
            throw error;
        }
    }

    // Vérifier si un numéro de PV existe
    async verifyPVNumber(numero_pv) {
        try {
            const [pvExist, pvSeparableExist, pvArchiveExist] = await Promise.all([
                PVUnique.findOne({ where: { numero_pv } }),
                PVSeparable.findOne({ where: { numero_pv } }),
                PVArchive.findOne({ where: { numero_pv } })
            ]);

            return pvExist || pvSeparableExist || pvArchiveExist;
        } catch (error) {
            console.error('Erreur lors de la vérification du numéro PV:', error);
            throw error;
        }
    }

    // Créer un nouveau PV
    async create(pvData) {
        try {
            return await PVJudiciaire.create({
                numero_pv: parseInt(pvData.numero_pv, 10),
                date_pv: pvData.date_pv,
                motif_inculpation: pvData.motif_inculpation,
                qualification: pvData.qualification,
                type_mandat: pvData.type_mandat,
                personne_concerne: pvData.personne_concerne,
                lieu_infraction: pvData.lieu_infraction,
                date_infraction: pvData.date_infraction,
                fichier_pv: pvData.fichier_pv
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout du PV:', error);
            throw error;
        }
    }

    // Récupérer un PV par son numéro
    async findByNumero(numero_pv) {
        try {
            const pvJudiciaire = await PVJudiciaire.findOne({ 
                where: { numero_pv: parseInt(numero_pv, 10) } 
            });

            if (!pvJudiciaire) {
                return null;
            }

            return pvJudiciaire;
        } catch (error) {
            console.error('Erreur lors de la récupération du PV:', error);
            throw error;
        }
    }

    // Récupérer le fichier d'un PV
    async findFileByNumero(numero_pv) {
        try {
            const pv = await PVJudiciaire.findByPk(numero_pv);
            
            if (pv && pv.fichier_pv) {
                return pv.fichier_pv;
            }

            return null;
        } catch (error) {
            console.error('Erreur lors de la récupération du fichier:', error);
            throw error;
        }
    }

    // Mettre à jour un PV
    async update(numero_pv, pvData) {
        try {
            const [updated] = await PVJudiciaire.update({
                date_pv: pvData.date_pv,
                motif_inculpation: pvData.motif_inculpation,
                qualification: pvData.qualification,
                type_mandat: pvData.type_mandat,
                personne_concerne: pvData.personne_concerne,
                lieu_infraction: pvData.lieu_infraction,
                date_infraction: pvData.date_infraction,
                fichier_pv: pvData.fichier_pv
            }, {
                where: { numero_pv: parseInt(numero_pv, 10) }
            });

            if (!updated) {
                return null;
            }

            return await this.findByNumero(numero_pv);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du PV:', error);
            throw error;
        }
    }

    // Supprimer un PV
    async delete(numero_pv) {
        try {
            const deleted = await PVJudiciaire.destroy({ 
                where: { numero_pv: parseInt(numero_pv, 10) } 
            });

            return deleted > 0;
        } catch (error) {
            console.error('Erreur lors de la suppression du PV:', error);
            throw error;
        }
    }
}

export default new PVJudiciaireRepository();