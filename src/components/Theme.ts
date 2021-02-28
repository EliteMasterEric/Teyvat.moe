import { createMuiTheme } from '@material-ui/core';

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: '#607d8b',
    },
    secondary: {
      main: '#d32f2f',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
      secondary: 'rgba(0,0,0,0.76)',
    },
  },
  overrides: {
    MuiTab: {
      wrapper: {
        color: 'rgba(0,0,0,0.54)',
        '&$selected': {
          color: '#607d8b',
        },
      },
    },
  },
  /*
  custom: {
    button: {
      bgColor: {
        main: '#313131',
        hover: '#616161',
      },
      color: {
        menu: '#1bb76e',
        upload: '#1bb76e',
        delete: '#ff5d5a',
        locate: '#ffca31',

        mapControl: '#555',
      },
    },
  },
  */
});

export default Theme;
