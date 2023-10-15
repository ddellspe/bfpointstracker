import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import GameForm from './GameForm';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export default function GamesGrid({opened, creds, onClose}) {
  const defaultGame = {"gameNum": 0, "opponent": "", "opponentLogo": "", "date": new Date().toISOString(), "won": null};
  const [games, setGames] = useState([]);
  const [game, setGame] = useState(defaultGame);
  const [loading, setLoading] = useState(false);
  const [gameDialog, setGameDialog] = useState(false);

  const editGame = (gameNum) => {
    const selectedGame = games.find(game => game.gameNum === parseInt(gameNum));
    setGame(selectedGame === undefined ? defaultGame : selectedGame);
    setTimeout(() => setGameDialog(true), 50)
  }

  const newGame = () => {
    editGame(0)
  }

  const closeGameModal = (success, message) => {
    if (typeof success === 'boolean') {
      setGameDialog(false);
      onClose(success, message);
    } else {
      setGameDialog(false);
    }
  }

  useEffect(() => {
    if (!opened || creds === undefined) {
      return;
    }
    setLoading(true);
    const getGames = async() => {
      try {
        const response = await fetch('api/games', {headers: new Headers({'Authorization': 'Basic ' + creds})});
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
      }
    }
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
                Games Listing
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
              {games.map((game) => {
                  return (
                    <ListItem
                      key={game.gameNum}
                      secondaryAction={
                        <IconButton edge='end' aria-label='edit' onClick={() => editGame(game.gameNum)}>
                          <EditIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Badge
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          invisible={game.won === null}
                          variant="dot"
                          color={(game.won === true) ? "success" : "error"}
                        >
                          <Avatar alt={game.opponent} src={game.opponentLogo} variant="rounded" />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={game.opponent}
                        secondary={new Date(game.date).toLocaleTimeString([],{year: 'numeric', month: 'short', day: 'numeric'})} />
                    </ListItem>
                  )
                }
              )}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={newGame}>
            Add Game
          </Button>
          <GameForm opened={gameDialog} creds={creds} onClose={closeGameModal} game={game} />
        </DialogActions>
      </Dialog>
    )
  }
}