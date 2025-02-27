import {Platform} from 'react-native';
import {type SurveyResponse} from './SurveyResponse';
import * as RNFS from '@dr.pogodin/react-native-fs';

const STORAGE_DIR =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath
    : RNFS.ExternalDirectoryPath;

console.log({STORAGE_DIR});

export class SurveyResponseManager {
  async storeResponse(response: SurveyResponse) {
    await RNFS.mkdir(`${STORAGE_DIR}/${response.schema.id}`).then(success => {
      console.log({success});
    });

    return RNFS.writeFile(
      `${STORAGE_DIR}/${response.schema.id}/${response.id}.json`,
      JSON.stringify(response.serialize()),
      'utf8',
    ).then(success => {
      console.log({success});
    });
  }
}
