import React from 'react';
import Tooltip from 'react-tooltip';
import { t } from '../Localization';

/**
 * A text area which you can click to copy the contents of.
 *
 * @param {*} text The text to display in the textarea.
 * @param {*} others Any other parameters passed will be received by the text area.
 */
const CopyTextArea = ({ text, rows = 10, ...others }) => {
  const textAreaRef = React.useRef(null);

  const copyText = () => {
    textAreaRef.current.select();
    document.execCommand('copy');
  };

  return (
    <>
      <Tooltip />
      <textarea
        data-tip={t('popup-click-to-copy')}
        readOnly
        style={{ cursor: 'pointer' }}
        ref={textAreaRef}
        onClick={copyText}
        rows={rows}
        value={text}
        {...others}
      />
    </>
  );
};

export default CopyTextArea;
