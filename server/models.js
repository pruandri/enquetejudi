import { DataTypes } from 'sequelize';
import sequelize from './db.js';  

// Modèle GroupeEnqueteur
const GroupeEnqueteur = sequelize.define('GroupeEnqueteur', {
    matricule: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    numero_groupe: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    grade: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    motdepasse: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'groupe_enqueteur',
    timestamps: false
});

// Modèle PV Unique
const PVUnique = sequelize.define('PVUnique', {
    numero_pv: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    numero_ttr: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_pv: {
        type: DataTypes.DATEONLY
    },
    date_ttr: {
        type: DataTypes.DATEONLY
    },
    nature_infraction: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    qualification: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    nom_personne_soupconne: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    nom_victime: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lieu_infraction: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date_infraction: {
        type: DataTypes.DATEONLY,
        allowNull: false 
    },
    fichier_pv: {
        type: DataTypes.BLOB('long')
    }
}, {  
    tableName: 'pv_unique',  
    timestamps: true  
});

// Modèle PV Séparé
const PVSeparable = sequelize.define('PVSeparable', {
    numero_pv: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    numero_ttr: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_piece: {
        type: DataTypes.INTEGER
    },
    nombre_feuillet: {
        type: DataTypes.INTEGER
    },
    date_pv: {
        type: DataTypes.DATE
    },
    date_ttr: {
        type: DataTypes.DATE
    },
    nature_infraction: {
        type: DataTypes.TEXT
    },
    qualification: {
        type: DataTypes.TEXT
    },
    nom_personne_soupconne: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    nom_victime: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lieu_infraction: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date_infraction: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fichier_pv: {
        type: DataTypes.BLOB('long')
    }
}, {
    tableName: 'pv_separe',
    timestamps: true
});

// Modèle PV Judiciaire
const PVJudiciaire = sequelize.define('PVJudiciaire', {
    numero_pv: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    date_pv: {
        type: DataTypes.DATEONLY
    },
    motif_inculpation: {
        type: DataTypes.TEXT
    },
    qualification: {
        type: DataTypes.TEXT
    },
    type_mandat: {
        type: DataTypes.TEXT
    },
    personne_concerne: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lieu_infraction: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date_infraction: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    fichier_pv: {
        type: DataTypes.BLOB('long')
    }
}, {
    tableName: 'pv_judiciaire',
    timestamps: true
});

// Modèle Enqueteur
const Enqueteur = sequelize.define('Enqueteur', {
   id: {
        type: DataTypes.INTEGER,
        primaryKey: true,   // Clé primaire auto-incrémentée
        autoIncrement: true
    },
    matricule: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numero_pv: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            // Validation personnalisée pour s'assurer que numero_pv est dans l'une des tables
            async isValidNumeroPV(value) {
                // Vérification dans chaque table
                const validPV = await PVJudiciaire.findOne({ where: { numero_pv: value } }) ||
                                 await PVUnique.findOne({ where: { numero_pv: value } }) ||
                                 await PVSeparable.findOne({ where: { numero_pv: value } });
                
                if (!validPV) {
                    throw new Error('Le numero_pv doit exister dans l\'une des tables PVJudiciaire, PVUnique, ou PVSeparable.');
                }
            }
        }
    },
    nom: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    prenom: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    grade: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    qualite: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    groupe: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    unite: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'enqueteur',
    timestamps: true
});

// Modèle PV Archive
const PVArchive = sequelize.define('PVArchive', {
    numero_pv: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    date_pv: {
        type: DataTypes.DATEONLY
    },
    nature_infraction: {
        type: DataTypes.TEXT
    },
    auteur_infraction: {
        type: DataTypes.TEXT
    },
    qualification: {
        type: DataTypes.TEXT
    },
    decision: {
        type: DataTypes.TEXT
    },
    fichier_pv: {
        type: DataTypes.BLOB('long')
    }
}, {
    tableName: 'pv_archive',
    timestamps: true
});



// Synchronisation des tables
const synchronizeTables = async () => {
    try {
        await GroupeEnqueteur.sync({ force: false });
        await Enqueteur.sync({ force: false });
        await PVUnique.sync({ force: false });
        await PVSeparable.sync({ force: false });
        await PVJudiciaire.sync({ force: false });
        await PVArchive.sync({ force: false });
        console.log('Tables synchronisées avec succès.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation des tables:', error);
    }
};

// Appel de la fonction pour synchroniser les tables
synchronizeTables();

export {
    GroupeEnqueteur, 
    PVUnique, 
    PVSeparable, 
    PVJudiciaire, 
    Enqueteur, 
    PVArchive
};