import React from 'react';
import clsx from 'clsx';
import Tooltip from 'react-tooltip';
import { useDropzone } from 'react-dropzone';

import { t } from '../../Localization';

import './MapControlsEditorImageUploader.css';
import { uploadImage } from '../../api/imgur';
import { InputTextArea } from '../../Input';

/**
 * Handles several behaviors:
 *  * Allows users to enter an image URL into the box.
 *  * Dragging
 */
const MapControlsEditorImageUploader = ({ elementMedia, setElementMedia }) => {
  const [errorMsg, setErrorMsg] = React.useState('');

  const onDropAccepted = React.useCallback((acceptedFiles) => {
    setErrorMsg('progress');

    uploadImage(acceptedFiles[0])
      .then((imageUrl) => {
        setElementMedia(imageUrl);
        setErrorMsg('success');
      })
      .catch((error) => {
        setErrorMsg(error?.localizedString);
      });
  }, []);

  const onDropRejected = React.useCallback((fileRejections) => {
    setErrorMsg('error');

    if (fileRejections.length >= 1) {
      if (fileRejections[0]?.errors.length >= 1) {
        const errorCode = fileRejections[0]?.errors[0]?.code;
        setErrorMsg(t(`editor-image-upload-error-${errorCode}`));
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: ['image/jpeg', 'image/png'], // List of MIME types.
    maxFiles: 1,
    noClick: true, // Manually trigger click events using open().
    onDropAccepted,
    onDropRejected,
  });

  const uploadElementMedia = () => {
    open();
  };

  const message = () => {
    switch (errorMsg) {
      case '':
        return null;
      case 'success':
        return (
          <span className={clsx('map-controls-editor-element-image-success')}>
            {t('editor-image-upload-success')}
          </span>
        );
      case 'progress':
        return (
          <span className={clsx('map-controls-editor-element-image-progress')}>
            {t('editor-image-upload-progress')}
          </span>
        );
      default:
        return <span className={clsx('map-controls-editor-element-image-error')}>{errorMsg}</span>;
    }
  };

  // Note that react-dropzone overrides classNames,
  // meaning that inline styles must be used.
  return (
    <div {...getRootProps()} className={clsx('map-controls-editor-element-image')}>
      {/* The image URL. */}
      <div
        className={clsx(
          'map-controls-editor-element-image-url',
          'map-controls-editor-animation',
          isDragActive ? 'map-controls-editor-hidden' : 'map-controls-editor-animation-disabled'
        )}
      >
        <Tooltip />
        <span
          data-tip={t('editor-elements-media-tooltip')}
          className={clsx(
            'map-controls-editor-element-label',
            'map-controls-editor-animation',
            'label-tooltip'
          )}
        >
          {t('editor-elements-media')}
        </span>
        <InputTextArea
          placeholder={t('editor-elements-media-placeholder')}
          value={elementMedia}
          className={clsx('map-controls-editor-image-url', 'map-controls-editor-animation')}
          onChange={(value) => setElementMedia(value)}
        />
      </div>

      <Tooltip />

      {/* The uploaded image. */}
      <input {...getInputProps()} />
      <div
        data-tip={t('editor-image-upload-tooltip')}
        onClick={uploadElementMedia}
        onKeyDown={uploadElementMedia}
        role="button"
        aria-label="Upload"
        tabIndex={0}
        className={clsx(
          'nf',
          'map-controls-editor-element-button',
          'map-controls-editor-element-image-upload-button',
          'map-controls-editor-animation',
          'nf-mdi-cloud_upload',
          isDragActive
            ? 'map-controls-editor-element-image-upload-dropzone-active'
            : [
                'map-controls-editor-element-image-upload-dropzone-inactive',
                'map-controls-editor-animation-disabled',
              ]
        )}
      >
        {t('editor-image-upload-dropzone')}
      </div>
      {message()}
    </div>
  );
};

export default MapControlsEditorImageUploader;
