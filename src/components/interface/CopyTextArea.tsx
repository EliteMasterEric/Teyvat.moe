/**
 * Provides text area which you can click to copy the contents of.
 * Includes tooltip text.
 */
import { TextField } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import Tooltip from 'react-tooltip';

import { t } from 'src/components/i18n/Localization';

interface CopyTextAreaProps {
  text: string;
  rows?: number;
}

/**
 * A text area which you can click to copy the contents of.
 *
 * @param {*} text The text to display in the textarea.
 * @param {*} others Any other parameters passed will be received by the text area.
 */
const CopyTextArea: FunctionComponent<CopyTextAreaProps> = ({ text, rows = 5, ...others }) => {
  const onClick = useCallback((event) => {
    (event.target as HTMLInputElement).select();
    document.execCommand('copy');
  }, []);
  return (
    <>
      <Tooltip />
      <TextField
        fullWidth
        data-tip={t('map-ui:popup-click-to-copy')}
        multiline
        InputProps={{
          readOnly: true,
        }}
        inputProps={{ style: { cursor: 'pointer' } }}
        onClick={onClick}
        rows={rows}
        value={text}
        {...others}
      />
    </>
  );
};

export default CopyTextArea;
