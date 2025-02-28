import {Platform} from 'react-native';
import {SurveyResponse} from './SurveyResponse';
import * as RNFS from '@dr.pogodin/react-native-fs';

const STORAGE_DIR =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath
    : RNFS.ExternalDirectoryPath;

const TO_UPLOAD_DIR = `to_upload`;
const UPLOADED_DIR = `uploaded`;

console.log({STORAGE_DIR});

export type ReadResponse = {
  response: SurveyResponse;
  uploaded: boolean;
};

export class SurveyResponseManager {
  async storeResponse(response: SurveyResponse) {
    const dir = `${STORAGE_DIR}/${response.schema.id}/${TO_UPLOAD_DIR}`;
    await RNFS.mkdir(dir);

    response.submittedAt = new Date();

    return RNFS.writeFile(
      `${dir}/${response.id}.json`,
      JSON.stringify(response.serialize()),
      'utf8',
    );
  }

  async uploadResponses() {
    const dirs = await RNFS.readDir(STORAGE_DIR);
    for (const dir of dirs) {
      if (dir.isDirectory() && dir.name !== UPLOADED_DIR) {
        const files = await RNFS.readDir(`${dir.path}/${TO_UPLOAD_DIR}`);
        for (const file of files) {
          //const contents = await RNFS.readFile(file.path);
          // Upload the contents to a server
          // ...
          // Move the file to the uploaded directory
          await RNFS.mkdir(`${dir.path}/${UPLOADED_DIR}`);
          await RNFS.moveFile(
            file.path,
            `${dir.path}/${UPLOADED_DIR}/${file.name}`,
          );
        }
      }
    }
  }

  async getResponses(): Promise<ReadResponse[]> {
    const responses: Array<ReadResponse> = [];

    console.log('get responses', STORAGE_DIR);
    console.log('wtf');
    const dirs = await RNFS.readDir(STORAGE_DIR);
    for (const dir of dirs) {
      console.log(dir);
      if (dir.isDirectory()) {
        const toUploadDir = `${dir.path}/${TO_UPLOAD_DIR}`;
        if (await RNFS.exists(toUploadDir)) {
          const toUploadFiles = await RNFS.readDir(toUploadDir);
          for (const file of toUploadFiles) {
            if (file.name.endsWith('.json')) {
              const contents = await RNFS.readFile(file.path, 'utf8');
              const response = SurveyResponse.fromJSON(JSON.parse(contents));
              responses.push({response, uploaded: false});
            }
          }
        }

        const uploadedDir = `${dir.path}/${UPLOADED_DIR}`;
        if (await RNFS.exists(uploadedDir)) {
          const uploadedFiles = await RNFS.readDir(uploadedDir);
          for (const file of uploadedFiles) {
            if (file.name.endsWith('.json')) {
              const contents = await RNFS.readFile(file.path, 'utf8');
              const response = SurveyResponse.fromJSON(JSON.parse(contents));
              responses.push({response, uploaded: true});
            }
          }
        }
      }
    }
    return responses;
  }
}
