import { PVArchive, PVSeparable, PVUnique, PVJudiciaire } from '../models.js';
import sequelize from 'sequelize';
const { Op } = sequelize;

class PVArchiveRepository {
    // Récupérer tous les PV Archives
    async findAll() {
        try {
            return await PVArchive.findAll();
        } catch (error) {
            console.error('Erreur lors de la récupération des archives:', error.message);
            throw error;
        }
    }

    // Vérifier si un numéro PV existe
    async verifyPVNumero(numero_pv) {
        try {
            const [pvExist, pvSeparableExist, pvUniqueExist] = await Promise.all([
                PVJudiciaire.findOne({ where: { numero_pv } }),
                PVSeparable.findOne({ where: { numero_pv } }),
                PVUnique.findOne({ where: { numero_pv } })
            ]);

            return pvExist || pvSeparableExist || pvUniqueExist;
        } catch (error) {
            console.error('Erreur lors de la vérification du numéro PV:', error);
            throw error;
        }
    }

    // Récupérer un fichier PV par numéro
    async findFilePV(numero_pv) {
        try {
            return await PVArchive.findByPk(numero_pv);
        } catch (error) {
            console.error('Erreur lors de la récupération du fichier:', error);
            throw error;
        }
    }

    // Créer un nouveau PV Archive
    async create(archiveData) {
        try {
            return await PVArchive.create(archiveData);
        } catch (error) {
            console.error('Erreur lors de la création de l\'archive:', error.message);
            throw error;
        }
    }

    // Récupérer un PV Archive par numéro
    async findByNumero(numero_pv) {
        try {
            return await PVArchive.findByPk(numero_pv);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'archive:', error.message);
            throw error;
        }
    }

    // Mettre à jour un PV Archive
    async update(numero_pv, updateData) {
        try {
            const archive = await PVArchive.findByPk(numero_pv);
            if (!archive) {
                return null;
            }
            return await archive.update(updateData);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'archive:', error.message);
            throw error;
        }
    }

    // Supprimer un PV Archive
    async delete(numero_pv) {
        try {
            const archive = await PVArchive.findByPk(numero_pv);
            if (!archive) {
                return false;
            }
            await archive.destroy();
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'archive:', error.message);
            throw error;
        }
    }

    // Obtenir les statistiques de PV Archive par année
    async getStatistiquesByAnnee(annee) {
        try {
            const anneeInt = parseInt(annee, 10);
            
            // Vérification de la validité de l'année
            if (isNaN(anneeInt)) {
                throw new Error("L'année doit être un nombre valide.");
            }

            const statistiques = await PVArchive.findAll({
                attributes: [
                    [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date_pv"')), 'mois'],
                    [sequelize.fn('COUNT', sequelize.col('numero_pv')), 'nombre'],
                    'qualification'
                ],
                where: sequelize.where(
                    sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date_pv"')), { [Op.eq]: anneeInt }
                ),
                group: [
                    sequelize.literal('EXTRACT(MONTH FROM "date_pv")'),
                    'qualification'
                ],
                order: [
                    [sequelize.literal('EXTRACT(MONTH FROM "date_pv")'), 'ASC']
                ]
            });

            // Initialisation des résultats pour chaque mois et qualification
            const resultats = { 
                contraventions: Array(12).fill(0), 
                delits: Array(12).fill(0), 
                crimes: Array(12).fill(0) 
            };

            // Traitement des statistiques pour organiser les résultats par qualification et mois
            statistiques.forEach((stat) => {
                const mois = parseInt(stat.dataValues.mois, 10) - 1; // Mois de 0 à 11
                const qualification = stat.dataValues.qualification;
                const nombre = parseInt(stat.dataValues.nombre, 10);

                if (qualification === 'Contravention') {
                    resultats.contraventions[mois] = nombre;
                } else if (qualification === 'Délit') {
                    resultats.delits[mois] = nombre;
                } else if (qualification === 'Crime') {
                    resultats.crimes[mois] = nombre;
                }
            });

            return resultats;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques :', error);
            throw error;
        }
    }

    // Télécharger un fichier PV
    async downloadPV(numero_pv) {
        try {
            const pv = await PVUnique.findOne({ where: { numero_pv } });
            if (!pv) {
                return null;
            }

            const fileName = pv.fichier_pv;
            const filePath = `/path/to/uploads/${fileName}`;

            return { fileName, filePath };
        } catch (error) {
            console.error('Erreur lors du téléchargement du fichier:', error);
            throw error;
        }
    }
}

export default new PVArchiveRepository();