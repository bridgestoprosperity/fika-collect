import React from 'react';
import './AppContainer.css';
import Header from './Header';

interface AppContainerProps {
  children: React.ReactNode;
}

export default function AppContainer({children}: AppContainerProps) {
  return (
    <div className="app">
      <Header />
      <div
        className="container-sm"
        style={{maxWidth: '800px', margin: '0 auto'}}>
        {children}
      </div>
    </div>
  );
}
