import React from 'react';
import ReactDOM from 'react-dom/client';
import SurveyList from './components/SurveyList';
import SurveyEditor from './components/SurveyEditor';
import './bootstrap.min.css';

import {createBrowserRouter, RouterProvider} from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SurveyList />,
  },
  {
    path: '/surveys/:surveyId/edit',
    element: <SurveyEditor />,
  },
]);
const theme =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

document.documentElement.setAttribute('data-bs-theme', theme);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<RouterProvider router={router} />);
