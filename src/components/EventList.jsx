import { Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';

function EventList(props) {
  const { events, style, onClick } = props;

  return (
    <Stack divider={<Divider />} spacing={5} style={style}>
      {events.map((event, index) => {
        return (
          <Grid
            container
            spacing={2}
            key={index}
            onClick={() => onClick(event)}
            style={{ cursor: 'pointer' }}
          >
            <Grid item xs={8}>
              <Stack spacing={2}>
                <Typography variant="h5">{event.title}</Typography>
                <Typography variant="h6">{event.date}</Typography>
                <Typography variant="subtitle">{event.description}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <img width="100%" src={event.image} preview={false} />
            </Grid>
          </Grid>
        );
      })}
    </Stack>
  );
}

export default EventList;
