import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import SecurityIcon from '@mui/icons-material/Security';
import TwitterIcon from '@mui/icons-material/Twitter';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import {
  getAdditionalUserInfo,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from 'firebase/auth';
import Head from 'next/head';
import { useCallback, useState } from 'react';

import Layout from '../../components/Layout';
import { auth } from '../../firebase';
import styles from '../../styles/Home.module.css';

const http = axios.create({
  baseURL: 'https://backend-demo-zkore.onrender.com/',
});

const provider = new TwitterAuthProvider();

export default function ZkoreV3() {
  const [activeStep, setActiveStep] = useState(0);
  const [isShowProof, setShowProof] = useState(false);

  const [isShowCopySuccess, setShowCopySuccess] = useState(false);

  const [isShowLoading, setShowLoading] = useState(false);
  const [twitterUser, setTwitterUser] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [selectedScoreGroup, setSelectScoreGroup] = useState('1');

  const [proof, setProof] = useState(null);
  const [instance, setInstance] = useState(null);

  const onTwitterButtonClick = useCallback(async () => {
    if (twitterUser) {
      signOut(auth);
    } else {
      try {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const result = await signInWithPopup(auth, provider);
        const { user } = result;
        const additionInfo = getAdditionalUserInfo(result);

        setTwitterUser({
          uid: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
          username: additionInfo.username,
        });
      } catch (error) {
        console.error(error.code, error.message);
      }
    }
  }, [twitterUser]);

  const onGetSocietyScore = useCallback(async () => {
    setShowLoading(true);
    try {
      const { data } = await http.post('/score_respond/', {
        user_name: twitterUser.username,
      });
      setUserScore(data.data);
      setActiveStep(1);
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoading(false);
    }
  }, [twitterUser]);

  const onGenProof = useCallback(async () => {
    setShowLoading(true);
    try {
      const { data } = await http.post('/proof_respond/', {
        rank: selectedScoreGroup.toString(),
      });
      setInstance(data.data[0]);
      setProof(data.data[1]);
      setShowProof(true);
    } catch (error) {
      console.error(error);
    } finally {
      setShowLoading(false);
    }
  }, [selectedScoreGroup]);

  return (
    <>
      <Head>
        <title>Zkore V3</title>
      </Head>
      <Layout>
        <main className={styles.main}>
          <Card sx={{ minWidth: 800 }}>
            <CardContent>
              {activeStep === 0 && (
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  minHeight={400}
                >
                  <Stack alignItems="center" direction="row" spacing={2}>
                    <Stack spacing={3} sx={{ minWidth: 220 }}>
                      <UserInfo user={twitterUser || {}} />
                      <Button
                        startIcon={<TwitterIcon />}
                        variant="contained"
                        onClick={onTwitterButtonClick}
                        sx={{ backgroundColor: '#1e9cf0' }}
                      >
                        {!twitterUser ? 'Connect Twitter' : 'Logout'}
                      </Button>
                    </Stack>
                    <Stack spacing={3} sx={{ minWidth: 220 }}>
                      <UserInfo user={{}} />
                      <Button
                        startIcon={<FacebookIcon />}
                        variant="contained"
                        sx={{ backgroundColor: '#0037c1' }}
                      >
                        Connect Facebook
                      </Button>
                    </Stack>
                    <Stack spacing={3} sx={{ minWidth: 220 }}>
                      <UserInfo user={{}} />
                      <Button
                        startIcon={<InstagramIcon />}
                        variant="contained"
                        sx={{ backgroundColor: '#fe0682' }}
                      >
                        Connect Instagram
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              )}

              {activeStep === 1 && (
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  minHeight={400}
                  spacing="150px"
                >
                  <Stack alignItems="center" spacing={2}>
                    <Typography variant="h6">Your Reputation Score:</Typography>
                    <Typography variant="h1">{userScore}</Typography>
                  </Stack>
                  <FormControl sx={{ minWidth: '200px' }}>
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      Reputation Score Level
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={selectedScoreGroup}
                      onChange={(e) => setSelectScoreGroup(e.target.value)}
                    >
                      <FormControlLabel
                        value="5"
                        control={<Radio />}
                        label="> 2000"
                      />
                      <FormControlLabel
                        value="4"
                        control={<Radio />}
                        label="> 1000"
                      />
                      <FormControlLabel
                        value="3"
                        control={<Radio />}
                        label="> 500"
                      />
                      <FormControlLabel
                        value="2"
                        control={<Radio />}
                        label="> 300"
                      />
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="> 100"
                      />
                    </RadioGroup>
                  </FormControl>
                </Stack>
              )}
            </CardContent>
            <CardActions>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <Box>
                  {activeStep === 0 && (
                    <Button
                      variant="contained"
                      onClick={onGetSocietyScore}
                      disabled={!twitterUser}
                    >
                      Submit
                    </Button>
                  )}

                  {activeStep === 1 && (
                    <Button
                      variant="contained"
                      startIcon={<SecurityIcon />}
                      disabled={isShowLoading}
                      onClick={onGenProof}
                    >
                      Generate corresponding Proof
                    </Button>
                  )}
                </Box>
              </Box>
            </CardActions>
          </Card>
        </main>
      </Layout>
      <Dialog
        open={isShowProof}
        onClose={() => setShowProof(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        scroll="paper"
      >
        <DialogTitle>Your Instance & Proof</DialogTitle>
        <DialogContent>
          <Stack gap="20px">
            <Typography variant="h6">Instance:</Typography>
            <DialogContentText
              style={{
                whiteSpace: 'normal',
                wordBreak: 'break-all',
              }}
            >
              {JSON.stringify(instance, null, 2)}
            </DialogContentText>
            <Typography variant="h6">Proof:</Typography>
            <DialogContentText
              style={{
                whiteSpace: 'normal',
                wordBreak: 'break-all',
              }}
            >
              {proof}
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowProof(false)}>Close</Button>
          <Button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(`
                Instance: ${instance}
                
                Proof: ${proof}
                `);
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
          </Stack>
        </DialogContent>
        <DialogActions />
      </Dialog>
    </>
  );
}

function UserInfo(props) {
  const { user } = props;
  return (
    <Stack alignItems="center" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          alt={user.name || 'Not Connected'}
          src={
            user.photoURL ||
            'https://static-00.iconduck.com/assets.00/avatar-default-light-icon-256x256-nyl11bbf.png'
          }
          sx={{ width: 40, height: 40 }}
        />
        <Typography variant="h6">{user.name || 'User Name'}</Typography>
      </Stack>
    </Stack>
  );
}
