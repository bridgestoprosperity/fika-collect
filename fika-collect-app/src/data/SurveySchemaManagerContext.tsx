//import * as React from 'react';
import {createContext} from 'react';
import {SurveySchemaManager} from './SurveySchemaManager';

export default createContext<SurveySchemaManager>(new SurveySchemaManager());
