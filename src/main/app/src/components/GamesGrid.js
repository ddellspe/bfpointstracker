import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

export default function GamesGrid({opened}) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect((opened) => {
    if (opened) {
      return;
    }
    const getGames = async() => {
      try {
        const response = await fetch('api/games');
        const data = await response.json();
        setGames(data);
        setLoading(false);
      } catch (err) {
      }
    }
    getGames();
  }, []);
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
          {games.map((game) => {
              return (
                <ListItem
                  key={game.gameNum}
                  secondaryAction={
                    <IconButton edge='end' aria-label='edit'>
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
    )
  }
}