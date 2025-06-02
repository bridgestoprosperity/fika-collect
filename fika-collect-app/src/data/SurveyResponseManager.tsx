import {Platform} from 'react-native';
import {Buffer} from 'buffer';
import {SurveyResponse} from './SurveyResponse';
import type {Survey} from 'fika-collect-survey-schema';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {nanoid} from 'nanoid';
import {EventEmitter} from 'event-emitter3';
import version from '../version';

const STORAGE_DIR =
  Platform.OS === 'ios'
    ? RNFS.DocumentDirectoryPath
    : RNFS.ExternalDirectoryPath;

console.log(STORAGE_DIR);

// AWS API Gateway URL for uploading responses
// **DO NOT USE** since Vercel DNS prohibits setting up a second CAA (Certificate
// Authorization Authority) record for the domain, which is required for AWS
// Certificate Manager to issue a certificate. Without this, the API Gateway
// will not work with HTTPS.
//const BASE_URL = 'https://f54u12dkn2.execute-api.us-west-1.amazonaws.com';

const BASE_URL = 'https://app.fikadigital.org/api/v1';

const TO_UPLOAD_DIR = 'to_upload';
const UPLOADED_DIR = 'uploaded';
//const RESPONSE_ID_REGEX = /^[\d]{14}-[A-Za-z0-9_-]+$/;

export type ReadResponse = {
  response: SurveyResponse;
  uploaded: boolean;
};

function fileTypeFromExtension(extension: string) {
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'heic':
      return 'image/heic';
    default:
      return `image/${extension}`;
  }
}

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
      const questionDef = (response.schema as Survey).questions.find(
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
      if (file.name.endsWith('.json')) {
        continue;
      }
      if (!expectedImages.includes(file.name)) {
        continue;
      }

      if (!responseUpload.filesToUpload.includes(file.path)) {
        responseUpload.filesToUpload.push(file.path);
      }
    }

    if (!responseJsonUploaded) {
      try {
        const responseJson = JSON.parse(
          await RNFS.readFile(responseJsonPath, 'utf8'),
        );
        console.log(`Uploading response JSON for ${responseId}`);

        // TODO: abstract fetch to a separate function to ensure headers
        // and version are set correctly
        const httpResponse = await fetch(`${BASE_URL}/submit-survey`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Version': version.version,
          },
          body: JSON.stringify({response: responseJson}),
        });

        if (!httpResponse.ok) {
          const errorBody = await httpResponse.text();
          console.error(`Failed to upload response JSON: ${errorBody}`);
          throw new Error(
            `Failed to upload response JSON: ${httpResponse.statusText}`,
          );
        }
        console.log(`Successfully uploaded response JSON for ${responseId}`);
        await RNFS.moveFile(responseJsonPath, `${uploadedDir}/response.json`);
        responseUpload.jsonToUpload = undefined;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to upload response JSON: ${error.message}`);
        } else {
          throw new Error('Failed to upload response JSON: Unknown error');
        }
      }
    }

    for (const file of responseUpload.filesToUpload) {
      try {
        const filename = file.split('/').pop();
        if (!filename) {
          throw new Error(`Failed to extract filename from ${file}`);
        }
        const [imageId, extension] = filename.split('.');
        const fileType = fileTypeFromExtension(extension);

        const body = {
          file_type: fileType,
          survey_id: surveyId,
          response_id: responseId,
          image_id: imageId,
        };
        console.log(`Requesting presigned URL for image ${filename}`);
        const presignResponse = await fetch(`${BASE_URL}/presign-upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Version': version.version,
          },
          body: JSON.stringify(body),
        });

        if (!presignResponse.ok) {
          console.error(presignResponse);
          throw new Error(
            `Failed to get presigned URL: ${presignResponse.statusText}`,
          );
        }

        const {uploadURL} = await presignResponse.json();
        console.log(`Uploading image ${filename} to presigned URL`);

        const imageData = await RNFS.readFile(file, 'base64');
        const binaryData = Buffer.from(imageData, 'base64');
        const httpResponse = await fetch(uploadURL, {
          method: 'PUT',
          headers: {'Content-Type': fileType},
          body: binaryData,
        });

        if (!httpResponse.ok) {
          const errorBody = await httpResponse.text();
          console.error(`Failed to upload response JSON: ${errorBody}`);
          throw new Error(
            `Failed to upload image ${file}: ${httpResponse.statusText}`,
          );
        }
        console.log(`Successfully uploaded image ${filename}`);
        await RNFS.moveFile(file, `${uploadedDir}/${file.split('/').pop()}`);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to upload image ${file}: ${error.message}`);
        } else {
          throw new Error(`Failed to upload image ${file}: Unknown error`);
        }
      }
    }
  }

  async getResponses(): Promise<ReadResponse[]> {
    const responses: Array<ReadResponse> = [];

    const surveyDirs = await RNFS.readDir(STORAGE_DIR);
    for (const surveyDir of surveyDirs) {
      if (!(await surveyDir.isDirectory())) continue;

      for (const responseDir of await RNFS.readDir(surveyDir.path)) {
        if (!(await responseDir.isDirectory())) {
          continue;
        }

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

              let uploaded = true;
              for (const {value, type} of response.responses) {
                if (type !== 'photo') {
                  continue;
                }
                const photoToUploadPath = `${toUploadDir}/${value}`;
                if (await RNFS.exists(photoToUploadPath)) {
                  uploaded = false;
                  break;
                }
              }
              responses.push({response, uploaded});
            }
          }
        }
      }
    }
    return responses;
  }
}
