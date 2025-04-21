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

document.documentElement.setAttribute('data-bs-theme', 'dark');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(<RouterProvider router={router} />);
