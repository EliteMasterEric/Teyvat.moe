import { OptionsObject } from 'notistack';
import { LocalizedString } from 'src/components/Types';

interface NotificationOptions extends OptionsObject {
  // Override a mutability issue.
  defaultValue?: string | number | string[];
}

export interface Notification {
  // Set this value to true to tell the Notification handler to
  // use the dismissal animation.
  dismissed: boolean;
  // The message to display in the popup.
  // Make sure to translate before passing a value in.
  message: LocalizedString;
  options: NotificationOptions;
}

// Define a type for the slice state
export interface NotifyState {
  notifications: Notification[];
}
