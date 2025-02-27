import {createContext} from 'react';
import {SurveyResponseManager} from './SurveyResponseManager';

export default createContext<SurveyResponseManager>(
  new SurveyResponseManager(),
);
