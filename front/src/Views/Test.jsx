import React from "react";
import {
  BiAccessibility,
  BiBookAlt,
  BiCommentAdd,
  BiHome,
  BiMoney,
  BiServer,
  BiUser,
} from "react-icons/bi";
import { Link, Outlet } from "react-router-dom";

function Test() {
  return (
    <div className="container">
      <div className="navigation">
        <div className="Information">
       
        </div>
        <ul>
          <li>
            <Link to="/" className="link">
              <BiHome className="icon" />
              <span className="title">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/patient" className="link">
              <BiUser className="icon" />
              <span className="title">Patient</span>
            </Link>
          </li>
          <li>
            <Link to="/Docteur" className="link">
              <BiAccessibility className="icon" />
              <span className="title">Docteur</span>
            </Link>
          </li>
          <li>
            <Link to="/Rendezvous" className="link">
              <BiCommentAdd className="icon" />
              <span className="title">Rendez-vous</span>
            </Link>
          </li>
          <li>
            <Link to="/Controle" className="link">
              <BiMoney className="icon" />
              <span className="title">Controle</span>
            </Link>
          </li>
          <li>
            <Link to="/Ordonnance" className="link">
              <BiBookAlt className="icon" />
              <span className="title">Ordonnance</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Test;
