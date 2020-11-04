import React from 'react';
import Tooltip from 'react-tooltip';

/**
 * A text area which you can click to copy the contents of.
 *
 * @param {*} text The text to display in the textarea.
 * @param {*} others Any other parameters passed will be received by the text area.
 */
const CopyTextArea = ({ text, rows = 10, ...others }) => {
  const textAreaRef = React.useRef(null);

  const copyText = () => {
    console.log('Copying text.');
    textAreaRef.current.select();
    document.execCommand('copy');
  };

  return (
    <>
      <Tooltip />
      <textarea
        data-tip="Click to Copy"
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
