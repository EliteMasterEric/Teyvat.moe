/**
 * Contains components used for input fields, including styling and debouncing.
 *
 * If an input is not debounced, continuously modifying it will cause
 * multiple costly state changes, resulting in performance issues.
 */

import React, { ReactElement } from 'react';
import {
  FormControlLabel,
  Slider as MaterialSlider,
  Switch as MaterialSwitch,
  TextField as MaterialTextField,
} from '@material-ui/core';

import { useDebouncedState } from '~/components/Util';

/**
 * A debounced text field.
 */
export const InputTextField = ({
  value,
  onChange,
  errorText,
  ...others
}: {
  value: string;
  onChange: (input: string) => void;
  errorText: string;
}): ReactElement => {
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
export const InputTextArea = ({
  value,
  onChange,
  rows = 10,
  ...others
}: {
  value: string;
  onChange: (value: string) => void;
  rows: number;
}): ReactElement => {
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
export const InputSlider = ({
  value,
  onChange,
  ...others
}: {
  value: number;
  onChange: (value: number) => void;
}): ReactElement => {
  // Maintains the current state of the slider.
  // If the slider has gone a period without changing,
  // onChange will be called to propage the change to the local storage.
  const [currentValue, setCurrentValue] = useDebouncedState<number>(value, onChange);

  const setInternalValue = (_event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setCurrentValue(newValue[0]);
    } else {
      setCurrentValue(newValue);
    }
  };

  return <MaterialSlider value={currentValue} onChange={setInternalValue} {...others} />;
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
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  labelPlacement: 'start' | 'end' | 'top' | 'bottom';
}): ReactElement => {
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
