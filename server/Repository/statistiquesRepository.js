// statistiquesRepository.js

import sequelize from '../db.js'; // Import de l'instance Sequelize
import { PVArchive } from '../models.js'; // Import des modèles Sequelize
import { Op } from 'sequelize';

/**
 * Récupérer les données des qualifications en fonction des filtres année et mois.
 * @param {number} annee - Année à filtrer.
 * @param {number} mois - Mois à filtrer.
 * @returns {Promise<Array>} Les données agrégées par mois, année, et qualification.
 */
export const getQualificationRates = async (annee, mois) => {
    const whereConditions = [];

    // Ajout des conditions de filtre
    if (annee) {
        whereConditions.push(
            sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date_pv"')), '=', annee)
        );
    }
    if (mois) {
        whereConditions.push(
            sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date_pv"')), '=', mois)
        );
    }

    const queryConditions = whereConditions.length > 0 ? { [Op.and]: whereConditions } : {};

    // Exécution de la requête
    return await PVArchive.findAll({
        attributes: [
            [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date_pv"')), 'month'],
            [sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date_pv"')), 'year'],
            'qualification',
            [sequelize.fn('COUNT', sequelize.col('qualification')), 'count']
        ],
        where: queryConditions,
        group: [
            sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date_pv"')),
            sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date_pv"')),
            'qualification'
        ],
        order: [
            [sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "date_pv"')), 'ASC'],
            [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date_pv"')), 'ASC']
        ]
    });
};
