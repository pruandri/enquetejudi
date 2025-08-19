import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../services/AuthContext';
import { 
  Home, 
  Folder, 
  FileText, 
  Users, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Phone, 
  Mail, 
  Globe 
} from 'lucide-react';

const Nav = () => {
  const [isFormePVOpen, setFormePVOpen] = useState(false);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ icon: Icon, label, to, onClick, isActive = false, children }) => (
    <div className="nav-item">
      <Link 
        to={to} 
        onClick={onClick}
        className={`
          flex items-center 
          p-3 
          rounded-lg 
          transition-all 
          duration-200 
          ease-in-out
          ${isActive ? 'bg-blue-100 text-blue-700' : 'hover:bg-blue-100'}
          ${isCompactMode ? 'justify-center' : 'justify-start'}
        `}
      >
        <Icon className="w-5 h-5 text-blue-600" />
        {!isCompactMode && (
          <span className="ml-3 text-sm font-medium text-blue-900">{label}</span>
        )}
      </Link>
      {children && !isCompactMode && children}
    </div>
  );

  const DropdownNavItem = ({ icon: Icon, label, children }) => (
    <div className="relative">
      <button 
        onClick={() => setFormePVOpen(!isFormePVOpen)}
        className={`
          flex items-center 
          w-full 
          p-3 
          rounded-lg 
          transition-all 
          duration-200 
          ease-in-out 
          hover:bg-blue-100
          ${isCompactMode ? 'justify-center' : 'justify-between'}
        `}
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-blue-600" />
          {!isCompactMode && (
            <span className="ml-3 text-sm font-medium text-blue-900">{label}</span>
          )}
        </div>
        {!isCompactMode && (
          isFormePVOpen ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-blue-600" />
        )}
      </button>
      {isFormePVOpen && !isCompactMode && (
        <div className="pl-4 space-y-2 mt-2">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className={`
      sidebar 
      bg-white 
      border-r 
      border-blue-200 
      h-screen 
      flex 
      flex-col 
      transition-all 
      duration-300 
      ease-in-out
      ${isCompactMode ? 'w-20' : 'w-64'}
      shadow-lg
    `}>
      {/* Header with Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-blue-900 bg-blue-900">
        {!isCompactMode && (
          <div className="flex flex-col items-center">
          <h1 className="text-lg font-bold text-white mb-1 text-center">
            GESTION DES <br />PROCÈS-VERBAUX
            D'ENQUÊTES JUDICIAIRES
          </h1>
          <img 
            src={`${process.env.PUBLIC_URL}/img/gendarme.jpg`} 
            alt="Gendarmerie Logo" 
            className="h-16 w-auto rounded-full mt-2"
          />
        </div>
        
        )}
        <button 
          onClick={() => setIsCompactMode(!isCompactMode)}
          className="p-2 rounded-full hover:bg-blue-100 transition-all"
          aria-label="Toggle sidebar"
        >
          {isCompactMode ? '▶' : '◀'}
        </button>
      </div>

      {/* Navigation Items */}
<nav className="flex-grow p-4 overflow-y-auto bg-gray-100 border-r border-gray-300">
  <div className="space-y-6"> {/* Espacement plus important entre les éléments */}
    {/* Lien principal */}
    <NavItem 
      icon={Home} 
      label="Accueil" 
      to="/Dashboard/Home"
      className="text-2xl font-bold text-gray-900 hover:text-blue-600" // Texte principal plus grand
    />

    {/* Menu déroulant */}
    <DropdownNavItem 
      icon={Folder} 
      label="FORME PV" 
      className="text-2xl font-bold text-gray-900 hover:text-blue-600"
    >
      <NavItem 
        icon={FileText} 
        label="PV Uniques" 
        to="/dashboard/unique"
        className="pl-8 text-xl text-gray-700 hover:text-blue-500" // Texte sous-menu plus grand
      />
      <NavItem 
        icon={Folder} 
        label="PV Séparés" 
        to="/dashboard/separe"
        className="pl-8 text-xl text-gray-700 hover:text-blue-500"
      />
    </DropdownNavItem>

    {/* Liens simples */}
    <NavItem 
      icon={FileText} 
      label="PV Sur Renseignements Judiciaires" 
      to="/dashboard/judiciaire"
      className="text-2xl font-bold text-gray-900 hover:text-blue-600"
    />

    <NavItem 
      icon={Folder} 
      label="PV Aux Archives" 
      to="/dashboard/archives"
      className="text-2xl font-bold text-gray-900 hover:text-blue-600"
    />

    <NavItem 
      icon={Users} 
      label="Gérer les Enquêteurs" 
      to="/dashboard/enqueteurs"
      className="text-2xl font-bold text-gray-900 hover:text-blue-600"
    />
  </div>
</nav>


      {/* Footer with Contact Information */}
      {!isCompactMode && (
        <div className="p-4 border-t border-blue-200 bg-blue-50">
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 text-blue-900">Assistance</h3>
            <div className="space-y-1 text-xs text-blue-700">
              <p className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-600" /> 
                andrimalalaprudence@gmail.com
              </p>
              <p className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-600" /> 
                +261 34 96 166 10
              </p>
              <a 
                href="http://www.gendarmerie.gov.mg" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-700 hover:text-blue-900 hover:underline"
              >
                <Globe className="w-4 h-4 mr-2 text-blue-600" />
                www.gendarmerie.gov.mg
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className={`p-4 ${isCompactMode ? 'text-center' : ''}`}>
        <button 
          onClick={handleLogout}
          className={`
            flex items-center 
            bg-blue-600 
            text-white 
            hover:bg-blue-700 
            rounded-lg 
            p-3 
            transition-all 
            duration-200 
            ease-in-out
            ${isCompactMode ? 'justify-center' : 'justify-start'}
          `}
        >
          <LogOut className="w-5 h-5" />
          {!isCompactMode && (
            <span className="ml-3 text-sm font-medium">Déconnexion</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Nav;