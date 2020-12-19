/**
 * Contains components used for input fields,
 * including styling and debouncing.
 */

import React from 'react';
import { TextField as MaterialTextField } from '@material-ui/core';

import { useDebouncedState } from '~/components/Util';

/**
 * A debounced text field.
 */
export const InputTextField = ({ value, onChange, ...others }) => {
  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  return (
    <MaterialTextField
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
    <MaterialTextField
      multiline
      value={currentValue}
      onChange={(event) => setCurrentValue(event.target.value)}
      {...others}
    />
  );
};
