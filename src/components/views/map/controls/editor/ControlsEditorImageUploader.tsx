/**
 * Provides the control which handles the media field of a marker or route
 * in the Editor tab of the map Controls.
 */

import { Box, IconButton, Tooltip, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import React, { useState, useCallback, FunctionComponent } from 'react';
import { useDropzone } from 'react-dropzone';

import { uploadImage } from 'src/components/api/imgur';
import { LocalizedTypography, t } from 'src/components/i18n/Localization';
import { InputTextField } from 'src/components/interface/Input';

const useStyles = makeStyles((_theme) => ({
  root: {
    margin: '0 0 0 0',
  },
  dropzoneButtonRoot: {
    backgroundColor: '#313131',
    color: '#1bb76e',
    '&:hover': {
      // Subclass which applies when hovering.
      backgroundColor: '#616161',
    },
    fontSize: 0,
  },
  dropzoneButtonText: {
    fontSize: 'inherit',
  },
  dropzoneButtonLabel: {
    flexDirection: 'column',
  },
  dropzoneButtonRootDragActive: {
    borderRadius: '24px',
    borderWidth: '2px',
    borderStyle: 'dashed',
    borderColor: '#1bb76e',
    padding: 20,
    flexGrow: 1,
    fontSize: 12,
  },
  imageUploadMessage: {
    flexGrow: 1,
    width: '100%',
    fontSize: '0.8em',
  },

  mediaUrlTextField: {
    flexGrow: 1,
    marginRight: 4,
    fontSize: 0,
  },

  animationMediaUrlTextField: {
    width: 0,
    opacity: 0,
    overflow: 'hidden',
    flexGrow: 0,
    fontSize: '1em',
  },

  animationMediaUrlTextFieldHelperText: {
    width: 0,
    opacity: 0,
    // height: 0,
    whiteSpace: 'nowrap',
  },

  animationOff: {
    '-webkit-transition': 'all 0s',
    '-moz-transition': 'all 0s',
    '-o-transition': 'all 0s',
    transition: 'all 0s',
  },
  animationOn: {
    '-webkit-transition': 'all 0.5s',
    '-moz-transition': 'all 0.5s',
    '-o-transition': 'all 0.5s',
    transition: 'all 0.5s',
  },
}));

interface ControlsEditorImageUploaderProps {
  elementMedia: string;
  setElementMedia: (value: string) => void;
}

/**
 * Handles several behaviors:
 *  * Allows users to enter an image or YouTube URL into the box.
 *  * Dragging an image will upload to Imgur.
 */
const ControlsEditorImageUploader: FunctionComponent<ControlsEditorImageUploaderProps> = ({
  elementMedia,
  setElementMedia,
}) => {
  const classes = useStyles();

  // The success or failure message to display.
  const [errorMessage, setErrorMessage] = useState('');

  // Call when the files were accepted (correct file type etc.), and can be uploaded.
  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      setErrorMessage('progress');

      uploadImage(acceptedFiles[0])
        .then((imageUrl) => {
          setElementMedia(imageUrl);
          setErrorMessage('success');
        })
        .catch((error) => {
          setErrorMessage(error.localizedString);
        });
    },
    [setElementMedia]
  );

  // Call when the files were rejected (bad file type etc.).
  const onDropRejected = useCallback((fileRejections) => {
    setErrorMessage('error');

    if (fileRejections.length > 0 && fileRejections[0].errors.length > 0) {
      const errorCode = fileRejections[0].errors[0].code;
      setErrorMessage(t(`map-ui:image-upload-error-${errorCode}`));
    }
  }, []);

  // Create a dropzone.
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: ['image/jpeg', 'image/png'], // List of MIME types.
    maxFiles: 1,
    noClick: true, // Manually trigger click events using open().
    onDropAccepted,
    onDropRejected,
  });

  // Open the file dialog when clicking the button.
  const uploadElementMedia = () => {
    open();
  };

  const message = () => {
    switch (errorMessage) {
      case '':
        return null;
      case 'success':
        return (
          <LocalizedTypography
            className={classes.imageUploadMessage}
            style={{ color: 'green' }}
            i18nKey="map-ui:image-upload-success"
          />
        );
      case 'progress':
        return (
          <LocalizedTypography
            className={classes.imageUploadMessage}
            style={{ color: 'orangered' }}
            i18nKey="map-ui:image-upload-progress"
          />
        );
      default:
        return (
          <Typography className={classes.imageUploadMessage} style={{ color: 'red' }}>
            {errorMessage}
          </Typography>
        );
    }
  };

  const changeElementMedia = useCallback((value) => setElementMedia(value), []);

  // Note that react-dropzone overrides classNames,
  // meaning that inline styles must be used.
  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      <Box display="flex" flexDirection="row" alignItems="center" {...getRootProps()}>
        {/* The image URL. */}
        <InputTextField
          label={t('map-ui:media-url')}
          helperText={t('map-ui:media-url-hint')}
          FormHelperTextProps={{
            className: clsx(
              isDragActive
                ? [classes.animationMediaUrlTextFieldHelperText, classes.animationOn]
                : [classes.animationOff]
            ),
          }}
          value={elementMedia}
          classes={{
            root: clsx(
              classes.mediaUrlTextField,
              isDragActive
                ? [classes.animationMediaUrlTextField, classes.animationOn]
                : [classes.animationOff]
            ),
          }}
          onChange={changeElementMedia}
        />

        {/* The uploaded image. */}
        <input {...getInputProps()} />

        <Tooltip title={t('map-ui:image-upload-tooltip')}>
          <IconButton
            color="secondary"
            onClick={uploadElementMedia}
            classes={{
              root: clsx(
                classes.dropzoneButtonRoot,
                isDragActive
                  ? [classes.dropzoneButtonRootDragActive, classes.animationOn]
                  : [classes.animationOff]
              ),
              label: classes.dropzoneButtonLabel,
            }}
          >
            <CloudUploadIcon />
            <LocalizedTypography
              i18nKey="map-ui:image-upload-dropzone"
              className={classes.dropzoneButtonText}
            />
          </IconButton>
        </Tooltip>
      </Box>
      {message()}
    </Box>
  );
};

export default ControlsEditorImageUploader;
