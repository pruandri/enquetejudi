import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';
import { 
  LuUser2, 
  LuLock, 
  LuMail, 
  LuBadgeCheck, 
  LuListChecks, 
  LuEye, 
  LuEyeOff 
} from 'react-icons/lu';
import axios from 'axios';

const LoginGroupeEnqueteur = () => {
  const [formData, setFormData] = useState({
    matricule: '',
    numero_groupe: '',
    grade: '',
    email: '',
    motdepasse: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useContext(AuthContext);

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/home');
    }
  }, [isAuthenticated, navigate]);

  // Prevent back navigation to dashboard after logout
  useEffect(() => {
    const handlePopstate = () => {
      if (isAuthenticated) {
        navigate('/');
      }
    };

    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error message when user starts typing
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
  
    try {
      const response = await axios.post('http://localhost:8081/groupe-enqueteur/login', {
        matricule: parseInt(formData.matricule, 10),
        numero_groupe: parseInt(formData.numero_groupe, 10),
        grade: formData.grade,
        email: formData.email,
        motdepasse: formData.motdepasse,
      });
  
      if (response.status === 200) {
        const userData = response.data;
        login(userData);
        
        // Navigate to dashboard or previous location
        const origin = location.state?.from?.pathname || '/dashboard/home';
        navigate(origin);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Échec de connexion. Veuillez vérifier vos informations.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex">
        {/* Image Section */}
        <div className="w-1/3 bg-blue-50 flex items-center justify-center p-8">
          <img
            src={`${process.env.PUBLIC_URL}/img/cirgn.jpg`}
            alt="logo"
            className="w-64 h-64 rounded-full border-4 border-blue-200 shadow-2xl object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-2/3">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center">
              <LuBadgeCheck className="mr-3 text-4xl" />
              Authentification
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Matricule Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matricule Chef de Groupe
              </label>
              <div className="flex items-center border-2 rounded-lg focus-within:border-blue-500 transition-all">
                <input 
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleChange}
                  placeholder="Entrez votre matricule"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none"
                  required
                />
                <LuUser2 className="text-blue-400 mr-4 text-xl" />
              </div>
            </div>

            {/* Groupe Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de Groupe
              </label>
              <div className="flex items-center border-2 rounded-lg focus-within:border-blue-500 transition-all">
                <select
                  name="numero_groupe"
                  value={formData.numero_groupe}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none"
                  required
                >
                  <option value="">Sélectionnez votre groupe</option>
                  <option value="1">Groupe 1</option>
                  <option value="2">Groupe 2</option>
                  <option value="3">Groupe 3</option>
                </select>
                <LuListChecks className="text-blue-400 mr-4 text-xl" />
              </div>
            </div>

            {/* Grade Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <div className="flex items-center border-2 rounded-lg focus-within:border-blue-500 transition-all">
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none"
                  required
                >
                  <option value="">Sélectionnez votre grade</option>
                  <option value="GPCE">GPCE</option>
                  <option value="GPHC">GPHC</option>
                  <option value="GP1C">GP1C</option>
                  <option value="GP2C">GP2C</option>
                  <option value="GHC">GHC</option>
                  <option value="G1C">G1C</option>
                  <option value="G2C">G2C</option>
                </select>
                <LuBadgeCheck className="text-blue-400 mr-4 text-xl" />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center border-2 rounded-lg focus-within:border-blue-500 transition-all">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre.email@gmail.com"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none"
                  required
                />
                <LuMail className="text-blue-400 mr-4 text-xl" />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="flex items-center border-2 rounded-lg focus-within:border-blue-500 transition-all">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="motdepasse"
                  value={formData.motdepasse}
                  onChange={handleChange}
                  placeholder="Entrez votre mot de passe"
                  className="w-full px-4 py-3 rounded-lg focus:outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="mr-4 focus:outline-none"
                >
                  {showPassword ? (
                    <LuEyeOff className="text-black text-xl" />
                  ) : (
                    <LuEye className="text-black text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`
                w-full py-3 rounded-lg text-white font-semibold transition-all
                ${isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                }
              `}
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-white mt-6 text-sm absolute bottom-4">
        <p>&copy; {new Date().getFullYear()} Système de Gestion. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default LoginGroupeEnqueteur;