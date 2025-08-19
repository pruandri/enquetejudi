import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaSearch } from "react-icons/fa";
import { FaIdCard, FaCalendar, FaFileAlt, FaUser, FaMapMarkerAlt, FaGavel, FaPaperclip } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import '../styles/tailwind.css';
import '../styles/unique.css';

const Unique = () => {
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [currentPV, setCurrentPV] = useState(null);
    const [searchQuery ,setSearchQuery] =useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedPv, setSelectedPv] = useState(null);
    const [formData, setFormData] = useState({
        numero_pv: '',
        numero_ttr: '',
        date_pv: '',
        date_ttr: '',
        nature_infraction: '',
        qualification: '',
        nom_personne_soupconne: '',
        nom_victime: '',
        lieu_infraction: '',
        date_infraction: '',
        fichier_pv: null,
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8081/pvs-unique`);
                setData(response.data);
            } catch (error) {
                setDialogMessage('Erreur lors du chargement des données : ' + error.message);
                setShowDialog(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'fichier_pv' ? files[0] : value
        }));
    };

    const checkNumeroPVExists = async (numero_pv) => {
        try {
            const response = await axios.get(`http://localhost:8081/pvs-unique/verifierUnique/${numero_pv}`);
            
            // Si en mode édition, vérifiez si le numéro PV correspond au PV actuel
            if (editMode && currentPV && currentPV.numero_pv === numero_pv) {
                return false; // Permettre la modification du même PV
            }
            
            return response.data.exists;
        } catch (error) {
            console.error('Erreur lors de la vérification du numéro PV:', error);
            return false;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Vérifier si le numéro de PV existe déjà avant de soumettre
        const numeroPVExists = await checkNumeroPVExists(formData.numero_pv);
        if (numeroPVExists) {
            setDialogMessage("Le numéro de PV existe déjà.");
            setShowDialog(true);
            return;
        }
    
        const url = editMode ? `http://localhost:8081/pvs-unique/${formData.numero_pv}` : 'http://localhost:8081/pvs-unique';
        const method = editMode ? 'put' : 'post';
        const submitData = new FormData();
    
        Object.keys(formData).forEach((key) => {
            if (key !== 'fichier_pv' || (key === 'fichier_pv' && formData[key])) {
                submitData.append(key, formData[key]);
            }
        });
    
        try {
            const response = await axios({
                method,
                url,
                data: submitData,
            });
    
            const responseData = response.data;
            if (editMode) {
                setData((prevData) => prevData.map((pv) => (pv.numero_pv === currentPV.numero_pv ? responseData : pv)));
                setDialogMessage('Modification enregistrée avec succès!');
            } else {
                setData((prevData) => [...prevData, responseData]);
                setDialogMessage('Les données ont été ajoutées avec succès!');
                setSuccessMessage('Ajout effectué avec succès!');
            }
    
            // Réinitialiser le formulaire après ajout ou modification
            setFormData({
                numero_pv: '',
                numero_ttr: '',
                date_pv: '',
                date_ttr: '',
                nature_infraction: '',
                qualification: '',
                nom_personne_soupconne: '',
                nom_victime: '',
                lieu_infraction: '',
                date_infraction: '',
                fichier_pv: null,
            });
    
            // Rafraîchir les données
            const fetchData = async () => {
                try {
                    const getDataResponse = await axios.get(`http://localhost:8081/pvs-unique`);
                    setData(getDataResponse.data);
                } catch (error) {
                    setDialogMessage('Erreur lors du rafraîchissement des données : ' + error.message);
                    setShowDialog(true);
                }
            };
            fetchData();
    
            setShowDialog(true);
            setEditMode(false);
        } catch (error) {
            setDialogMessage('Erreur: ' + error.message);
            setShowDialog(true);
        }
    };
    

    const handleRead = (pv) => {
        const details = (
            <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg space-y-3">
                <p><strong>Numéro TTR :</strong> {pv.numero_ttr}</p>
                <p><strong>Date PV :</strong> {pv.date_pv.substring(0, 10)}</p>
                <p><strong>Date TTR :</strong> {pv.date_ttr.substring(0, 10)}</p>
                <p><strong>Nature de l'infraction :</strong> {pv.nature_infraction}</p>
                <p><strong>Qualification :</strong> {pv.qualification}</p>
                <p><strong>Nom de la personne soupçonnée :</strong> {pv.nom_personne_soupconne}</p>
                <p><strong>Nom de la victime :</strong> {pv.nom_victime}</p>
                <p><strong>Lieu de l'infraction :</strong> {pv.lieu_infraction}</p>
                <p><strong>Date de l'infraction :</strong> {pv.date_infraction ? pv.date_infraction.substring(0, 10) : 'Non spécifié'}</p>
            </div>
        );
    
        setDialogMessage(details);
        setShowDialog(true);
    };
    

    const handleEdit = (pv) => {
        setEditMode(true);
        setCurrentPV(pv);
        setFormData({
            numero_pv: pv.numero_pv,
            numero_ttr: pv.numero_ttr,
            date_pv: pv.date_pv ? pv.date_pv.substring(0, 10) : '',
            date_ttr: pv.date_ttr ? pv.date_ttr.substring(0, 10) : '',
            nature_infraction: pv.nature_infraction,
            qualification: pv.qualification,
            nom_personne_soupconne: pv.nom_personne_soupconne || '',
            nom_victime: pv.nom_victime || '',
            lieu_infraction: pv.lieu_infraction || '',
            date_infraction: pv.date_infraction ? pv.date_infraction.substring(0, 10) : '',
            fichier_pv: null
        });
    };
    
    const handleDelete = (pv) => {
        setSelectedPv(pv); // Enregistrer le PV à supprimer
        setOpenDeleteDialog(true); // Ouvrir le dialogue de confirmation
    };
    
    const confirmDelete = async () => {
        if (selectedPv) {
            try {
                await axios.delete(`http://localhost:8081/pvs-unique/${selectedPv.numero_pv}`);
                setData((prevData) => prevData.filter((pv) => pv.numero_pv !== selectedPv.numero_pv));
                setDialogMessage('Le PV a été supprimé avec succès!');
                setShowDialog(true);
            } catch (error) {
                setDialogMessage('Erreur: ' + error.message);
                setShowDialog(true);
            }
        }
        setOpenDeleteDialog(false); // Fermer le dialogue après l'action
    };
    
    const handleCancelDelete = () => {
        setOpenDeleteDialog(false); // Fermer le dialogue sans effectuer de suppression
    };
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value); // Step 2: Handle search query change
    };

    const filteredData = data.filter((pv) => {
        // Step 3: Filter data based on search query
        const searchTerm = searchQuery.toLowerCase();
        return (
            pv.numero_pv.toString().includes(searchTerm) ||
            pv.nom_personne_soupconne.toLowerCase().includes(searchTerm) ||
            pv.nom_victime.toLowerCase().includes(searchTerm)
        );
    });


    const handleClose = () => {
        setShowDialog(false); // Ferme le dialogue lorsque l'utilisateur clique sur le bouton "Fermer"
    };
    return (
       
        <div className="container mx-auto my-8 p-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 shadow-lg rounded-lg border border-gray-300">
    <h1 className="bg-blue-500 text-white font-extrabold text-2xl py-1 px-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 mt-12 flex justify-center items-center space-x-2 transform hover:scale-105 max-w-[850px] mx-auto">
    <FaFileAlt className="text-xl" />
    <span>Gestion des PV Uniques</span>
</h1>

      <form 
    onSubmit={handleSubmit} 
    className="bg-white shadow-md rounded border-1 border-blue-500 hover:border-blue-700 px-8 pt-6 pb-8 mb-4 mx-auto w-full max-w-4xl mt-6"
>
                <h2 className='text-2xl font-bold mb-4'>{editMode ? 'Modifier Procès-verbal unique' : 'Ajouter Procès-verbal unique'}</h2>
          
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colonne de gauche */}
        <div>
        <div className="mb-4">
        <label htmlFor="numero_pv" className="block mb-2">Numéro PV</label>
        <div className="relative">
                <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input 
                    type="text" 
                    name="numero_pv" 
                    value={formData.numero_pv} 
                    onChange={handleChange} 
                    placeholder="Numéro PV" 
                    required 
                    className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    readOnly={editMode} // Champ en lecture seule en mode édition
                />
            </div>
            </div>

            <div className="mb-4">
    <label htmlFor="date_pv" className="block mb-2">Date PV</label>
    <div className="relative">
        <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
        <input 
            type="date" 
            name="date_pv" 
            id="date_pv"  // Ajoutez l'attribut id pour associer le label au champ
            value={formData.date_pv} 
            onChange={handleChange} 
            required 
            className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
    </div>
</div>


            <div className="mb-4">
           <label htmlFor="nature_infraction" className="block mb-2">Nature d'infraction </label>
           <div className="relative">
                <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input 
                    type="text" 
                    name="nature_infraction" 
                    value={formData.nature_infraction} 
                    onChange={handleChange} 
                    placeholder="Nature de l'infraction" 
                    required 
                    className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>
            </div>

            <div className="mb-4">
        <label htmlFor="nom_personne_soupconne" className="block mb-2">Informations sur la personne soupçonnée</label>
        <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input 
                    type="text" 
                    name="nom_personne_soupconne" 
                    value={formData.nom_personne_soupconne} 
                    onChange={handleChange} 
                    placeholder="Informations sur  la personne soupçonnée" 
                    className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>
            </div>

            <div className="mb-4">
        <label htmlFor="lieu_infraction" className="block mb-2">Lieu d'infraction</label>
        <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input 
                    type="text" 
                    name="lieu_infraction" 
                    value={formData.lieu_infraction} 
                    onChange={handleChange} 
                    placeholder="Lieu de l'infraction" 
                    className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>
        </div>
        </div>
        
        {/* Colonne de droite */}
        <div className="mb-4">
        <label htmlFor="numero_ttr" className="block mb-2">Numéro TTR</label>
        <div className="relative">
                <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input 
                    type="text" 
                    name="numero_ttr" 
                    value={formData.numero_ttr} 
                    onChange={handleChange} 
                    placeholder="Numéro TTR" 
                    required 
                    className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>

            <div className="mb-4">
    <label htmlFor="date_ttr" className="block mb-3.5">Date TTR</label>
    <div className="relative">
        <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
        <input 
            type="date" 
            name="date_ttr" 
            id="date_ttr"  // Ajoutez l'attribut id pour associer le label au champ
            value={formData.date_ttr} 
            onChange={handleChange} 
            required 
            className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
    </div>
</div>


<div className="mb-4">
        <label htmlFor="qualification" className="block mb-3">Qualification</label>
        <div className="relative">
                <FaGavel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <select 
                    name="qualification" 
                    value={formData.qualification} 
                    onChange={handleChange} 
                    className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >   <option value="">sélectionner la qualification</option>
                    <option value="contravention">Contravention</option>
                    <option value="délit">Délit</option>
                    <option value="crime">Crime</option>
                </select>
            </div>
            </div>

            <div className="mb-4">
        <label htmlFor="nom_victime" className="block mb-3.5">Informations de la victime</label>
        <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input 
                    type="text" 
                    name="nom_victime" 
                    value={formData.nom_victime} 
                    onChange={handleChange} 
                    placeholder="Informations  de la victime" 
                    className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
            </div>
            </div>

            <div className="mb-4">
    <label htmlFor="date_infraction" className="block mb-2">Date Infraction</label>
    <div className="relative">
        <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
        <input 
            type="date" 
            name="date_infraction" 
            id="date_infraction"  // Ajoutez l'attribut id pour associer le label au champ
            value={formData.date_infraction} 
            onChange={handleChange} 
            className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
    </div>
</div>

        </div>
    </div>

    {/* Champ de fichier et boutons */}
    <div className="mb-4">
    <label htmlFor="fichier_pv" className="block mb-2">Fichier PV [4 GO de plus et .PDF]  </label>
        <input 
            type="file" 
            name="fichier_pv" 
            onChange={handleChange} 
            id="fileUpload"
            accept="application/pdf, .pdf"
            className="block w-full border border-gray-300 rounded mb-4 p-2"
        />
    </div>

    <div className="flex justify-between">
  <button
    type="submit"
    className={`${
      editMode ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-700'
    } text-white font-bold py-2 px-4 rounded`}
  >
    {editMode ? 'Modifier' : 'Ajouter'}
  </button>

  {editMode && (
  <button
    type="button"
    onClick={() => {
      setEditMode(false); // Désactive le mode édition
      setFormData({
        numero_pv: '',
        numero_ttr: '',
        date_pv: '',
        date_ttr: '',
        nature_infraction: '',
        qualification: '',
        nom_personne_soupconne: '',
        nom_victime: '',
        lieu_infraction: '',
        date_infraction: '',
        fichier_pv: null,
      }); // Réinitialise le formulaire à vide
    }}
    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
  >
    Annuler
  </button>
)}

</div>

</form>
  
  {/* Step 4: Add the search bar */}
  <div className="flex justify-left mb-6">
    <div className="relative w-2/3 md:w-1/3">
        {/* Icône de recherche */}
        <FaSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher par numéro PV, personne soupçonnée ou victime"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border border-blue-300 rounded p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {searchQuery && (
                    <AiOutlineCloseCircle
                        className="cursor-pointer text-blue-400 ml-2"
                        onClick={() => setSearchQuery('')}
                    />
                )}
            </div>
            </div>

            {loading ? (
                <div className="text-center">Chargement des données...</div>
            ) : data.length === 0 ? (
                <div className="text-center">Aucune donnée disponible.</div>
            ) : (
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
                        {[
                            'Numéro TTR',
                            'Date TTR',
                            'Numéro PV',
                            'Date PV',
                            'Nature de l\'infraction',
                            'Qualification',
                            'Informations  de la personne soupçonnée',
                            'Informations  de la victime',
                            'Lieu de l\'infraction',
                            'Date de l\'infraction',
                            'Fichier PV',
                            'Action',
                        ].map((heading, idx) => (
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
                    {filteredData.map((pv) => (
                        <tr key={pv.numero_pv} className="hover:bg-gray-100 transition-colors">
                            <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input 
                                        id={`checkbox-table-search-${pv.numero_pv}`} 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label htmlFor={`checkbox-table-search-${pv.numero_pv}`} className="sr-only">Select</label>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.numero_ttr}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.date_ttr.substring(0, 10)}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.numero_pv}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.date_pv.substring(0, 10)}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.nature_infraction}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.qualification}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.nom_personne_soupconne}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.nom_victime}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">{pv.lieu_infraction}</td>
                            <td className="px-4 py-3 text-sm text-gray-700 border-gray-200">
                                {pv.date_infraction ? pv.date_infraction.substring(0, 10) : 'Non spécifié'}
                            </td>
                            <td className="px-4 py-3 text-blue-500 underline hover:text-blue-700 border-gray-200">
                                          {pv.fichier_pv ? (
                                              <a 
                                                  href={`http://localhost:8081/pvs-unique/fichier/${pv.numero_pv}`} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer" 
                                                  className="text-blue-500 underline hover:text-blue-700"
                                              >
                                                  PV NR: {pv.numero_pv}
                                              </a>
                                          ) : (
                                              <span className="text-red-500">Fichier non trouvé</span>
                                          )}
                                      </td>
                            <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2 items-center">
                               
                                <button 
                                    onClick={() => handleEdit(pv)} 
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                                >
                                    Modifier
                                </button>
                                <button 
                                    onClick={() => handleDelete(pv)} 
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md transition-colors"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            )}

                                <Dialog open={showDialog} onClose={handleClose}>
                                        <DialogTitle>Détails du PV</DialogTitle>
                                        <DialogContent>
                                            {dialogMessage}
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} color="primary">Fermer</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
                                            <DialogTitle>Confirmation de suppression</DialogTitle>
                                            <DialogContent>
                                                Êtes-vous sûr de vouloir supprimer ce PV ?
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleCancelDelete} color="primary">
                                                    Annuler
                                                </Button>
                                                <Button onClick={confirmDelete} color="secondary">
                                                    Oui
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
        </div>
    );
};

export default Unique;
/*  <button 
                                    onClick={() => handleRead(pv)} 
                                    className="bg-[#005F7F] hover:bg-[#004466] text-white font-semibold py-1 px-3 rounded-md transition-colors"
                                >
                                    Lire
                                </button> */
