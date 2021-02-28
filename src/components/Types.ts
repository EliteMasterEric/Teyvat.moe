import MapCategories from '~/data/core/categories.json';
import MapRegions from '~/data/core/regions.json';

/**
 * Defines a new type which, aside from storing a primative value,
 * also stores a unique "TYPE" key.
 * This allows TypeScript to differentiate between different types of strings
 * without changing the compiler's output.
 *
 * Example: type Uuid = Opaque<"Uuid", string>;
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
 *
 * NOTE: Never use capital letter variants of primatives (String, Number, Boolean)
 */

export type UnixTimestamp = Opaque<'UnixTimestamp', number>;
export type LocalizedString = Opaque<'LocalizedString', string>;

export type MapRegion = keyof typeof MapRegions;
export type MapCategory = keyof typeof MapCategories;

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
