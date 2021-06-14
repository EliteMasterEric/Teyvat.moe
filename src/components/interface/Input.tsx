/**
 * Contains components used for input fields, including styling and debouncing.
 *
 * If an input is not debounced, continuously modifying it will cause
 * multiple costly state changes, resulting in performance issues.
 */

import {
  FormControlLabel,
  Slider as MaterialSlider,
  Switch as MaterialSwitch,
  TextField as MaterialTextField,
  SwitchProps,
  TextFieldProps,
  SliderTypeMap,
  makeStyles,
} from '@material-ui/core';
import _ from 'lodash';
import React, { FunctionComponent, ReactElement, useCallback } from 'react';

import { useDebouncedState } from 'src/components/util';

interface InputTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
  value?: string;
  onChange: (input: string) => void;
  errorText?: string;
}

/**
 * A debounced text field.
 */
export const InputTextField: FunctionComponent<InputTextFieldProps> = ({
  value = '',
  onChange,
  errorText = '',
  ...others
}) => {
  const [currentValue, setCurrentValue] = useDebouncedState<string>(value, onChange);
  const onValueChange = useCallback(
    (event) => setCurrentValue(event.target.value),
    [setCurrentValue]
  );

  return (
    <MaterialTextField
      value={currentValue}
      onChange={onValueChange}
      error={errorText !== undefined}
      helperText={errorText ?? ''}
      variant={'outlined'}
      {...others}
    />
  );
};

interface InputTextAreaProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

/**
 * A debounced text area.
 */
export const InputTextArea: FunctionComponent<InputTextAreaProps> = ({
  value,
  onChange,
  rows = 10,
  ...others
}) => {
  const [currentValue, setCurrentValue] = useDebouncedState<string>(value, onChange);
  const onValueChange = useCallback(
    (event) => setCurrentValue(event.target.value),
    [setCurrentValue]
  );

  return (
    <MaterialTextField
      multiline
      rows={rows}
      value={currentValue}
      variant={'outlined'}
      onChange={onValueChange}
      {...others}
    />
  );
};

type InputSliderProps = Omit<React.ComponentProps<typeof MaterialSlider>, 'onChange'> & {
  value: number;
  onChange: (value: number) => void;
};

/**
 * A debounced slider.
 */
export const InputSlider: FunctionComponent<InputSliderProps> = ({
  value,
  onChange,
  ...others
}) => {
  // Maintains the current state of the slider.
  // If the slider has gone a period without changing,
  // onChange will be called to propage the change to the local storage.
  const [currentValue, setCurrentValue] = useDebouncedState<number>(value, onChange);

  const setInternalValue: SliderTypeMap['props']['onChange'] = (
    _event,
    newValue: number | number[]
  ) => {
    if (_.isArray(newValue)) {
      const newInnerValue = newValue[0];
      if (newInnerValue != null) setCurrentValue(newInnerValue);
    } else {
      setCurrentValue(newValue);
    }
  };

  return <MaterialSlider value={currentValue} onChange={setInternalValue} {...others} />;
};

type InputSwitchProps = Omit<SwitchProps, 'onChange'> & {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string | ReactElement;
  labelPlacement?: 'start' | 'end' | 'top' | 'bottom';
  debounce?: number;
};

const useStyles = makeStyles(() => ({
  inputSwitchBase: {
    padding: 4,
  },
}));

/**
 * A debounced switch.
 */
export const InputSwitch: FunctionComponent<InputSwitchProps> = ({
  value = false,
  onChange,
  label = null,
  labelPlacement = 'start',
  debounce,
  ...others
}) => {
  const classes = useStyles();
  // Maintains the current state of the switch.
  // If the switch has gone a period without changing,
  // onChange will be called to propage the change to the local storage.
  const [currentValue, setCurrentValue] = useDebouncedState<boolean>(value, onChange, debounce);
  const onValueChange = useCallback(
    (_event, newValue) => setCurrentValue(newValue),
    [setCurrentValue]
  );

  const control = (
    <MaterialSwitch
      checked={currentValue}
      onChange={onValueChange}
      classes={{
        switchBase: classes.inputSwitchBase,
      }}
      {...others}
    />
  );

  return label ? (
    <FormControlLabel label={label} labelPlacement={labelPlacement} control={control} />
  ) : (
    control
  );
};
