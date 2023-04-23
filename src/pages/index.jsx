import FingerprintIcon from '@mui/icons-material/Fingerprint';
import MenuIcon from '@mui/icons-material/Menu';
import SecurityIcon from '@mui/icons-material/Security';
import TollIcon from '@mui/icons-material/Toll';
import TwitterIcon from '@mui/icons-material/Twitter';
import { CardMedia } from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from 'firebase/auth';
// import { Inter } from 'next/font/google';
import Head from 'next/head';
// import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';

// import semaphoreContract from '../contracts/semaphore';
import zkoreContract from '../contracts/zkore';
import { auth } from '../firebase';
import styles from '../styles/Home.module.css';
// import { createIdentity, generateZkProof, verifyProofLocal } from '../zk';
import tempProof from '../zk/temp_proof';

// const inter = Inter({ subsets: ['latin'] });

// const pages = ['Products', 'Pricing', 'Blog'];
const pages = [];
const settings = ['Logout'];
const steps = [
  'Get Twitter Score',
  'Check Proof',
  'Connect Wallet',
  'Mint NFT',
  'Finished',
];

const provider = new TwitterAuthProvider();
const MAX_TWITTER_SCORE = 400;
const twitterScoreGenerator = () =>
  Math.floor(Math.random() * MAX_TWITTER_SCORE) + 1;

export default function Home() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isShowProof, setShowProof] = useState(false);
  const [isGenProof, setGenProof] = useState(false);
  const [isGetNFT, setGetNFT] = useState(false);
  const [isShowLoading, setShowLoading] = useState(false);
  const [isShowCopySuccess, setShowCopySuccess] = useState(false);

  const [isInit, setInit] = useState(false);
  const [twitterUser, setTwitterUser] = useState(auth.currentUser);
  const [log, setLog] = useState('');
  // {
  //   uid: '1234567890',
  //   name: 'user',
  //   photoUrl: '',
  //   score: '',
  // }

  useEffect(() => {
    if (twitterUser) return;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setTwitterUser({
          uid: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
          // score range: 0 ~ 400
          score: twitterScoreGenerator(),
        });
      } else {
        setTwitterUser(null);
      }
      setInit(true);
    });
  }, [twitterUser]);

  useEffect(() => {
    if (isInit) return;
    if (twitterUser) {
      setInit(true);
    }
  }, [isInit, twitterUser]);

  const { address } = useAccount();

  const preButtonState = useMemo(() => {
    const state = { isShow: false, isDisable: false };

    if (activeStep === 0) {
      state.isShow = false;
      state.isDisable = true;
    } else if (activeStep === steps.length - 1) {
      state.isShow = false;
      state.isDisable = true;
    } else {
      state.isShow = true;
      state.isDisable = false;
    }

    return state;
  }, [activeStep]);

  const nextButtonState = useMemo(() => {
    const state = { isShow: true, isDisable: true };

    if (activeStep === 0) {
      state.isShow = true;
      state.isDisable = !twitterUser;
    } else if (activeStep === 1) {
      state.isShow = true;
      state.isDisable = !isGenProof;
    } else if (activeStep === 2) {
      state.isShow = true;
      state.isDisable = !address;
    } else if (activeStep === 3) {
      state.isShow = true;
      state.isDisable = !isGetNFT;
    } else if (activeStep === steps.length - 1) {
      state.isShow = false;
      state.isDisable = true;
    }

    return state;
  }, [twitterUser, activeStep, address, isGenProof, isGetNFT]);

  const { data: signer } = useSigner();

  // const semaphore = useContract({
  //   address: semaphoreContract.address,
  //   abi: semaphoreContract.abi,
  // });

  const zkore = useContract({
    address: zkoreContract.address,
    abi: zkoreContract.abi,
    signerOrProvider: signer,
  });

  const twitterLogin = async () => {
    try {
      // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
      // You can use these server side with your app's credentials to access the Twitter API.
      const result = await signInWithPopup(auth, provider);

      // The signed-in user info.
      const { user } = result;

      setTwitterUser({
        uid: user.uid,
        name: user.displayName,
        photoURL: user.photoURL,
        // score range: 0 ~ 400
        score: twitterScoreGenerator(),
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  };

  // const mintNFT = async () => {
  //   if (!twitterUser) {
  //     alert('Twitter User not found');
  //   }

  //   try {
  //     const identity = createIdentity(twitterUser.uid);
  //     let txResult = await semaphore.addMember(1, identity.commitment);
  //     await txResult.wait();

  //     const { fullProof, args } = await generateZkProof(identity);

  //     if (verifyProofLocal(fullProof)) {
  //       txResult = await zkore.safeMint(address, ...args);
  //       await txResult.wait();
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    signOut(auth);
    setAnchorElUser(null);
  };

  return (
    <>
      <Head>
        <title>Zkore</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* <script src="./snarkjs.min.js" /> */}
      </Head>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <FingerprintIcon
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
            />
            <Typography
              variant="body1"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                letterSpacing: '2px',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ZKore
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <FingerprintIcon
              sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Zkore
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            {twitterUser && (
              <Box sx={{ flexGrow: 0 }}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={twitterUser.name} src={twitterUser.photoURL} />
                </IconButton>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <main className={styles.main}>
        <Card sx={{ minWidth: 700 }}>
          <CardContent>
            <Box sx={{ py: '25px' }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            {activeStep === 0 && (
              <Stack
                justifyContent="center"
                alignItems="center"
                minHeight={400}
              >
                {!isInit && <CircularProgress size={80} />}

                {isInit && twitterUser && (
                  <Stack alignItems="center" spacing={2}>
                    <Typography variant="h6">Your Twitter Score:</Typography>
                    <Typography variant="h1">{twitterUser.score}</Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar
                        alt={twitterUser.name}
                        src={twitterUser.photoURL}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Typography variant="h6">{twitterUser.name}</Typography>
                    </Stack>
                  </Stack>
                )}
                {isInit && twitterUser === null && (
                  <Button
                    startIcon={<TwitterIcon />}
                    variant="contained"
                    onClick={twitterLogin}
                    sx={{ backgroundColor: '#1e9cf0' }}
                  >
                    Login with Twitter
                  </Button>
                )}
              </Stack>
            )}

            {activeStep === 1 && (
              <Stack
                justifyContent="center"
                alignItems="center"
                minHeight={400}
              >
                {isGenProof ? (
                  <Button
                    variant="contained"
                    startIcon={<SecurityIcon />}
                    onClick={() => setShowProof(true)}
                  >
                    Show Proof
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<SecurityIcon />}
                    disabled={isShowLoading}
                    onClick={() => {
                      setShowLoading(true);
                      setLog('Generating ZK Proof');
                      setTimeout(() => {
                        setShowLoading(false);
                        setGenProof(true);
                        setLog('');
                      }, 1500);
                    }}
                  >
                    Generate Proof
                  </Button>
                )}
              </Stack>
            )}
            {activeStep === 2 && (
              <Stack
                justifyContent="center"
                alignItems="center"
                minHeight={400}
              >
                <ConnectButton accountStatus="address" />
                {/* <Button
                  variant="contained"
                  startIcon={<AccountBalanceWalletIcon />}
                >
                  Connect Wallet
                </Button> */}
              </Stack>
            )}
            {activeStep === 3 && (
              <Stack
                justifyContent="center"
                alignItems="center"
                minHeight={400}
              >
                <Button
                  variant="contained"
                  startIcon={<TollIcon />}
                  disabled={isShowLoading}
                  onClick={async () => {
                    if (!address) {
                      alert('Address is required');
                    }

                    try {
                      setShowLoading(true);
                      const txResult = await zkore.superMint(address);
                      const x = await txResult.wait();
                      setLog('Minting NFT');
                      console.log(txResult);
                      console.log(x);
                      setShowLoading(true);
                      setGetNFT(true);
                      setActiveStep(steps.length - 1);
                    } catch (error) {
                      console.error(error);
                    } finally {
                      setShowLoading(false);
                      setLog('');
                    }
                  }}
                >
                  Mint NFT
                </Button>
              </Stack>
            )}
            {activeStep === 4 && (
              <Stack
                justifyContent="center"
                alignItems="center"
                minHeight={400}
                spacing={3}
              >
                <Typography variant="body2" color="text.secondary">
                  Here is your Certification NFT
                </Typography>
                <Card sx={{ width: 300 }}>
                  <CardMedia
                    component="img"
                    height="212"
                    image="https://ipfs.io/ipfs/QmdVR7BrVN7WgoVP3YFKSoBbPx1qFK5kcsPVzFeF7Bezqb"
                    alt="Score A - Certification"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Score A - Certification
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      A SCORE certification can help you prove your reputation
                      for others to verify your social credits.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      See it on chain
                    </Button>
                  </CardActions>
                </Card>
              </Stack>
            )}
          </CardContent>
          <CardActions>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box>
                {preButtonState.isShow && (
                  <Button
                    variant="text"
                    size="large"
                    onClick={() => setActiveStep((step) => step - 1)}
                    disabled={preButtonState.isDisable}
                  >
                    Prev
                  </Button>
                )}
              </Box>
              <Box>
                {nextButtonState.isShow && (
                  <Button
                    variant="text"
                    size="large"
                    onClick={() => setActiveStep((step) => step + 1)}
                    disabled={nextButtonState.isDisable}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </CardActions>
        </Card>
      </main>
      <Dialog
        open={isShowProof}
        onClose={() => setShowProof(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Your Proof</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <pre style={{ fontSize: '12px' }}>
              {JSON.stringify(tempProof, null, 2)}
            </pre>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProof(false)}>Close</Button>
          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  JSON.stringify(tempProof, null, 2)
                );
                console.log('複製成功');
                setShowCopySuccess(true);
              } catch (error) {
                console.error(error);
              }
            }}
            autoFocus
          >
            Copy
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={isShowCopySuccess}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        autoHideDuration={3000}
        onClose={() => setShowCopySuccess(false)}
      >
        <Alert severity="success" elevation={6} variant="filled">
          Copied success!
        </Alert>
      </Snackbar>
      <Dialog
        open={isShowLoading}
        onClose={() => setShowLoading(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle />
        <DialogContent sx={{ width: '300px', height: '200px' }}>
          <Stack
            spacing={3}
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <CircularProgress size={50} />
            {log !== '' && <Typography variant="body2">{log}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions />
      </Dialog>
    </>
  );
}
