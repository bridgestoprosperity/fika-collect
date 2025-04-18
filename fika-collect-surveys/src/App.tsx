import React from 'react';
import {useEffect, useState} from 'react';
import './App.css';
import Header from './components/Header';
import SurveyEditor from './components/SurveyEditor';
import SurveyList from './components/SurveyList';
import createResolver from './utils/resolveRoute';
import {useNavigation} from './hooks/navigation';

function sanitizeHash(hash: string) {
  hash = hash.replace('#', '');
  if (hash === '/') hash = '';
  return hash || null;
}

const resolveRoute = createResolver({
  '/': SurveyList,
  '/surveys/:surveyId/edit': SurveyEditor,
});

function App() {
  const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(
    sanitizeHash(window.location.hash),
  );

  const navigate = useNavigation();

  const {Component, props} = resolveRoute(currentSurveyId);

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setCurrentSurveyId(sanitizeHash(window.location.hash));
    });
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        {Component === SurveyEditor ? (
          <Component {...props} />
        ) : (
          <SurveyList setCurrentSurveyId={setCurrentSurveyId} />
        )}
      </div>
    </div>
  );
}

export default App;
