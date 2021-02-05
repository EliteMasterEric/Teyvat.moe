/**
 * Handles API calls to Imgur for uploading user images.
 */

import axios from 'axios';

import { t, f } from '~/components/i18n/Localization';

/**
 * The URL to send a post request to.
 */
const IMGUR_UPLOAD_URL = 'https://api.imgur.com/3/image';
/**
 * This is a PUBLIC API key used for Imgur services.
 * It does not need to be placed in a keystore.
 */
const CLIENT_ID = '0c84ca5aba54552';

const createFormData = async (file) => {
  const formData = new FormData();

  formData.append('image', file);

  return formData;
};

/**
 * Uploads a file to Imgur.
 * @param {*} file A file to upload.
 * @returns A Promise to upload the file and provide the URL, or an error.
 */
export const uploadImage = async (file) => {
  const formData = await createFormData(file);
  const config = {
    method: 'post',
    url: IMGUR_UPLOAD_URL,
    headers: {
      Authorization: `Client-ID ${CLIENT_ID}`,
    },
    data: formData,
  };
  return axios(config)
    .then((response) => {
      return response.data.data.link;
    })
    .catch((error) => {
      let localizedString = f('editor-image-upload-error-generic', {
        code: error?.response?.status?.error?.code ?? '???',
      });

      if (error.response) {
        switch (error.response.status) {
          case 400:
            if (error.response.status.error.code === 1003)
              localizedString = t('editor-image-upload-error-file-invalid-type');
            break;
          default:
            console.error(error.response);
            break;
        }
      }

      const newErr = {
        ...error,
        localizedString,
      };
      throw newErr;
    });
};
