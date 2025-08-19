import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaSearch } from "react-icons/fa";
import { FaIdCard, FaCalendar, FaFileAlt, FaUser, FaMapMarkerAlt, FaGavel, FaPaperclip } from 'react-icons/fa';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { FaChartLine } from "react-icons/fa";
import { FcMakeDecision } from "react-icons/fc";
import './Histogram.jsx';
import '../styles/tailwind.css' ;
import '../styles/archives.css';


const Archives = () => {
    const [formData, setFormData] = useState({
        numero_pv: '',
        date_pv: '',
        nature_infraction: '',
        auteur_infraction: '',
        qualification: '',
        decision: '',
        fichier_pv: null,
    });
    
    const [data, setData] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
    const [editMode, setEditMode] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showDialog, setShowDialog] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const [chartData, setChartData] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
  
    
    const loadData = async () => {
        try {
            const response = await axios.get('http://localhost:8081/pv_archive');
            setData(response.data);
        } catch (err) {
            console.error(err);
            setError('Erreur lors du chargement des données.');
        }
    };


    useEffect(() => {
        loadData();
}, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'fichier_pv') { // Assurez-vous que c'est le bon champ
            setFormData({ ...formData, fichier_pv: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
     // Fonction pour vérifier si le numéro de PV existe
const checkNumeroPVExists = async (numero_pv) => {
    try {
        const response = await axios.get(`http://localhost:8081/pv_archive/verifier/${numero_pv}`);
        return response.data.exists; // Assurez-vous que la réponse est au format attendu { exists: boolean }
    } catch (error) {
        console.error('Erreur lors de la vérification du numéro PV:', error);
        return false;
    }
};

// Soumission du formulaire
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Vérifier l'existence du numéro de PV
    const numeroPVExists = await checkNumeroPVExists(formData.numero_pv);
    if (!numeroPVExists) {
        setAlertMessage("Le numéro de PV saisi n'existe pas.");
        setDialogOpen(true); // Ouvre le dialogue d'alerte pour un PV inexistant
        return;
    }

    try {
        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key !== 'fichier_pv' || (key === 'fichier_pv' && formData[key])) {
                submitData.append(key, formData[key]);
            }
        });

        if (editMode) {
            await axios.put(`http://localhost:8081/pv_archive/${formData.numero_pv}`, submitData);
            setSuccess('Archive modifiée avec succès !');
        } else {
            await axios.post('http://localhost:8081/pv_archive', submitData);
            setSuccess('Archive ajoutée avec succès !');
        }

        setFormData({
            numero_pv: '',
            date_pv: '',
            nature_infraction: '',
            auteur_infraction: '' ,
            qualification: '',
            decision: '',
            fichier_pv: null,
        });
        setEditMode(false);
        setCurrentIndex(null);
        loadData();
    } catch (err) {
        console.error(err);
        setError('Erreur lors de la soumission. Veuillez réessayer.');
    }
};
    const handleCancel = () => {
        setFormData({
            numero_pv: '',
            date_pv: '',
            nature_infraction: '',
            auteur_infraction: '',
            qualification: '',
            decision: '',
            fichier_pv: null,
        });
        setEditMode(false);
        setCurrentIndex(null);
        setError('');
        setSuccess('');
    };

    const handleEdit = (index) => {
        setFormData(data[index]);
        setEditMode(true);
        setCurrentIndex(index);
    };
    const handleRead = (index) => {
        const archive = data[index];
        const details = (
            <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-lg space-y-3">
                <p><strong>Numéro PV:</strong> {archive.numero_pv}</p>
                <p><strong>Date PV:</strong> {archive.date_pv.substring(0, 10)}</p>
                <p><strong>Nature Infraction:</strong> {archive.nature_infraction}</p>
                <p><strong>Qualification:</strong> {archive.qualification}</p>
                <p><strong>Auteur Infraction:</strong> {archive.auteur_infraction}</p>
                <p><strong>Décision:</strong> {archive.decision}</p>
            </div>
        );
        setDialogMessage(details);
        setShowDialog(true); // active seulement pour afficher les détails d'archive, pas le mot de passe
    };
    

    

    const filteredData = data.filter((archive) =>
        archive.numero_pv.toString().includes(searchQuery.toLowerCase()) ||
        archive.auteur_infraction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        archive.nature_infraction.toLowerCase().includes(searchQuery.toLocaleLowerCase())
    );

   // Fonction pour fermer la boîte de dialogue d'alerte
const handleCloseDialog = () => {
    setDialogOpen(false);
    setAlertMessage(''); // Réinitialiser l'alerte
};
    
const handleHistogramRedirect = () => {
    navigate('/dashboard/histogram');
  };


    return (
   <div className="container mx-auto my-8 p-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 shadow-lg rounded-lg border border-gray-300">
    <h1 className="bg-blue-500 text-white font-extrabold text-2xl py-1 px-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 mt-12 flex justify-center items-center space-x-2 transform hover:scale-105 max-w-[850px] mx-auto">
    <FaFileAlt className="text-xl" />
    <span>Gestion des PV  aux archives </span>
</h1>
                    <form
    onSubmit={handleSubmit}
    className="bg-white shadow-md rounded border-1 border-blue-500 hover:border-blue-700 px-8 pt-6 pb-8 mb-4 mx-auto w-full max-w-4xl mt-6"
>
<h2 className='text-2xl font-bold mb-4'>{editMode ? 'Modifier Pv aux archives ' : 'Ajouter Pv aux archives '}</h2>
    <div className="flex flex-wrap -mx-2">
        {/* Colonne de gauche */}
        <div className="w-full md:w-1/2 px-2">
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
            <label className="block mb-2">Nature Infraction</label>
            <div className="relative">
            <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <input
                type="text"
                name="nature_infraction"
                value={formData.nature_infraction}
                placeholder="Nature Infraction"
                onChange={handleChange}
                required
                    className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
           </div>
           
        </div>

        {/* Colonne de droite */}
        <div className="w-full md:w-1/2 px-2">
            <label className="block mb-2">Qualification</label>
            <div className="relative">
            <FaGavel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <select
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                required
                 className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-3"
            >
                <option value="">Sélectionner la qualification</option>
                <option value="Contravention">Contravention</option>
                <option value="Délit">Délit</option>
                <option value="Crime">Crime</option>
            </select>
            </div>
            
            <label className="block mb-2">Auteur d'Infraction</label>
            <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <input
                type="text"
                name="auteur_infraction"
                value={formData.auteur_infraction}
                placeholder="Informations sur l'auteur d\Infraction"
                onChange={handleChange}
                required
               className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            </div>
            <label className="block mb-2">Décision</label>
            <div className="relative">
            <FcMakeDecision className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            <select
                name="decision"
                value={formData.decision}
                placeholder="Décision"
                onChange={handleChange}
                 className="pl-10 block w-full border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 mt-5"
            > 
                <option value="">Sélectionner la décision </option>
                <option value="LP">Liberté Provisoire</option>
                <option value="MD">Mandat de dépôt </option>
                <option value="SCJ">Sous Contrôle Judiciaire </option>
            </select>
           </div>
           
        </div>
        <label className="block mb-2">Fichier PV</label>
            <input
                type="file"
                name="fichier_pv"
                onChange={handleChange}
                id="fileUpload"
                accept="application/pdf, .pdf"
                className="border rounded w-full p-2 mb-4"
            />
    </div>

    {/* Bouton de soumission centré */}
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
      handleCancel();
      setFormData({
        numero_pv: '',
        date_pv: '',
        nature_infraction: '',
        auteur_infraction: '' ,
        qualification: '',
        decision: '',
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
                     placeholder="Rechercher par numéro ou auteur et nature infraction" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

            <button
  onClick={handleHistogramRedirect}
  className="w-48 border border-blue-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center ml-auto mr-7"
>
  <FaChartLine className="mr-2" /> Voir les statistiques
</button>



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
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Nature Infraction</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Auteur Infraction</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Qualification</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Décision</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Fichier PV</th>
            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide bg-blue-600 text-white border-b border-gray-300">Actions</th>
        </tr>
    </thead>
    <tbody>
        {filteredData
    
        .map((archive, index) => (
            <tr key={index} className="hover:bg-gray-100">
                 <td className="w-4 p-4">
                                <div className="flex items-center">
                                    <input 
                                        id={`checkbox-table-search-${index.numero_pv}`} 
                                        type="checkbox" 
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    />
                                    <label htmlFor={`checkbox-table-search-${index.numero_pv}`} className="sr-only">Select</label>
                                </div>
                            </td>
                <td className="py-2 px-4 border">{archive.numero_pv}</td>
                <td className="py-2 px-4 border">{new Date(archive.date_pv).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{archive.nature_infraction}</td>
                <td className="py-2 px-4 border">{archive.auteur_infraction}</td>
                <td className="py-2 px-4 border">{archive.qualification}</td>
                <td className="py-2 px-4 border">{archive.decision}</td>
                <td className="px-4 py-3 text-blue-500 underline hover:text-blue-700 border-gray-200">
                                          {archive.fichier_pv ? (
                                              <a 
                                                  href={`http://localhost:8081/pv_archive/fichier/${archive.numero_pv}`} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer" 
                                                  className="text-blue-500 underline hover:text-blue-700"
                                              >
                                                  PV NR: {archive.numero_pv}
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
                                
                            </td>
            </tr>
        ))}
    </tbody>
</table>                 
{dialogMessage && (
    <Dialog open={Boolean(dialogMessage)} onClose={() => setDialogMessage('')}>
        <DialogTitle>Détails de l'archive</DialogTitle>
        <DialogContent>
            <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDialogMessage('')} color="primary">
                Fermer
            </Button>
        </DialogActions>
    </Dialog>
)}

{/* Boîte de dialogue d'alerte pour numéro de PV inexistant */}
{alertMessage && (
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Attention</DialogTitle>
        <DialogContent>
            <DialogContentText>{alertMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
                Fermer
            </Button>
        </DialogActions>
    </Dialog>
)}
            
        
    
        </div>
        
        
       
        
    );
};


export default Archives;





/*  {chartData && (
    <div className="chart-container">
        <Bar data={chartData} options={{ responsive: true }} />
    </div>
)} const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === 'prudence') {
            setShowDialog(false);
            setAlertMessage('');
        } else {
            setAlertMessage('Mot de passe incorrect.');
        }
    }; 
    
    
     <button 
                                    onClick={() => handleRead(index)} 
                                    className="bg-[#005F7F] hover:bg-[#004466] text-white font-semibold py-1 px-3 rounded-md transition-colors"
                                >
                                    Lire
                                </button>

                                        .sort((a, b) => {
                const numA = parseInt(a.numero_pv, 10);
                const numB = parseInt(b.numero_pv, 10);
                return numA - numB; // Tri croissant
            })
    
    
    
    */