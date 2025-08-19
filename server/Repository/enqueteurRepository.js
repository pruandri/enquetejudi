import { Enqueteur, PVJudiciaire, PVSeparable, PVUnique } from '../models.js';

class EnqueteurRepository {
    // Récupérer tous les enquêteurs
    async findAll() {
        try {
            return await Enqueteur.findAll();
        } catch (error) {
            console.error('Erreur lors de la récupération des enquêteurs:', error.message);
            throw error;
        }
    }

    async verifyPVNumber(numero_pv) {
        try {
            const existsInJudiciaire = await PVJudiciaire.findOne({ where: { numero_pv } });
            const existsInSeparable = await PVSeparable.findOne({ where: { numero_pv } });
            const existsInUnique = await PVUnique.findOne({ where: { numero_pv } });
    
            // Retourner vrai si trouvé dans au moins une table
            return existsInJudiciaire || existsInSeparable || existsInUnique;
        } catch (error) {
            console.error('Erreur lors de la vérification du numéro PV:', error);
            throw error;
        }
    }
    
    // Ajouter un nouvel enquêteur
    async create(enqueteurData) {
        const { matricule, numero_pv, nom, prenom, grade, qualite, groupe, unite } = enqueteurData;
    
        // Validation des champs obligatoires
        if (!matricule || !nom || !numero_pv || !grade || !qualite || !unite) {
            const error = new Error('Les champs matricule, nom, prénom , numero_pv ,grade , qualite et unite  sont requis.');
            error.status = 400;
            throw error;
        }
    
        try {
            // Vérifier si le numéro de PV existe dans l'une des trois tables
            const pvExists = await this.verifyPVNumber(numero_pv);
    
            // Si le numéro de PV n'existe pas, lancer une erreur
            if (!pvExists) {
                const error = new Error(`Le numéro de PV ${numero_pv} n'existe pas dans aucune des tables.`);
                error.status = 404;
                throw error;
            }
    
            // Si le numéro de PV existe, procéder à la création de l'enquêteur
            const nouvelEnqueteur = await Enqueteur.create({
                matricule,
                numero_pv,  // Clé étrangère
                nom,
                prenom,
                grade,
                qualite,
                groupe,
                unite
            });
    
            return {
                message: 'Enquêteur ajouté avec succès.',
                enqueteur: nouvelEnqueteur
            };
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'enquêteur:", error);
            throw error;
        }
    }
    
    // Modifier un enquêteur
    async update( id, enqueteurData) {
        const {matricule, numero_pv, nom, prenom, grade, qualite, groupe, unite } = enqueteurData;
        
        try {
            const enqueteur = await Enqueteur.findByPk(id);
            
            if (!enqueteur) {
                const error = new Error('Enquêteur non trouvé');
                error.status = 404;
                throw error;
            }

            return await enqueteur.update({ 
                matricule,
                numero_pv, 
                nom, 
                prenom, 
                grade, 
                qualite, 
                groupe, 
                unite 
            });
        } catch (error) {
            console.error("Erreur lors de la modification de l'enquêteur:", error);
            throw error;
        }
    }

    // Récupérer un enquêteur par son matricule
    async findById(id) {
        try {
            const enqueteur = await Enqueteur.findByPk(id);
            
            if (!enqueteur) {
                const error = new Error('Enquêteur non trouvé');
                error.status = 404;
                throw error;
            }

            return enqueteur;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'enquêteur:", error);
            throw error;
        }
    }

    // Supprimer un enquêteur
    async delete(id) {
        try {
            const enqueteur = await Enqueteur.findByPk(id);
            
            if (!enqueteur) {
                const error = new Error('Enquêteur non trouvé');
                error.status = 404;
                throw error;
            }

            await enqueteur.destroy();
            return { message: 'Enquêteur supprimé avec succès' };
        } catch (error) {
            console.error("Erreur lors de la suppression de l'enquêteur:", error);
            throw error;
        }
    }
}

export default new EnqueteurRepository();