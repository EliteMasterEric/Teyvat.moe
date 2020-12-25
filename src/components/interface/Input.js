/**
 * Contains components used for input fields, including styling and debouncing.
 *
 * If an input is not debounced, continuously modifying it will cause
 * multiple costly state changes, resulting in performance issues.
 */

import React from 'react';
import { TextField as MaterialTextField, Slider as MaterialSlider } from '@material-ui/core';

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
export const InputTextArea = ({ value, onChange, rows = 10, ...others }) => {
  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  return (
    <MaterialTextField
      multiline
      rows={rows}
      value={currentValue}
      onChange={(event) => setCurrentValue(event.target.value)}
      {...others}
    />
  );
};

/**
 * A debounced slider.
 */
export const InputSlider = ({ value, onChange, ...others }) => {
  // Maintains the current state of the slider.
  // If the slider has gone a period without changing,
  // onChange will be called to propage the change to the local storage.
  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  return (
    <MaterialSlider
      value={currentValue}
      onChange={(_event, newValue) => setCurrentValue(newValue)}
      {...others}
    />
  );
};
