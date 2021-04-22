/**
 * Contains functions which access Google's Drive API and reads/writes data.
 * @see: https://developers.google.com/drive/api/v3/appdata
 */

import { gapi } from 'gapi-script';

export const handleDriveError = (error: gapi.client.HttpRequestRejected): void => {
  console.error('[GOOGLE] An error occurred while interacting with Google Drive.');
  switch (error.status) {
    case 403:
      console.error(
        '[GOOGLE] A 403 Forbidden error occurred. Are your permissions configured improperly?'
      );
      console.error(`[GOOGLE] ${error?.result?.error?.message}`);
      break;
    default:
      console.error(`[GOOGLE] A ${error.status} error occurred.`);
      console.error(error);
      break;
  }
};

/*
.catch((error) => {
  handleDriveError(error);
  return null;
})
*/

const createBlankFile = async (filename: string): Promise<string | null> => {
  return gapi.client.drive.files
    .create({
      resource: {
        name: filename,
        parents: ['appDataFolder'],
        mimeType: 'application/json',
      },
      fields: 'id',
    })
    .then((response) => {
      console.debug('[GOOGLE] Created a new blank file.');
      return response?.result?.id ?? null;
    });
};

/**
 * Will create the file if it doesn't exist.
 */
const getIdByFilename = async (filename: string, create = true): Promise<string | null> => {
  return gapi.client.drive.files
    .list({
      q: `name='${filename}'`, // Search query.
      spaces: 'appDataFolder', // Search only our application data folder.
      fields: 'nextPageToken, files(id, name)',
      pageSize: 10,
    })
    .then((response: any) => {
      const files = response.result.files;
      if (files.length === 0) {
        if (create) {
          // Create a new file and return its ID.
          console.debug('[GOOGLE] Creating new file and returning its ID.');
          return createBlankFile(filename);
        } else {
          console.debug('[GOOGLE] No file existed. Returning null.');
          // No file exists.
          return null;
        }
      } else {
        // Else use an existing file.
        console.debug('[GOOGLE] Reusing an existing file.');
        return files[0].id;
      }
    });
};

const FILE_UPLOAD_BASE_ARGS = {
  method: 'PATCH',
  params: {
    uploadType: 'media',
    mimeType: 'application/json',
  },
};
// Append the fileId to this.
const FILE_UPLOAD_BASE_URL = '/upload/drive/v3/files';

const updateContentsById = async (fileId: string, body: string) => {
  const path = `${FILE_UPLOAD_BASE_URL}/${fileId}`;
  return gapi.client
    .request({
      ...FILE_UPLOAD_BASE_ARGS,
      path,
      body,
    })
    .then((response) => {
      console.debug('[GOOGLE] File upload successful.');
      return response;
    });
};

const downloadContentsById = async (fileId: string) => {
  return gapi.client.drive.files
    .get({
      fileId,
      alt: 'media', // Get the file contents too, not just metadata.
    })
    .then((response) => {
      console.debug('[GOOGLE] File download successful.');
      return response;
    });
};

export const createOrUpdateFile = async (
  filename: string,
  contents: string
): Promise<ReturnType<typeof updateContentsById> | null> => {
  return getIdByFilename(filename).then((fileId: string | null) => {
    if (fileId != null) {
      console.debug(`[GOOGLE] Updating file ID ${fileId}...`);
      return updateContentsById(fileId, contents);
    } else {
      console.debug('[GOOGLE] Failed to create new file to update.');
      return null;
    }
  });
};

export const getFileContents = async (
  filename: string
): Promise<gapi.client.Response<gapi.client.drive.File> | null> => {
  return getIdByFilename(filename, false).then((fileId: string | null) => {
    if (fileId != null) {
      console.debug(`[GOOGLE] Retrieving contents of file ID ${fileId}...`);
      return downloadContentsById(fileId);
    } else {
      console.debug('[GOOGLE] Attempted to retrieve contents of a file that did not exist.');
      return null;
    }
  });
};
