/**
 * This folder defines and exports custom utility TypeScript types.
 */

/**
 * Defines a new type which, aside from storing a primative value,
 * also stores a unique "TYPE" key.
 * This allows TypeScript to differentiate between different types of strings
 * without changing the compiler's output.
 *
 * @example Opaque<"UUID", string>
 */
export type Opaque<K, T> = T & { __TYPE__: K };

/**
 * Defines a new type which removes the readonly flag from the properties of a type.
 */
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

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

export type UnixTimestamp = Opaque<'UnixTimestamp', number>;
export type LocalizedString = Opaque<'LocalizedString', string>;

export type UIControlsTab =
  | 'help'
  | 'changelog'
  | 'summary'
  | 'editor-help'
  | 'elements'
  | 'features'
  | 'routes'
  | 'sync'
  | 'options';

export type MapPosition = {
  latlng: {
    lat: number;
    lng: number;
  };
  zoom: number;
};
