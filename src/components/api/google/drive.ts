/**
 * Contains functions which access Google's Drive API and reads/writes data.
 * @see: https://developers.google.com/drive/api/v3/appdata
 */

import { gapi } from 'gapi-script';
import { result } from 'lodash';
import { t } from 'src/components/i18n/Localization';
import { sendNotification } from 'src/components/redux/dispatch';

export const handleDriveError = (err: gapi.client.HttpRequestRejected) => {
  console.error('[GOOGLE] An error occurred while interacting with Google Drive.');
  switch (err.status) {
    case 403:
      console.error(
        '[GOOGLE] A 403 Forbidden error occurred. Are your permissions configured improperly?'
      );
      console.error(`[GOOGLE] ${err?.result?.error?.message}`);
      break;
    default:
      console.error(`[GOOGLE] A ${err.status} error occurred.`);
      console.error(err);
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
      console.log('[GOOGLE] Created a new blank file.');
      return response?.result?.id ?? null;
    });
};

/**
 * Will create the file if it doesn't exist.
 */
const getIdByFilename = async (
  filename: string,
  create: boolean = true
): Promise<string | null> => {
  return gapi.client.drive.files
    .list({
      q: `name='${filename}'`, // Search query.
      spaces: 'appDataFolder', // Search only our application data folder.
      fields: 'nextPageToken, files(id, name)',
      pageSize: 10,
    })
    .then((response: any) => {
      const files = response.result.files;
      if (files.length == 0) {
        if (create) {
          // Create a new file and return its ID.
          console.log('[GOOGLE] Creating new file and returning its ID.');
          return createBlankFile(filename);
        } else {
          console.log('[GOOGLE] No file existed. Returning null.');
          // No file exists.
          return null;
        }
      } else {
        // Else use an existing file.
        console.log('[GOOGLE] Reusing an existing file.');
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
      console.log('[GOOGLE] File upload successful.');
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
      console.log('[GOOGLE] File download successful.');
      return response;
    });
};

export const createOrUpdateFile = async (filename: string, contents: string) => {
  return getIdByFilename(filename).then((fileId: string | null) => {
    if (fileId != null) {
      console.log(`[GOOGLE] Updating file ID ${fileId}...`);
      return updateContentsById(fileId, contents);
    } else {
      console.log('[GOOGLE] Failed to create new file to update.');
      return null;
    }
  });
};

export const getFileContents = async (filename: string) => {
  return getIdByFilename(filename, false).then((fileId: string | null) => {
    if (fileId != null) {
      console.log(`[GOOGLE] Retrieving contents of file ID ${fileId}...`);
      return downloadContentsById(fileId);
    } else {
      console.log('[GOOGLE] Attempted to retrieve contents of a file that did not exist.');
      return null;
    }
  });
};

export const listFiles = () => {
  gapi.client.drive.files
    .list({
      spaces: 'appDataFolder', // Search only our application data folder.
      pageSize: 10,
      fields: 'nextPageToken, files(id, name)',
    })
    .then((response: any) => {
      console.log('Listing files completed.');
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log(file.name + ' (' + file.id + ')');
        }
      } else {
        console.log('No files found.');
      }
    });
};
