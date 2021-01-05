/**
 * Provides text area which you can click to copy the contents of.
 * Includes tooltip text.
 */
import { TextField } from '@material-ui/core';
import React from 'react';
import Tooltip from 'react-tooltip';

import { t } from '~/components/i18n/Localization';

/**
 * A text area which you can click to copy the contents of.
 *
 * @param {*} text The text to display in the textarea.
 * @param {*} others Any other parameters passed will be received by the text area.
 */
const CopyTextArea = ({ text, rows = 10, ...others }) => {
  const copyText = (event) => {
    event.target.select();
    document.execCommand('copy');
  };

  return (
    <>
      <Tooltip />
      <TextField
        fullWidth
        data-tip={t('popup-click-to-copy')}
        multiline
        readOnly
        inputProps={{ style: { cursor: 'pointer' } }}
        onClick={copyText}
        rows={rows}
        value={text}
        {...others}
      />
    </>
  );
};

export default CopyTextArea;
