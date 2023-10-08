import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

export default function ScoresGrid({opened, creds}) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!opened || creds === undefined) {
      return;
    }
    const getScores = async() => {
      try {
        const response = await fetch('api/scores');
        const data = await response.json();
        setScores(data);
        setLoading(false);
      } catch (err) {
      }
    }
    getScores();
  }, [opened, creds]);
  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  } else {
    return (
      <Box xs={{ width: '100%' }}>
        <List dense={true}>
          {scores.map((score) => {
              return (
                <ListItem
                  key={score.id}
                  secondaryAction={
                    <IconButton edge='end' aria-label='edit'>
                      <EditIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded">{score.points}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={"Game " + score.gameNum}
                    secondary={"Q" + score.quarter + " " + ('00' + score.minutesRemaining).slice(-2) + ":" + ('00' + score.secondsRemaining).slice(-2)} />
                </ListItem>
              )
            }
          )}
        </List>
      </Box>
    )
  }
}