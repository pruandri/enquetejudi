// db.js
import { Sequelize } from "sequelize";

// Configuration de la base de données PostgreSQL
const sequelize = new Sequelize('postgres://postgres:prudence@localhost:5432/enquetejudiciaire');
//const sequelize = new Sequelize('postgres://postgres:prudence@172.17.0.2:5432/enquetejudiciaire');

// Vérification de la connexion
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

// Appel de la fonction pour tester la connexion
testConnection();

// Exportation de l'instance Sequelize
export default sequelize;

