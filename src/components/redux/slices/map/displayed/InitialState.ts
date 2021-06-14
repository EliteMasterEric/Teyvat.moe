import { DisplayedState } from './Types';

// Define the initial state
const initialState: DisplayedState = {
  features: {
    // These features will be displayed to new users when they first open the site.
    mondstadtAnemoculus: true,
    mondstadtTeleporter: true,
    mondstadtStatue: true,
    mondstadtDomain: true,

    liyueGeoculus: true,
    liyueTeleporter: true,
    liyueStatue: true,
    liyueDomain: true,

    dragonspineCrimsonAgate: true,
    dragonspineTeleporter: true,
    dragonspineStatue: true,
    dragonspineDomain: true,

    archipelagoTeleporter: true,
  },
  routes: {},
};

export default initialState;
