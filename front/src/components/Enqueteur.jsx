import React, { useEffect, useState } from 'react';
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { FaIdCard, FaUser, FaUserTag, FaBuilding, FaMedal } from 'react-icons/fa';
import '../styles/tailwind.css';
import '../styles/Enqueteur.css';

const Enqueteur = () => {
    const [enqueteurs, setEnqueteurs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogType, setDialogType] = useState("info"); // "info", "success", "error"
    const [openInfoDialog, setOpenInfoDialog] = useState(false);
    const [selectedEnqueteur, setSelectedEnqueteur] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [form, setForm] = useState({
        id :'' ,
        matricule: '',
        numero_pv: '',
        nom: '',
        prenom: '', // Peut être null ou vide
        grade: '',
        qualite: '',
        groupe: '',
        unite: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchEnqueteurs = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/enqueteurs/lire');
            setEnqueteurs(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des enquêteurs:', error);
            showErrorDialog("Impossible de récupérer la liste des enquêteurs");
        }
    };

    useEffect(() => {
        fetchEnqueteurs();
    }, []);
    

    // Méthode générique pour afficher les différents types de dialogues
    const showDialog = (message, type = "info") => {
        setDialogMessage(message);
        setDialogType(type);
        setOpenDialog(true);
    };

    const showSuccessDialog = (message) => showDialog(message, "success");
    const showErrorDialog = (message) => showDialog(message, "error");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value || '' // Convertit null ou undefined en chaîne vide
        }));
    };

    const checkNumeroPVExists = async (numero_pv) => {
        try {
            const response = await axios.get(`http://localhost:8081/api/enqueteurs/verifier/${numero_pv}`);
            return response.data.exists;
        } catch (error) {
            console.error('Erreur lors de la vérification du numéro PV:', error);
            showErrorDialog("Erreur de vérification du numéro PV");
            return false;
        }
    };

    const addEnqueteur = async () => {
        // Validation des champs obligatoires
        if (!form.matricule || !form.numero_pv || !form.nom || !form.grade || !form.qualite || !form.unite) {
            showErrorDialog("Veuillez remplir tous les champs requis (Matricule, Numéro PV, Nom,grade ,qualite et unite )");
            return;
        }

        // Vérification du numéro PV
        const numeroPVExists = await checkNumeroPVExists(form.numero_pv);
        if (!numeroPVExists) {
            showErrorDialog("Le numéro de PV saisi n'existe pas");
            return;
        }

        try {
            // Préparation des données avec gestion des champs null
            const dataToSend = {
                ...form,
                prenom: form.prenom || null // Convertit chaîne vide en null si nécessaire
            };

            const response = await axios.post('http://localhost:8081/api/enqueteurs/ajouter', dataToSend);
        
            
            // Réinitialisation du formulaire
            setForm({
                id:'' ,
                matricule: '',
                numero_pv: '',
                nom: '',
                prenom: '',
                grade: '',
                qualite: '',
                groupe: '',
                unite: ''
            });

            // Mise à jour de la liste des enquêteurs
            fetchEnqueteurs();

            // Affichage du dialogue de succès
            showSuccessDialog("Enquêteur ajouté avec succès");

        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'enquêteur:', error);
            showErrorDialog("Erreur lors de l'ajout de l'enquêteur. Veuillez réessayer.");
           

            
        }
    };

    const updateEnqueteur = async (matricule) => {
        try {
            // Préparation des données avec gestion des champs null
            const dataToSend = {
                ...form,
                prenom: form.prenom || null // Convertit chaîne vide en null si nécessaire
            };
    
            await axios.put(`http://localhost:8081/api/enqueteurs/modifier/${form.id}`, dataToSend);
            
            // Rest of the code remains the same
      
            
            // Réinitialisation du formulaire et de l'état d'édition
            setIsEditing(false);
            setForm({
                id :'' ,
                matricule: '',
                numero_pv: '',
                nom: '',
                prenom: '',
                grade: '',
                qualite: '',
                groupe: '',
                unite: ''
            });

            // Mise à jour de la liste des enquêteurs
            fetchEnqueteurs();

            // Affichage du dialogue de succès
            showSuccessDialog("Enquêteur modifié avec succès");

        } catch (error) {
            console.error('Erreur lors de la modification de l\'enquêteur:', error);
            showErrorDialog("Le numéro pv que vous avez modifié , n'existe pas ");
        }
    };

    const confirmDelete = (id) => {
        setSelectedEnqueteur(id);
        setShowDeleteDialog(true);
    };

    const cancelDelete = () => {
        setShowDeleteDialog(false);
        setSelectedEnqueteur(null);
    };

    const deleteEnqueteur = async () => {
        if (selectedEnqueteur) {
            try {
                await axios.delete(`http://localhost:8081/api/enqueteurs/supprimer/${selectedEnqueteur}`);
                fetchEnqueteurs();
                setShowDeleteDialog(false);
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'enquêteur:', error);
            } finally {
                setSelectedEnqueteur(null);
            }
        }
    };

    const handleEdit = (enqueteur) => {
        setForm(enqueteur);
        setIsEditing(true);
    };

    const handleRead = (enqueteur) => {
        setSelectedEnqueteur(enqueteur);
        setOpenInfoDialog(true);
    };
    const handleCloseInfoDialog = () => {
        setOpenInfoDialog(false);
        setSelectedEnqueteur(null);
    };
     // Fonction pour filtrer les enquêteurs selon le terme de recherche
     const filteredEnqueteurs = enqueteurs.filter((enqueteur) => {
        const numeroPv = enqueteur.numero_pv ? enqueteur.numero_pv.toString() : '';
        const nom = enqueteur.nom ? enqueteur.nom.toLowerCase() : '';
        const prenom = enqueteur.prenom ? enqueteur.prenom.toLowerCase() : '';
        const matricule = enqueteur.matricule ? enqueteur.matricule.toString() : '';
    
        return (
            numeroPv.includes(searchTerm) ||
            nom.includes(searchTerm.toLowerCase()) ||
            prenom.includes(searchTerm.toLowerCase()) ||
            matricule.includes(searchTerm)
        );
    });
    
    

    // Fonction pour mettre à jour le terme de recherche
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };
    return (
        <div className="container mx-auto my-8 p-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 shadow-lg rounded-lg border border-gray-300">
     <h1 className="bg-blue-500 text-white font-extrabold text-2xl py-1 px-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 mt-12 flex justify-center items-center space-x-2 transform hover:scale-105 max-w-[590px] mx-auto">
    <FaPersonMilitaryPointing className="text-xl" />
    <span>Gestion des Enquêteurs</span>
</h1>

            <div className="form-container mb-8 p-6 border border-blue-500 rounded-lg bg-blue-50 shadow-lg">
    <h3 className="text-xl font-semibold text-blue-600 mb-1">
        {isEditing ? 'Modifier' : 'Ajouter'} enquêteur
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {['matricule', 'numero_pv', 'nom', 'prenom', 'grade', 'qualite', 'groupe', 'unite'].map((field, index) => {
        // Define icon for each field
        const iconMap = {
            matricule: <FaIdCard className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />,
            numero_pv: <FaIdCard className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />,
            nom: <FaUser className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />,
            prenom: <FaUser className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />,
            grade: <FaMedal className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />,
            qualite: <FaUserTag className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />,
            groupe: <FaBuilding className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />,
            unite: <FaBuilding className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        };
        const selectAll = () => {
            if (selectAll) {
                setSelectedIds([]);
            } else {
                setSelectedIds(enqueteurs.map(e => e.matricule));
            }
            setSelectAll(!selectAll);
        };
    
        // Gestion des cases à cocher individuelles
        const handleSelect = (matricule) => {
            if (selectedIds.includes(matricule)) {
                setSelectedIds(selectedIds.filter(id => id !== matricule));
            } else {
                setSelectedIds([...selectedIds, matricule]);
            }
        };
    
        // Désactive les actions si aucune case n'est cochée
        const isActionDisabled = (matricule) => !selectedIds.includes(matricule);

        return (
            <div key={index} className="relative mb-4">
                {/* Icon for each field */}
                {iconMap[field]}
                
                <input
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={handleChange}
                    className="pl-10 block w-full p-3 border border-blue-400 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
                    disabled={isEditing && field === 'matricule'}
                />
            </div>
        );
    })}
</div>
<div className="flex justify-between">
  <button
    className={`w-full p-2 rounded-lg ${
      isEditing ? 'bg-[#4CAF50] hover:bg-[#388E3C]' : 'bg-blue-500 hover:bg-blue-600'
    } text-white font-bold`}
    onClick={isEditing ? () => updateEnqueteur(form.matricule) : addEnqueteur}
  >
    {isEditing ? 'Modifier' : 'Ajouter'}
  </button>
  {isEditing && (
  <button
    type="button"
    onClick={() => {
      setIsEditing(false);
      setForm({ matricule: '', numero_pv: '', nom: '', prenom: '', grade: '', qualite: '', groupe: '', unite: '' });
    }}  // Annule la modification
    className="w-full p-2 rounded-lg bg-gray-500 hover:bg-gray-700 text-white font-bold"
  >
    Annuler
  </button>
)}

</div>

</div>

   {/* Barre de recherche */}
<div className="flex justify-left mb-6">
    <div className="relative w-2/3 md:w-1/3">
        {/* Icône de recherche */}
        <FaSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        
        {/* Champ de recherche */}
        <input
            type="text"
            placeholder="Rechercher par numéro PV, nom, prénom ou matricule"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 pl-10 border border-blue-400 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
    </div>
</div>

            
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
    <thead>
        <tr>
            <td className="w-4 p-4">
                <div className="flex items-center">
                    <input 
                        id="checkbox-table-search-all" 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="checkbox-table-search-all" className="sr-only">Select all</label>
                </div>
            </td>
            {['Matricule', 'Numéro PV', 'Nom', 'Prénom', 'Grade', 'Qualité', 'Groupe', 'Unité', 'Actions'].map((heading, idx) => (
                <th 
                    key={idx} 
                    className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300"
                >
                    {heading}
                </th>
            ))}
        </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
        {filteredEnqueteurs.map((enqueteur) => (
            <tr key={enqueteur.id} className="hover:bg-gray-100 transition-colors">
                <td className="w-4 p-4">
                    <div className="flex items-center">
                        <input 
                            id={`checkbox-table-search-${enqueteur.id}`} 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor={`checkbox-table-search-${enqueteur.matricule}`} className="sr-only">Select</label>
                    </div>
                </td>
                {['matricule', 'numero_pv', 'nom', 'prenom', 'grade', 'qualite', 'groupe', 'unite'].map((field, idx) => (
                    <td 
                        key={idx} 
                        className="px-4 py-3 text-sm text-gray-700 border-gray-200"
                    >
                        {enqueteur[field]}
                    </td>
                ))}
                <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2 items-center">
                   
                    <button 
                        onClick={() => handleEdit(enqueteur)} 
                        className="bg-[#4CAF50] hover:bg-[#388E3C] text-white font-semibold py-1 px-3 rounded-md transition-colors"
                    >
                        Modifier
                    </button>
                   <button 
    onClick={() => confirmDelete(enqueteur.id)} 
    className="bg-[#FF4B4B] hover:bg-[#D43A3A] text-white font-semibold py-1 px-3 rounded-md transition-colors"
>
    Supprimer
</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>
<Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    style: {
                        backgroundColor: 
                            dialogType === "success" ? "#e6f3e6" : 
                            dialogType === "error" ? "#f3e6e6" : 
                            "#f0f0f0"
                    }
                }}
            >
                <DialogTitle>
                    {dialogType === "success" ? "Succès" : 
                     dialogType === "error" ? "Erreur" : 
                     "Information"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setOpenDialog(false)} 
                        color={dialogType === "error" ? "secondary" : "primary"}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Message</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMessage}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">OK</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={showDeleteDialog} onClose={cancelDelete}>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogContent>
                    <DialogContentText>Voulez-vous vraiment supprimer cet enquêteur ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">Annuler</Button>
                    <Button onClick={deleteEnqueteur} color="secondary">Supprimer</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
                <DialogTitle>Informations de l'enquêteur</DialogTitle>
                <DialogContent>
                    {selectedEnqueteur && Object.entries(selectedEnqueteur).map(([key, value], idx) => (
                        <p key={idx}><strong>{key}:</strong> {value}</p>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInfoDialog} color="primary">Fermer</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Enqueteur;



/*<h2 className="text-2xl font-bold mb-4 text-blue-700">Liste des Enquêteurs</h2> 

 <button 
                        onClick={() => handleRead(enqueteur)} 
                        className="bg-[#005F7F] hover:bg-[#004466] text-white font-semibold py-1 px-3 rounded-md transition-colors"
                    >
                        Lire
                    </button>



*/
