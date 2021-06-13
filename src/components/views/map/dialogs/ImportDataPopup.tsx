/**
 * Provides the interface for the popup which displays
 * when clicking "Import Data" or "Import Legacy Data" in the Options tab of the map controls.
 */

import { Button, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { cloneElement, FunctionComponent, ReactElement, useCallback, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { LocalizedSafeHTML, t } from 'src/components/i18n/Localization';
import { InputTextArea } from 'src/components/interface/Input';
import { clearImportError } from 'src/components/redux/slices/map/error/Actions';
import { selectImportError } from 'src/components/redux/slices/map/error/Selector';

import { AppState } from 'src/components/redux/Types';
import { SafeHTML } from 'src/components/util';
import DialogTitle from 'src/components/views/map/dialogs/DialogTitle';

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
  externalLink?: string;
  onConfirm: (textarea: string) => boolean;
  trigger: ReactElement<ImportDataPopupTriggerProps>;
}

const mapStateToProps = (state: AppState) => ({
  error: selectImportError(state),
});
const mapDispatchToProps = {
  clearImportError,
};
type ImportDataPopupStateProps = ReturnType<typeof mapStateToProps>;
type ImportDataPopupDispatchProps = typeof mapDispatchToProps;
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
  externalLink = '',
  onConfirm,
  trigger,
  error = '',
  clearImportError,
}) => {
  const [textarea, setTextarea] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const classes = useStyles();

  const onOpen = useCallback(() => setIsDialogOpen(true), []);

  const onClose = useCallback(() => {
    clearImportError();
    setIsDialogOpen(false);
  }, []);

  const onClickConfirm = () => {
    // Returns true if import was successful.
    const success = onConfirm(textarea);

    // If import was successful, close the popup window.
    // Else, leave the popup window open so we can display the import error.
    if (success) onClose();
  };

  return (
    <div>
      {cloneElement(trigger, { onClick: onOpen })}
      <Dialog
        PaperProps={{ className: classes.dialog }}
        open={isDialogOpen}
        fullWidth
        maxWidth="lg"
        onClose={onClose}
      >
        <DialogTitle onClose={onClose}>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <SafeHTML>{content}</SafeHTML>
            {contentSupports && <SafeHTML>{contentSupports}</SafeHTML>}
            {bookmarklet !== '' ? (
              <>
                <LocalizedSafeHTML i18nKey="map-ui:bookmarklet-content" />
                <a href={bookmarklet}>{t('map-ui:bookmarklet-click-link')}</a>
              </>
            ) : null}
            {externalLink !== '' ? (
              <>
                <a href={externalLink} target="_blank" rel="noopener noreferrer">
                  {t('map-ui:click-me')}
                </a>
              </>
            ) : null}
          </DialogContentText>
          <InputTextArea
            value={textarea}
            onChange={setTextarea}
            fullWidth
            error={error !== ''}
            helperText={error !== '' ? error : t('map-ui:paste-here')}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            color="primary"
            aria-label={t('cancel')}
            tabIndex={0}
            onClick={onClose}
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
