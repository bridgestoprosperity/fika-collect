import React from 'react';
import './Header.css';
import {NavLink} from 'react-router';

export default function Header() {
  return (
    <nav className="header navbar navbar-expand-lg">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Fika Collect Survey Editor
        </NavLink>
        {/*
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
            </ul>
          </div>
          */}
      </div>
    </nav>
  );
}
