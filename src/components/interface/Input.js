/**
 * Contains components used for input fields, including styling and debouncing.
 *
 * If an input is not debounced, continuously modifying it will cause
 * multiple costly state changes, resulting in performance issues.
 */

import React from 'react';
import {
  TextField as MaterialTextField,
  Slider as MaterialSlider,
  Switch as MaterialSwitch,
  FormControlLabel,
} from '@material-ui/core';

import { useDebouncedState } from '~/components/Util';

/**
 * A debounced text field.
 */
export const InputTextField = ({ value, onChange, errorText, ...others }) => {
  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  return (
    <MaterialTextField
      value={currentValue}
      onChange={(event) => setCurrentValue(event.target.value)}
      error={errorText !== undefined}
      helperText={errorText ?? ''}
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

/**
 * A debounced switch.
 */
export const InputSwitch = ({
  value = false,
  onChange,
  label = null,
  labelPlacement = 'start',
  ...others
}) => {
  // Maintains the current state of the switch.
  // If the switch has gone a period without changing,
  // onChange will be called to propage the change to the local storage.
  const [currentValue, setCurrentValue] = useDebouncedState(value, onChange);

  const control = (
    <MaterialSwitch
      checked={currentValue}
      onChange={(_event, newValue) => setCurrentValue(newValue)}
      {...others}
    />
  );

  return label ? (
    <FormControlLabel label={label} labelPlacement={labelPlacement} control={control} />
  ) : (
    control
  );
};
