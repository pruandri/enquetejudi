import { GroupeEnqueteur } from '../models.js';

class GroupeEnqueteurRepository {
    /**
     * Récupère tous les groupes d'enquêteurs
     * @returns {Promise<Array>} Liste de tous les groupes d'enquêteurs
     */
    async findAll() {
        try {
            return await GroupeEnqueteur.findAll();
        } catch (error) {
            console.error('Erreur lors de la récupération des groupes d\'enquêteurs:', error);
            throw error;
        }
    }

    /**
     * Authentifie un groupe d'enquêteur
     * @param {Object} credentials Informations d'authentification
     * @param {string} credentials.matricule Matricule du groupe
     * @param {string} credentials.numero_groupe Numéro du groupe
     * @param {string} credentials.grade Grade du groupe
     * @param {string} credentials.email Email du groupe
     * @param {string} credentials.motdepasse Mot de passe du groupe
     * @returns {Promise<Object|null>} Groupe authentifié ou null
     */
    async authenticate(credentials) {
        const { 
            matricule, 
            numero_groupe, 
            grade, 
            email, 
            motdepasse 
        } = credentials;

        try {
            return await GroupeEnqueteur.findOne({
                where: {
                    matricule,
                    numero_groupe,
                    grade,
                    email,
                    motdepasse,
                },
            });
        } catch (error) {
            console.error('Erreur lors de l\'authentification du groupe:', error);
            throw error;
        }
    }
}

export default new GroupeEnqueteurRepository();