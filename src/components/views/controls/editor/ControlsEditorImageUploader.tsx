/**
 * Provides the control which handles the media field of a marker or route
 * in the Editor tab of the map Controls.
 */

import { Box, IconButton, Tooltip, makeStyles, Typography } from '@material-ui/core';
import { CloudUpload as CloudUploadIcon } from '@material-ui/icons';
import clsx from 'clsx';
import React, { useState, useCallback, FunctionComponent } from 'react';
import { useDropzone } from 'react-dropzone';

import { uploadImage } from 'src/components/api/imgur';
import { t } from 'src/components/i18n/Localization';
import { InputTextField } from 'src/components/interface/Input';

const useStyles = makeStyles((_theme) => ({
  root: {
    margin: '8px 0 0 0',
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
  const [errorMsg, setErrorMsg] = useState('');

  // Call when the files were accepted (correct file type etc.), and can be uploaded.
  const onDropAccepted = useCallback(
    (acceptedFiles) => {
      setErrorMsg('progress');

      uploadImage(acceptedFiles[0])
        .then((imageUrl) => {
          setElementMedia(imageUrl);
          setErrorMsg('success');
        })
        .catch((error) => {
          setErrorMsg(error.localizedString);
        });
    },
    [setElementMedia]
  );

  // Call when the files were rejected (bad file type etc.).
  const onDropRejected = useCallback((fileRejections) => {
    setErrorMsg('error');

    if (fileRejections.length >= 1) {
      if (fileRejections[0].errors.length >= 1) {
        const errorCode = fileRejections[0].errors[0].code;
        setErrorMsg(t(`image-upload-error-${errorCode}`));
      }
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
    switch (errorMsg) {
      case '':
        return null;
      case 'success':
        return (
          <Typography className={classes.imageUploadMessage} style={{ color: 'green' }}>
            {t('image-upload-success')}
          </Typography>
        );
      case 'progress':
        return (
          <Typography className={classes.imageUploadMessage} style={{ color: 'orangered' }}>
            {t('image-upload-progress')}
          </Typography>
        );
      default:
        return (
          <Typography className={classes.imageUploadMessage} style={{ color: 'red' }}>
            {errorMsg}
          </Typography>
        );
    }
  };

  // Note that react-dropzone overrides classNames,
  // meaning that inline styles must be used.
  return (
    <Box display="flex" flexDirection="column" className={classes.root}>
      <Box display="flex" flexDirection="row" alignItems="center" {...getRootProps()}>
        {/* The image URL. */}
        <InputTextField
          label={t('media-url')}
          helperText={t('media-url-hint')}
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
          onChange={(value) => setElementMedia(value)}
        />

        {/* The uploaded image. */}
        <input {...getInputProps()} />

        <Tooltip title={t('image-upload-tooltip')}>
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
            <Typography className={classes.dropzoneButtonText}>
              {t('image-upload-dropzone')}
            </Typography>
          </IconButton>
        </Tooltip>
      </Box>
      {message()}
    </Box>
  );
};

export default ControlsEditorImageUploader;
