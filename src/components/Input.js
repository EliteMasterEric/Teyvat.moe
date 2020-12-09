import React from 'react';
import { useDebouncedState } from './Util';

/**
 * A debounced text field.
 */
export const InputTextField = ({ value, onChange, ...others }) => {
  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  return (
    <input
      value={currentValue}
      onChange={(event) => setCurrentValue(event.target.value)}
      {...others}
    />
  );
};

/**
 * A debounced text area.
 */
export const InputTextArea = ({ value, onChange, ...others }) => {
  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  return (
    <textarea
      value={currentValue}
      onChange={(event) => setCurrentValue(event.target.value)}
      {...others}
    />
  );
};
