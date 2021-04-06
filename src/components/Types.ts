/**
 * This folder defines and exports custom utility TypeScript types.
 */

/**
 * Opaque<K, T> has been replaced with:
 * ts-toolbelt.A.Type<T, K>
 */
import { A } from 'ts-toolbelt';

/**
 * Defines a new type which removes the readonly flag from the properties of a type.
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type OpaqueKey<K extends string> = `~~OPAQUE:${K}${string}`;

export type ValueOf<T> = T[keyof T];

/**
 * Note these other utility types:
 * Partial<T>: Creates a type that makes all the properties of the object optional.
 * Readonly<T>: Creates a type that makes all the properties of the object unmodifiable.
 * React.ComponentProps<T>: Creates a type whose values are the props of a component.
 * ReturnType<T>: Creates a type whose values are the return type of a function.
 * ts-toolkit.O.Paths<T>: Creates a type whose values are the object paths of a type.
 *
 * Also see ts-toolbelt:
 * @see https://github.com/millsp/ts-toolbelt#documentation
 *
 * NOTE: Never use capital letter variants of primatives (String, Number, Boolean)
 */

export type UnixTimestamp = A.Type<number, 'UnixTimestamp'>;
export type LocalizedString = A.Type<string, 'LocalizedString'>;

export type Empty = Record<string, never>;

const UIControlsTabs = [
  'help',
  'changelog',
  'summary',
  'editor-help',
  'elements',
  'features',
  'routes',
  'sync',
  'options',
] as const;
export type UIControlsTab = typeof UIControlsTabs[number];
export const distinguishUIControlsTab = (value: string): value is UIControlsTab => {
  return UIControlsTabs.includes(value as UIControlsTab);
};

export type MapPosition = {
  latlng: {
    lat: number;
    lng: number;
  };
  zoom: number;
};
