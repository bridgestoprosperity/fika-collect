import React from 'react';
import './Header.css';
import Link from './Link';

export default function Header() {
  return (
    <header className="header">
      <h1>
        <Link to="/" confirm={() => true}>
          Fika Collect Survey Editor
        </Link>
      </h1>
    </header>
  );
}
