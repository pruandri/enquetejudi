import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/tailwind.css';
import axios from "axios";
import { FaIdCard, FaCalendar, FaFileAlt, FaUser, FaMapMarkerAlt, FaGavel, FaPaperclip } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaSearch } from "react-icons/fa";

const Judiciaire = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    numero_pv: '',
    date_pv: '',
    motif_inculpation: '',
    qualification: '',
    type_mandat: '',
    personne_concerne: '',
    lieu_infraction: '',
    date_infraction: '',
    fichier_pv: null, 
  });
  
  const [data, setData] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogType, setDialogType] = useState('info');
  const [selectedPv, setSelectedPv] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:8081/pv_judiciaire");
      setData(response.data);
    } catch (err) {
      console.error(err);
      showErrorDialog('Erreur lors du chargement des données.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fonction générique pour afficher les dialogues
  const openDialog = (message, type = 'info') => {
    setDialogMessage(message);
    setDialogType(type);
    setShowDialog(true);
  };
  
  // Fonction pour afficher les erreurs
  const showErrorDialog = (message) => {
    openDialog(message, 'error');
  };
  
  // Fonction pour afficher les succès
  const showSuccessDialog = (message) => {
    openDialog(message, 'success');
  };
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fichier') {
      setFormData({ ...formData, fichier_pv: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Vérification de l'existence du numéro de PV
  const checkNumeroPVExists = async (numero_pv) => {
    try {
      const response = await axios.get(`http://localhost:8081/pv_judiciaire/verifierJudiciaire/${numero_pv}`);
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
    if (numeroPVExists && !editMode) {
      showErrorDialog("Le numéro de PV existe déjà.");
      return;
    }

    const submitData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== 'fichier_pv' || (key === 'fichier_pv' && formData[key])) {
        submitData.append(key, formData[key]);
      }
    });
    try {
      if (editMode) {
        const response = await axios.put(`http://localhost:8081/pv_judiciaire/${formData.numero_pv}`, submitData);
        const updatedData = data.map((item, index) => (index === currentIndex ? response.data : item));
        setData(updatedData);
        
        // Dialogue de succès spécifique à la modification
        const successMessage = (
          <div>
            <p>Le PV a été modifié avec succès !</p>
            <p><strong>Numéro PV:</strong> {formData.numero_pv}</p>
            <p><strong>Personne Concernée:</strong> {formData.personne_concerne}</p>
          </div>
        );
        showSuccessDialog(successMessage);
      } else {
        const response = await axios.post("http://localhost:8081/pv_judiciaire", submitData);
        setData([...data, response.data]);
        
        // Dialogue de succès spécifique à l'ajout
        const successMessage = (
          <div>
            <p>Un nouveau PV a été ajouté avec succès !</p>
            <p><strong>Numéro PV:</strong> {formData.numero_pv}</p>
            <p><strong>Personne Concernée:</strong> {formData.personne_concerne}</p>
          </div>
        );
        showSuccessDialog(successMessage);
      }

      setFormData({
        numero_pv: '',
        date_pv: '',
        motif_inculpation: '',
        qualification: '',
        type_mandat: '',
        personne_concerne: '',
        lieu_infraction: '',
        date_infraction: '',
        fichier_pv: null,
      });

      setEditMode(false);
      setCurrentIndex(null);
      loadData();
    } catch (err) {
      console.error(err);
      showErrorDialog('Erreur lors de la soumission. Veuillez réessayer.');
    }
  };

  const handleEdit = (index) => {
    setFormData(data[index]);
    setEditMode(true);
    setCurrentIndex(index);
  };
  
  const handleRead = (pv) => {
    const details = (
      <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg space-y-3">
        <p><strong>Numéro PV:</strong> {pv.numero_pv} </p>
        <p><strong>Date PV:</strong> {pv.date_pv.substring(0, 10)} </p>
        <p><strong>Motif Inculpation:</strong> {pv.motif_inculpation}  </p>
        <p><strong>Qualification:</strong> {pv.qualification}  </p>
        <p><strong>Type Mandat:</strong> {pv.type_mandat}  </p>
        <p><strong>Personne Concernée:</strong> {pv.personne_concerne}  </p>
        <p><strong>Lieu Infraction:</strong> {pv.lieu_infraction}  </p>
        <p><strong>Date Infraction:</strong> {pv.date_infraction ? pv.date_infraction.substring(0, 10) : 'Non spécifié'} </p>
      </div>
    );
    showDialog(details);
  };

  const handleDelete = (pv) => {
    setSelectedPv(pv);
    setOpenDeleteDialog(true);
  };
   
  const confirmDelete = async () => {
    if (selectedPv && selectedPv.numero_pv) {
      try {
        await axios.delete(`http://localhost:8081/pv_judiciaire/${selectedPv.numero_pv}`);
        setData((prevData) => prevData.filter((pv) => pv.numero_pv !== selectedPv.numero_pv));
        
        // Dialogue de succès de suppression
        const successMessage = (
          <div>
            <p>Le PV a été supprimé avec succès !</p>
            <p><strong>Numéro PV:</strong> {selectedPv.numero_pv}</p>
            <p><strong>Personne Concernée:</strong> {selectedPv.personne_concerne}</p>
          </div>
        );
        showSuccessDialog(successMessage);
      } catch (error) {
        showErrorDialog('Erreur: ' + error.message);
      }
      setOpenDeleteDialog(false);
    } else {
      showErrorDialog('Aucun PV sélectionné!');
    }
  };
   
  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredData = data.filter((pv) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      pv.numero_pv.toString().includes(searchTerm) ||
      pv.personne_concerne.toLowerCase().includes(searchTerm) ||
      pv.date_pv.toLowerCase().includes(searchTerm)
    );
  });

  const handleClose = () => {
    setShowDialog(false);
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 shadow-lg rounded-lg border border-gray-300">
    <h1 className="bg-blue-500 text-white font-extrabold text-2xl py-1 px-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 mt-12 flex justify-center items-center space-x-2 transform hover:scale-105 max-w-[850px] mx-auto">
    <FaFileAlt className="text-xl" />
    <span>Gestion des PV sur rgts judiciaires </span>
</h1>
        <form
  onSubmit={handleSubmit}
 className="bg-white shadow-md rounded border-1 border-blue-500 hover:border-blue-700 px-8 pt-6 pb-8 mb-4 mx-auto w-full max-w-4xl mt-6"
>  <h2 className='text-2xl font-bold mb-4'>{editMode ? 'Modifier Procès-verbal sur rgts judiciaire' : 'Ajouter Procès-verbal sur rgts judiciaire '}</h2>
  <div className="flex flex-wrap -mx-4">
    {/* Colonne gauche */}
    <div className="w-full md:w-1/2 px-4 mb-4">
  <label className="block mb-2">Numéro PV</label>
  <div className="relative">
    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
    <input
      type="text"
      name="numero_pv"
      value={formData.numero_pv}
      placeholder="Numéro PV"
      onChange={handleChange}
      required
      className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      readOnly={editMode} // Champ en lecture seule en mode édition
    />
  </div>
</div>


    <div className="w-full md:w-1/2 px-4 mb-4">
      <label className="block mb-2">Date PV</label>
      <div className="relative">
      <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
      <input
        type="date"
        name="date_pv"
        value={formData.date_pv}
        onChange={handleChange}
        required
         className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
    </div>

    <div className="w-full md:w-1/2 px-4 mb-4">
      <label className="block mb-2">Motif Inculpation</label>
      <div className="relative">
      <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
      <input
        type="text"
        name="motif_inculpation"
        value={formData.motif_inculpation}
        placeholder="Motif Inculpation"
        onChange={handleChange}
        required
        className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
    </div>
    </div>

    <div className="w-full md:w-1/2 px-4 mb-4">
      <label className="block mb-2">Qualification</label>
      <select
        name="qualification"
        value={formData.qualification}
        onChange={handleChange}
        required
       className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Sélectionner une qualification</option>
        <option value="contravention">Contravention</option>
        <option value="délit">Délit</option>
        <option value="crime">Crime</option>
      </select>
    </div>

    <div className="w-full md:w-1/2 px-4 mb-4">
      <label className="block mb-2">Type Mandat</label>
      <select
        name="type_mandat"
        value={formData.type_mandat}
        onChange={handleChange}
        required
        className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">Sélectionner un type de mandat</option>
        <option value="mandat de depot">Mandat de Dépôt</option>
        <option value="mandat arrêt">Mandat Arrêt</option>
        <option value="mandat comparution">Mandat de Comparution</option>
        <option value="mandat amener">Mandat Amener</option>
      </select>
    </div>

    <div className="w-full md:w-1/2 px-4 mb-4">
      <label className="block mb-2">Personne Concernée</label>
      <div className="relative">
      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
      <input
        type="text"
        name="personne_concerne"
        value={formData.personne_concerne}
        placeholder="Personne Concernée"
        onChange={handleChange}
        required
        className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
    </div>

    <div className="w-full md:w-1/2 px-4 mb-4">
      <label className="block mb-2">Lieu Infraction</label>
      <div className="relative">
      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
      <input
        type="text"
        name="lieu_infraction"
        value={formData.lieu_infraction}
        placeholder="Lieu Infraction"
        onChange={handleChange}
        required
        className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
    </div>

    <div className="w-full md:w-1/2 px-4 mb-4">
      <label className="block mb-2">Date Infraction</label>
      <div className="relative">
      <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
      <input
        type="date"
        name="date_infraction"
        value={formData.date_infraction}
        onChange={handleChange}
        required
        className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
    </div>

    <div className="w-full px-4 mb-4">
      <label className="block mb-2">Fichier</label>
      <input
        type="file"
        name="fichier"
        onChange={handleChange}
         id="fileUpload"
         accept="application/pdf, .pdf"
        className="border border-gray-300 rounded p-2 w-full"
      />
    </div>
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
      setEditMode(false);
      setFormData({
        numero_pv: '',
        date_pv: '',
        motif_inculpation: '',
        qualification: '',
        type_mandat: '',
        personne_concerne: '',
        lieu_infraction: '',
        date_infraction: '',
        fichier_pv: null,
      });
    }}  // Fonction pour annuler la modification
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
  

    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead >
            <tr>
                <th className="w-4 p-4">
                    <div className="flex items-center">
                        <input 
                            id="checkbox-table-search-all" 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="checkbox-table-search-all" className="sr-only">Select all</label>
                    </div>
                </th >
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Numéro PV</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Date PV</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Motif Inculpation</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Qualification</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Type Mandat</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Personne Concernée</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Lieu Infraction</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Date Infraction</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Fichier</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Actions</th>
            </tr>
        </thead>
        <tbody>
            {filteredData.map((pv, index) => (
                <tr key={pv.numero_pv}>
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
                    <td className="border border-gray-300 p-2">{pv.numero_pv}</td>
                    <td className="border border-gray-300 p-2">{pv.date_pv}</td>
                    <td className="border border-gray-300 p-2">{pv.motif_inculpation}</td>
                    <td className="border border-gray-300 p-2">{pv.qualification}</td>
                    <td className="border border-gray-300 p-2">{pv.type_mandat}</td>
                    <td className="border border-gray-300 p-2">{pv.personne_concerne}</td>
                    <td className="border border-gray-300 p-2">{pv.lieu_infraction}</td>
                    <td className="border border-gray-300 p-2">{pv.date_infraction}</td>
                    <td className="px-4 py-3 text-blue-500 underline hover:text-blue-700 border-gray-200">
                                          {pv.fichier_pv ? (
                                              <a 
                                                  href={`http://localhost:8081/pv_judiciaire/fichier/${pv.numero_pv}`} 
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
                                    onClick={() => handleEdit(index)} 
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

export default Judiciaire;






/*                <button className="bg-green-500 text-white rounded px-2 py-1 hover:bg-green-600" onClick={() => handleRead(pv)}>Lire</button>
                  <button className="bg-yellow-500 text-white rounded px-2 py-1 hover:bg-yellow-600" onClick={() => handleEdit(index)}>Modifier</button>
                  <button className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600" onClick={() => handleDelete(pv.numero_pv)}>Supprimer</button>
                  
                  
                  
                   <button 
                                    onClick={() => handleRead(pv)} 
                                    className="bg-[#005F7F] hover:bg-[#004466] text-white font-semibold py-1 px-3 rounded-md transition-colors"
                                >
                                    Lire
                                </button>
                  
                  
                  
                  
                  */
