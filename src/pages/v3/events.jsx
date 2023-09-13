import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

import { Button, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React, { useCallback, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useAccount, useContractWrite, useSigner } from 'wagmi';

import EventList from '../../components/EventList';
import Layout from '../../components/Layout';
import { minNftContract } from '../../contracts/zkore.v3';
import events from '../../data/events';

function Events() {
  const [isShowAddPoofModal, setIsShowAddPoofModal] = useState(false);
  const [proof, setProof] = useState(null);
  const [instance, setInstance] = useState(null);

  const { address } = useAccount();

  const { data: signer } = useSigner();

  const mintEventTicket = useContractWrite({
    address: minNftContract.address,
    abi: minNftContract.abi,
    functionName: 'mintEventTicket',
    args: [1, instance, proof],
    signerOrProvider: signer,
  });

  const onEventClick = useCallback(() => {
    if (!address) {
      alert('You should connect wallet first');
      return;
    }
    setIsShowAddPoofModal(true);
  }, [address]);

  const onValidProofAndInstance = useCallback(async () => {
    try {
      const mintEventTicketTxn = await mintEventTicket.writeAsync();
      await mintEventTicketTxn.wait();
      setIsShowAddPoofModal(false);
      const isYes = window.confirm(
        'Passed verify, we will redirect to event page'
      );
      if (isYes) {
        window.open(
          'https://www.greenpeace.org.uk/news/victory-in-the-amazon-hyundai-stops-supply-of-diggers-to-illegal-gold-miners-destroying-indigenous-lands/'
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [mintEventTicket]);

  return (
    <>
      <Layout>
        <div>
          <Carousel autoPlay>
            {events.map((event, index) => {
              return (
                <div key={index}>
                  <div
                    style={{
                      width: '100%',
                      height: '400px',
                      backgroundImage: `url(${event.image})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPositionY: '25%',
                    }}
                  />
                </div>
              );
            })}
          </Carousel>

          <EventList
            events={events}
            style={{ margin: '50px 0' }}
            onClick={onEventClick}
          />
        </div>
      </Layout>
      <Dialog
        open={isShowAddPoofModal}
        onClose={() => setIsShowAddPoofModal(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Add Your Instance & Proof</DialogTitle>
        <DialogContent>
          <DialogContentText width="500px">
            <Typography variant="h6">Instance:</Typography>
            <TextField
              multiline
              rows={1}
              fullWidth
              defaultValue={instance}
              onChange={(e) => {
                setInstance(JSON.parse(e.target.value));
              }}
            />
            <Typography variant="h6">Proof:</Typography>
            <TextField
              multiline
              rows={25}
              fullWidth
              defaultValue={proof}
              onChange={(e) => {
                setProof(e.target.value);
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsShowAddPoofModal(false)}>Close</Button>
          <Button
            onClick={onValidProofAndInstance}
            disabled={!proof && !instance}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Events;
