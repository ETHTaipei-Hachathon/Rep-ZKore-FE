import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import styles from '../styles/Home.module.css';

const pages = [
  {
    text: 'Reputation Score',
    url: '/v3/',
  },
  {
    text: 'Events',
    url: '/v3/events',
  },
];

function Layout(props) {
  const { children } = props;
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <FingerprintIcon sx={{ mr: 1 }} />
            <Typography
              variant="body1"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontWeight: 700,
                letterSpacing: '2px',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ZKore V3
            </Typography>

            <Stack
              sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}
              direction="row"
              spacing={2}
            >
              {pages.map((page) => (
                <Button key={page.text} sx={{ color: 'white' }} href={page.url}>
                  {page.text}
                </Button>
              ))}
              <div>
                <ConnectButton />
              </div>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Container maxWidth="lg">
        <main className={styles.main}>{children}</main>
      </Container>
    </>
  );
}

export default Layout;
