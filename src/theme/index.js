import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  MuiButton: {
    styleOverrides: {
      // Name of the slot
      root: {
        // Some CSS
        textTransform: 'none',
      },
    },
  },
});

export default theme;
