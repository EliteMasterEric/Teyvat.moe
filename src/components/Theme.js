import { createMuiTheme } from '@material-ui/core';

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: '#607d8b',
    },
    secondary: {
      main: '#d32f2f',
    },
  },
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
});

export default Theme;
