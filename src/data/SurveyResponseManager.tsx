import {Platform} from 'react-native';
import {SurveyResponse} from './SurveyResponse';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {nanoid} from 'nanoid';
import {EventEmitter} from 'event-emitter3';

const STORAGE_DIR =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath
    : RNFS.ExternalDirectoryPath;

console.log(STORAGE_DIR);

const TO_UPLOAD_DIR = `to_upload`;
const UPLOADED_DIR = `uploaded`;
const RESPONSE_ID_REGEX = /^[\d]{14}-[A-Za-z0-9_-]+$/;

export type ReadResponse = {
  response: SurveyResponse;
  uploaded: boolean;
};

class ResponseUpload {
  responseId: string;
  surveyId: string;
  responseDir: string;
  filesToUpload: string[] = [];
  jsonToUpload: string | undefined;

  constructor(responseId: string, surveyId: string, responseDir: string) {
    this.responseId = responseId;
    this.surveyId = surveyId;
    this.responseDir = responseDir;
  }
}

export class SurveyResponseManager extends EventEmitter {
  responseUploads = new Map<string, ResponseUpload>();

  async storeResponse(response: SurveyResponse) {
    const dir = `${STORAGE_DIR}/${response.schema.id}/${response.id}/${TO_UPLOAD_DIR}`;
    await RNFS.mkdir(dir);

    // Copy the images to the new directory, renaming them to a unique name and
    // updating the response object with the new file paths
    for (const resp of response.responses) {
      const questionDef = response.schema.questions.find(
        q => q.id === resp.question.id,
      );
      if (questionDef && questionDef.type === 'photo') {
        const imageUrl = resp.value;
        const extension = imageUrl.split('.').pop();
        const newFilename = `${nanoid()}.${extension}`;
        const newFilePath = `${dir}/${newFilename}`;
        await RNFS.copyFile(imageUrl, newFilePath);

        // Images break if we overwrite the value with a new path, so we use this
        // workaround to store the new filename in the response object without
        // changing the original value.
        resp.valueForSerialization = newFilename;
      }
    }

    response.submittedAt = new Date();

    return RNFS.writeFile(
      `${dir}/response.json`,
      JSON.stringify(response.serialize()),
      'utf8',
    );
  }

  async uploadResponse(response: SurveyResponse) {
    const responseId = response.id;
    const surveyId = response.schema.id;
    const responseDir = `${STORAGE_DIR}/${surveyId}/${responseId}`;

    console.log(
      `Starting upload for response ${responseId} of survey ${surveyId}`,
    );

    // Find or create a response upload
    let responseUpload = this.responseUploads.get(responseId);
    if (!responseUpload) {
      responseUpload = new ResponseUpload(responseId, surveyId, responseDir);
      this.responseUploads.set(responseId, responseUpload);
    }

    const toUploadDir = `${responseDir}/${TO_UPLOAD_DIR}`;
    const uploadedDir = `${responseDir}/${UPLOADED_DIR}`;
    await RNFS.mkdir(uploadedDir);

    let responseJsonUploaded = true;
    let responseJsonPath = `${uploadedDir}/response.json`;
    if (!(await RNFS.exists(responseJsonPath))) {
      responseJsonUploaded = false;
      responseJsonPath = `${toUploadDir}/response.json`;
      if (!(await RNFS.exists(responseJsonPath))) {
        console.warn('No response.json found in either directory');
        return;
      }
      responseUpload.jsonToUpload = responseJsonPath;
    }

    const expectedImages: string[] = [];
    if (await RNFS.exists(responseJsonPath)) {
      const responseJson = await RNFS.readFile(responseJsonPath, 'utf8');
      const parsedResponse = JSON.parse(responseJson);
      for (const resp of parsedResponse.responses) {
        const questionDef = parsedResponse.schema.questions.find(
          (q: any) => q.id === resp.question_id,
        );
        if (questionDef && questionDef.type === 'photo') {
          expectedImages.push(resp.value);
        }
      }
    }

    const files = await RNFS.readDir(toUploadDir);
    for (const file of files) {
      if (file.name.endsWith('.json')) continue;
      if (!expectedImages.includes(file.name)) continue;

      if (!responseUpload.filesToUpload.includes(file.path)) {
        responseUpload.filesToUpload.push(file.path);
      }
    }

    console.log(responseUpload);

    // Here you would add the actual upload logic, e.g., sending files to a server
    console.log(`Uploading response ${responseId} for survey ${surveyId}`);
    for (const filePath of responseUpload.filesToUpload) {
      console.log(`Uploading file: ${filePath}`);
      // Add your file upload logic here
    }
  }

  async uploadResponses() {
    const dirs = await RNFS.readDir(STORAGE_DIR);
    for (const surveyDir of dirs) {
      if (!surveyDir.isDirectory()) {
        continue;
      }

      const responses = await RNFS.readDir(surveyDir.path);
      for (const response of responses) {
        if (!response.isDirectory() || !RESPONSE_ID_REGEX.test(response.name)) {
          continue;
        }

        const responseId = response.name;
        const surveyId = surveyDir.name;
        const responseDir = response.path;

        // Find or create a response upload
        let responseUpload = this.responseUploads.get(responseId);
        if (!responseUpload) {
          responseUpload = new ResponseUpload(
            responseId,
            surveyId,
            responseDir,
          );
          this.responseUploads.set(responseId, responseUpload);
        }

        const toUploadDir = `${response.path}/${TO_UPLOAD_DIR}`;
        const uploadedDir = `${response.path}/${UPLOADED_DIR}`;
        await RNFS.mkdir(uploadedDir);

        let responseJsonPath = `${uploadedDir}/response.json`;
        if (!(await RNFS.exists(responseJsonPath))) {
          responseJsonPath = `${toUploadDir}/response.json`;
          if (!(await RNFS.exists(responseJsonPath))) {
            console.warn('No response.json found in either directory');
            continue;
          }
          responseUpload.filesToUpload.push(responseJsonPath);
        }

        const expectedImages: string[] = [];
        if (await RNFS.exists(responseJsonPath)) {
          const responseJson = await RNFS.readFile(responseJsonPath, 'utf8');
          const parsedResponse = JSON.parse(responseJson);
          for (const resp of parsedResponse.responses) {
            const questionDef = parsedResponse.schema.questions.find(
              (q: any) => q.id === resp.question_id,
            );
            if (questionDef && questionDef.type === 'photo') {
              expectedImages.push(resp.value);
            }
          }
        }

        const files = await RNFS.readDir(toUploadDir);
        for (const file of files) {
          if (file.name.endsWith('.json')) {
            continue;
          }
          if (!expectedImages.includes(file.name)) {
            console.warn('Unexpected file:', file.name);
            continue;
          }

          if (!responseUpload.filesToUpload.includes(file.path)) {
            responseUpload.filesToUpload.push(file.path);
          }
        }
      }
    }
    console.log([...this.responseUploads.values()]);
  }

  async getResponses(): Promise<ReadResponse[]> {
    const responses: Array<ReadResponse> = [];

    const surveyDirs = await RNFS.readDir(STORAGE_DIR);
    for (const surveyDir of surveyDirs) {
      if (!(await surveyDir.isDirectory())) continue;

      for (const responseDir of await RNFS.readDir(surveyDir.path)) {
        if (!(await responseDir.isDirectory())) continue;

        const toUploadDir = `${responseDir.path}/${TO_UPLOAD_DIR}`;
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

        const uploadedDir = `${responseDir.path}/${UPLOADED_DIR}`;
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
