import { AuthState } from './Types';

// Define the initial state
const initialState: AuthState = {
  google: {
    enabled: true,
    initialized: false,
    profile: null,
    inProgress: false,
  },
  github: {
    enabled: false,
  },
};

export default initialState;
