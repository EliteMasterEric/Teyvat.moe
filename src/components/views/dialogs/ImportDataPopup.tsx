/**
 * Provides the interface for the popup which displays
 * when clicking "Import Data" or "Import Legacy Data" in the Options tab of the map controls.
 */

import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles,
} from '@material-ui/core';
import React, { cloneElement, FunctionComponent, ReactElement, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { t } from 'src/components/i18n/Localization';
import { InputTextArea } from 'src/components/interface/Input';
import { AppDispatch } from 'src/components/redux';
import { clearImportError, selectImportError } from 'src/components/redux/slices/error';
import { AppState } from 'src/components/redux/types';

import { SafeHTML } from 'src/components/util';
import DialogTitle from 'src/components/views/dialogs/DialogTitle';

const useStyles = makeStyles({
  dialog: {
    backgroundColor: '#f0e9e2',
  },
});

interface ImportDataPopupTriggerProps {
  className?: string;
  onClick: () => void;
}
interface ImportDataPopupBaseProps {
  title: string;
  content: string;
  contentSupports?: string;
  bookmarklet?: string;
  onConfirm: (textarea: string) => boolean;
  trigger: ReactElement<ImportDataPopupTriggerProps>;
}

const mapStateToProps = (state: AppState) => ({
  error: selectImportError(state),
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  clearError: () => dispatch(clearImportError()),
});
type ImportDataPopupStateProps = ReturnType<typeof mapStateToProps>;
type ImportDataPopupDispatchProps = ReturnType<typeof mapDispatchToProps>;
const connector = connect<
  ImportDataPopupStateProps,
  ImportDataPopupDispatchProps,
  ImportDataPopupBaseProps,
  AppState
>(mapStateToProps, mapDispatchToProps);

type ImportDataPopupProps = ConnectedProps<typeof connector> & ImportDataPopupBaseProps;

const _ImportDataPopup: FunctionComponent<ImportDataPopupProps> = ({
  title,
  content,
  contentSupports = null, // Leave null to avoid displaying.
  bookmarklet = '',
  onConfirm,
  trigger,
  error = '',
  clearError,
}) => {
  const [textarea, setTextarea] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const classes = useStyles();
  const closePopup = () => {
    clearError();
    setIsDialogOpen(false);
  };

  const onClickConfirm = () => {
    // Returns true if import was successful.
    const success = onConfirm(textarea);

    // If import was successful, close the popup window.
    // Else, leave the popup window open so we can display the import error.
    if (success) closePopup();
  };
  return (
    <div>
      {cloneElement(trigger, { onClick: () => setIsDialogOpen(true) })}
      <Dialog
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        fullWidth
        maxWidth="lg"
        onClose={() => {
          clearError();
          setIsDialogOpen(false);
        }}
      >
        <DialogTitle onClose={() => setIsDialogOpen(false)}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <SafeHTML>{content}</SafeHTML>
            {contentSupports && <SafeHTML>{contentSupports}</SafeHTML>}
            {bookmarklet !== '' ? (
              <>
                <SafeHTML>{t('bookmarklet-content')}</SafeHTML>
                <a href={bookmarklet}>{t('bookmarklet-click-link')}</a>
              </>
            ) : null}
          </DialogContentText>
          <InputTextArea
            value={textarea}
            onChange={(value) => setTextarea(value)}
            fullWidth
            error={error !== ''}
            helperText={error !== '' ? error : t('paste-here')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            color="primary"
            aria-label={t('cancel')}
            tabIndex={0}
            onClick={closePopup}
          >
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            aria-label={t('confirm')}
            tabIndex={0}
            onClick={onClickConfirm}
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const ImportDataPopup = connector(_ImportDataPopup);

export default ImportDataPopup;
