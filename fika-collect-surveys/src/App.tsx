import React from 'react';
import './App.css';
import Header from './components/Header';
import SurveyList from './components/SurveyList';

function App() {
  const [currentSurvey, setCurrentSurvey] = React.useState(null);

  return (
    <div className="app">
      <Header />
      <div className="app-content">{!currentSurvey && <SurveyList />}</div>
    </div>
  );
}

export default App;
