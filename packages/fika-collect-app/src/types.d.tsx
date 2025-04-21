import {type SurveyResponse} from './data/SurveyResponse';

export type StackNavigationProp<ParamList> = {
  navigate: (name: keyof ParamList) => void;
  goBack: () => void;
};

export type SurveyParams = {
  response: SurveyResponse;
};

export type SurveyQuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'long_answer'
  | 'location'
  | 'photos';

export type SurveyQuestion = {
  id: string;
  type: SurveyQuestionType;
  question: string;
  hint?: string;
  required: boolean;
  options?: string[];
};
