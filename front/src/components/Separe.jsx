import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileAlt, FaCalendarAlt, FaGavel, FaSearch, FaMapMarkerAlt , FaUser, FaIdCard } from "react-icons/fa";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { MdFormatListNumbered } from "react-icons/md";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import '../styles/tailwind.css' ;



const Separe = () => {
  const [formData, setFormData] = useState({
    numero_pv: '',
    numero_ttr: '',
    nombre_piece: '',
    nombre_feuillet: '',
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPv, setSelectedPv] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8081/pvs-separe');
        setData(response.data);
      } catch (error) {
        setError('Erreur lors du chargement des données: ' + error.message);
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
      
  // Vérification de l'existence du numéro de PV
  const checkNumeroPVExists = async (numero_pv) => {
    try {
      const response = await axios.get(`http://localhost:8081/pvs-separe/verifierSepare/${numero_pv}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erreur lors de la vérification du numéro PV:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Vérifier si le numéro de PV existe déjà
    const numeroPVExists = await checkNumeroPVExists(formData.numero_pv);
    if (numeroPVExists && !editMode) {
      setDialogTitle('Erreur');
      setDialogMessage("Le numéro de PV existe déjà.");
      setShowDialog(true);
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });

    try {
      if (editMode) {
        const response = await axios.put(`http://localhost:8081/pvs-separe/${formData.numero_pv}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setDialogTitle('Modification Réussie');
        setDialogMessage(`Le PV numéro ${formData.numero_pv} a été modifié avec succès !`);
        setData((prevData) => {
          const updatedData = [...prevData];
          updatedData[currentIndex] = response.data;
          return updatedData;
        });
        setSuccess('PV modifié avec succès !');
      } else {
        const response = await axios.post('http://localhost:8081/pvs-separe', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setDialogTitle('Ajout Réussi');
        setDialogMessage(`Le PV numéro ${formData.numero_pv} a été ajouté avec succès !`);
        setData((prevData) => [...prevData, response.data]);
        setSuccess('PV ajouté avec succès !');
      }

      setFormData({
        numero_pv: '',
        numero_ttr: '',
        nombre_piece: '',
        nombre_feuillet: '',
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
      setEditMode(false);
      setCurrentIndex(null);
      setShowDialog(true);
    } catch (error) {
      setDialogTitle('Erreur');
      setDialogMessage('Erreur lors de l\'ajout des données: ' + error.message);
      setShowDialog(true);
      setError('Erreur lors de l\'ajout des données: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'fichier_pv' ? files[0] : value,
    }));
  };

  const handleEdit = (index) => {
    setFormData(data[index]);
    setEditMode(true);
    setCurrentIndex(index);
  };

  const handleDelete = (pv) => {
    setSelectedPv(pv);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedPv) {
      try {
        await axios.delete(`http://localhost:8081/pvs-separe/${selectedPv.numero_pv}`);
        setData((prevData) => prevData.filter((pv) => pv.numero_pv !== selectedPv.numero_pv));
        setDialogTitle('Suppression Réussie');
        setDialogMessage(`Le PV numéro ${selectedPv.numero_pv} a été supprimé avec succès !`);
        setShowDialog(true);
      } catch (error) {
        setDialogTitle('Erreur');
        setDialogMessage('Erreur: ' + error.message);
        setShowDialog(true);
      }
    }
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const handleRead = (pv) => {
    setDialogTitle('Détails du PV');
    setDialogMessage(`
      <strong>Numéro PV:</strong> ${pv.numero_pv}<br />
      <strong>Numéro TTR:</strong> ${pv.numero_ttr}<br />
      <strong>Nombre de Pièces:</strong> ${pv.nombre_piece}<br />
      <strong>Nombre de Feuillets:</strong> ${pv.nombre_feuillet}<br />
      <strong>Date PV:</strong> ${formatDate(pv.date_pv)}<br />
      <strong>Date TTR:</strong> ${formatDate(pv.date_ttr)}<br />
      <strong>Nature de l'Infraction:</strong> ${pv.nature_infraction}<br />
      <strong>Qualification:</strong> ${pv.qualification}<br />
      <strong>Nom Personne Soupçonnée:</strong> ${pv.nom_personne_soupconne}<br />
      <strong>Nom Victime:</strong> ${pv.nom_victime}<br />
      <strong>Lieu de l'Infraction:</strong> ${pv.lieu_infraction}<br />
      <strong>Date d'Infraction:</strong> ${formatDate(pv.date_infraction)}<br />
    `);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const dateOnly = dateString.split('T')[0];
    const [year, month, day] = dateOnly.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter((pv) =>
    pv.numero_pv.toString().includes(searchTerm) ||
    pv.nom_victime.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pv.nom_personne_soupconne.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateInput = (date) => {
    if (date) {
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    }
    return '';
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 shadow-lg rounded-lg border border-gray-300">
    <h1 className="bg-blue-500 text-white font-extrabold text-2xl py-1 px-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 mt-12 flex justify-center items-center space-x-2 transform hover:scale-105 max-w-[850px] mx-auto">
    <FaFileAlt className="text-xl" />
    <span>Gestion des PV Séparés</span>
</h1>

    <div className="flex flex-col items-center mt-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded border-2 border-blue-50 hover:border-blue-50 px-8 pt-6 pb-8 mb-4 mx-auto w-full max-w-4xl">
      <h2 className='text-2xl font-bold mb-4'>{editMode ? 'Modifier Procès-verbal séparés' : 'Ajouter Procès-verbal séparés'}</h2>

        {/* Structure en deux colonnes */}
        <div className="flex space-x-8">
          {/* Colonne gauche */}
          <div className="w-1/2">
  {Object.entries(formData)
    .filter((_, index) => index < 6)
    .map(([key, value], index) => (
      <div key={key} className="mb-4 relative">
         <label className="text-lg font-bold mb-1 capitalize ">
          {key.replace(/_/g, ' ')}
        </label>
        <div className="relative">
  {/* Icône positionnée à gauche dans l'input */}
  {index === 0 && <FaIdCard className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />}
  {index === 1 && <MdFormatListNumbered className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />}
  {index === 2 && <MdFormatListNumbered className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />}
  {index === 3 && <MdFormatListNumbered className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />}
  {index === 4 && <FaCalendarAlt className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />}
  {index === 5 && <FaCalendarAlt className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />}

  <input
  type={key.includes('date') ? 'date' : key.includes('nombre') ? 'number' : 'text'}
  name={key}
  value={key.includes('date') ? formatDateInput(value) : value}
  onChange={handleChange}
  className="border border-blue-300 rounded pl-10 p-2 w-full"
  required={key === 'numero_pv' || key === 'nature_infraction'}
  readOnly={editMode && key === 'numero_pv'}
  min={key.includes('nombre') ? 1 : undefined}
  placeholder={key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
/>



</div>

      </div>
    ))}
</div>
      {/* Colonne droite */}
<div className="w-1/2">
  {Object.entries(formData)
    .filter((_, index) => index >= 6 && index < 12)
    .map(([key, value], index) => (
      <div key={key} className="mb-4 relative">
        <label className="text-lg font-bold mb-1 capitalize ">
          {key === 'nom_personne_soupconne' ? 'Personne soupçonnée' :
           key === 'nom_victime' ? 'Victime' :
           key.replace(/_/g, ' ')}
        </label>
        <div className="relative">
          {/* Icône positionnée à gauche dans l'input */}
          {index === 0 && <FaFileAlt className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />} {/* Pour lieu_infraction */}
          {index === 1 && <FaGavel className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />} {/* Pour qualification */}
          {index === 2 && <FaUser className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />} {/* Pour numero_ttr */}
          {index === 3 && <FaUser className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />} {/* Pour qualification */}
          {index === 4 && <FaMapMarkerAlt className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />} {/* Pour un autre champ */}
          {index === 5 && <FaCalendarAlt className="text-blue-400 absolute left-3 top-1/2 transform -translate-y-1/2" />} {/* Pour un autre champ */}

          {key === 'qualification' ? (
            <select
              name={key}
              value={value}
              onChange={handleChange}
              className="border border-blue-300 rounded pl-10 p-2 w-full"
              required
            >
              <option value="">Sélectionner la qualification</option>
              <option value="Contravention">Contravention</option>
              <option value="Délit">Délit</option>
              <option value="Crime">Crime</option>
            </select>
          ) : (
            <input
              type={key.includes('date') ? 'date' : key.includes('nombre') ? 'number' : 'text'}
              name={key}
              value={value}
              onChange={handleChange}
              className="border border-blue-300 rounded pl-10 p-2 w-full"
              required={key === 'numero_ttr' || key === 'qualification'}
              min={key.includes('nombre') ? 1 : undefined}
              placeholder={
                index === 0 ? 'Nature d\'infraction' :
                index === 1 ? 'Date du jugement' :
                index === 2 ? 'Victime' :
                index === 3 ? 'Personne soupçonnée' :
                index === 4 ? 'Lieu d\'infraction' :
                index === 5 ? 'Date' :
                ''
              }
            />
          )}
        </div>
      </div>
    ))}
</div>
</div>

        {/* Champ fichier PV en bas */}
        <div className="mb-4">
        <label className="text-lg font-bold mb-1 capitalize ">
           Fichier PV
          </label>
          <input
            type="file"
            name="fichier_pv"
            onChange={handleChange}
              accept="application/pdf, .pdf"
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="flex justify-center mt-6">
  <button
    type="submit"
    className={`px-6 py-2 text-white font-semibold rounded-md transition-all duration-300 ${
      editMode ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
    }`}
  >
    {editMode ? 'Modifier' : 'Ajouter'}
  </button>

  {/* Ajouter le bouton "Annuler" si en mode édition */}
  {editMode && (
  <button
    type="button"
    onClick={() => {
      setEditMode(false);
      setFormData({
        numero_pv: '',
        numero_ttr: '',
        nombre_piece: '',
        nombre_feuillet: '',
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
    }}  // Fonction pour annuler la modification
    className="ml-4 px-6 py-2 text-gray-700 bg-gray-300 hover:bg-gray-400 font-semibold rounded-md transition-all duration-300"
  >
    Annuler
  </button>
)}

</div>

      </form>
      </div>
      
            {/* Barre de recherche */}
            <div className="flex justify-left mb-100">
    <div className="relative w-2/3 md:w-1/3">
        {/* Icône de recherche */}
        <FaSearch size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher par numéro PV, personne soupçonnée ou victime"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border border-blue-300 rounded p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                {searchTerm && (
                    <AiOutlineCloseCircle
                        className="cursor-pointer text-blue-400 ml-2"
                        onClick={() => setSearchTerm('')}
                    />
                )}
            </div>
            </div>
          {loading ? (
            <p>Chargement des données...</p>
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
                {['Numéro TTR', 'Date TTR', 'Numéro PV', 'Date PV', 'Date Infraction', 'Nature Infraction', 'Qualification', 'Nom Personne Soupçonnée', 'Nom Victime', 'Lieu Infraction', 'Fichier PV', 'Actions'].map((header) => (
                  <th key={header}  className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((pv, index) => (
                <tr key={pv.numero_pv} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{pv.numero_ttr}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(pv.date_ttr)}</td>
                  <td className="border border-gray-300 px-4 py-2">{pv.numero_pv}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(pv.date_pv)}</td>
                  <td className="border border-gray-300 px-4 py-2">{formatDate(pv.date_infraction)}</td>
                  <td className="border border-gray-300 px-4 py-2">{pv.nature_infraction}</td>
                  <td className="border border-gray-300 px-4 py-2">{pv.qualification}</td>
                  <td className="border border-gray-300 px-4 py-2">{pv.nom_personne_soupconne}</td>
                  <td className="border border-gray-300 px-4 py-2">{pv.nom_victime}</td>
                  <td className="border border-gray-300 px-4 py-2">{pv.lieu_infraction}</td>
                  <td className="px-4 py-3 text-blue-500 underline hover:text-blue-700 border-gray-200">
                                          {pv.fichier_pv ? (
                                              <a 
                                                  href={`http://localhost:8081/pvs-separe/fichier/${pv.numero_pv}`} 
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
 
          
          
          )}
       {/* Dialog for displaying PV details */}
    <Dialog open={showDialog} onClose={handleCloseDialog}>
      <DialogTitle>Détails du Procès-Verbal</DialogTitle>
      <DialogContent>
        <DialogContentText
          dangerouslySetInnerHTML={{ __html: dialogMessage }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>

    {/* Dialog for confirmation of deletion */}
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

export default Separe;

/*      <td className="border border-gray-300 px-4 py-2">{pv.nombre_piece}</td>
                    <td className="border border-gray-300 px-4 py-2">{pv.nombre_feuillet}</td>
                    'Nombre de Pièces', 'Nombre de Feuillets', 
                    
                    
                    
                    
                    
                      <button 
                                    onClick={() => handleRead(pv)} 
                                    className="bg-[#005F7F] hover:bg-[#004466] text-white font-semibold py-1 px-3 rounded-md transition-colors"
                                >
                                    Lire
                                </button>
                    
                    
                    
                    */
