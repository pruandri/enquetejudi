import React, { useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { CgFolder, CgTranscript } from "react-icons/cg";
import { Link } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { Container, Typography, Button } from "@mui/material";
import { SiGooglemaps } from "react-icons/si";
import { FaLock, FaKey, FaBalanceScale, FaUser } from "react-icons/fa";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import '../styles/sidebar.css';

// Importer le fichier CSS
import './sidebar.css';

const Sidebar = () => {
  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <div className="logo mb-4">
                    <img src={`${process.env.PUBLIC_URL}/img/gendarme.jpg`} alt="logo" className="w-32 h-auto rounded-md" />
                </div>
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to="/dashboard/home"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <IoHomeOutline className="w-5 h-5" />
              <span className="ms-3">Accueil</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/unique"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <CgFolder className="w-5 h-5" />
              <span className="ms-3">Gestion des PV Uniques</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/separe"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <CgTranscript className="w-5 h-5" />
              <span className="ms-3">Gestion des PV séparés</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/judiciaire"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaLock  className="w-5 h-5" />
              <span className="ms-3">Gestion des PV sur Renseignements Judiciaires </span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/archives"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaBalanceScale className="w-5 h-5" />
              <span className="ms-3">Gestion des PV aux archives</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/enqueteurs"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaUser className="w-5 h-5" />
              <span className="ms-3">Gestion des Enquêteurs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaKey className="w-5 h-5" />
              <span className="ms-3">Sécurité et confidentialité </span>
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <CiLogout className="w-5 h-5" />
              <span className="ms-3">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
