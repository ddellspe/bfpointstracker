import React, { useEffect, useState } from 'react';
import { green, amber, deepOrange, red } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ScoreForm from './ScoreForm';
import Typography from '@mui/material/Typography';

export default function ScoresGrid({opened, creds, onClose}) {
  const defaultScore = {"id": 0, "gameNum": 1, "points": 7, "quarter": 1, "minutesRemaining": 15, "secondsRemaining": 0};
  const [scores, setScores] = useState([]);
  const [gameNumMax, setGameNumMax] = useState(12);
  const [score, setScore] = useState(defaultScore);
  const [loading, setLoading] = useState(false);
  const [scoreDialog, setScoreDialog] = useState(false);

  const editScore = (scoreId) => {
    const selectedScore = scores.find(score => score.id === parseInt(scoreId));
    setScore(selectedScore === undefined ? defaultScore : selectedScore);
    setTimeout(() => setScoreDialog(true), 50)
  }

  const newScore = () => {
    editScore(0);
  }

  const closeScoreModal = (success, message) => {
    if (typeof success === 'boolean') {
      setScoreDialog(false);
      onClose(success, message);
    } else {
      setScoreDialog(false);
    }
  }

  useEffect(() => {
    if (!opened || creds === undefined) {
      return;
    }
    setLoading(true)
    const getScores = async() => {
      try {
        const response = await fetch('api/scores', {headers: new Headers({'Authorization': 'Basic ' + creds})});
        const data = await response.json();
        setScores(data);
        setLoading(false);
      } catch (err) {
      }
    }
    const getGames = async() => {
      try {
        const response = await fetch('api/games', {headers: new Headers({'Authorization': 'Basic ' + creds})});
        const data = await response.json();
        setGameNumMax(data.length);
      } catch (err) {
      }
    }
    getScores();
    getGames();
  }, [opened, creds]);
  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  } else {
    return (
      <Dialog
        open={opened}
        onClose={onClose}
        PaperProps={{
          sx: {
            position: 'fixed',
            m: '0 auto',
          },
        }}
      >
        <DialogTitle>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
              <Typography id="games-modal-title" variant="h4" component="h2">
                Scores Listing
              </Typography>
            </Grid>
            <Grid ml="auto" item>
              <IconButton aria-label="close" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%' }}>
            <List dense={true}>
              {scores.map((score) => {
                  return (
                    <ListItem
                      key={score.id}
                      secondaryAction={
                        <IconButton edge='end' aria-label='edit' onClick={() => editScore(score.id)}>
                          <EditIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          sx={{
                            bgcolor: score.points <= 2 ? red[700] : score.points <= 3 ? deepOrange[500] : score.points <= 6 ? amber[500] : green[500]
                          }}
                        >
                          {score.points}
                        </Avatar>
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
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={newScore}>
            Add Score
          </Button>
          <ScoreForm opened={scoreDialog} creds={creds} onClose={closeScoreModal} score={score} gameNumMax={gameNumMax} />
        </DialogActions>
      </Dialog>
    )
  }
}