import React, { useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import ScoreboardIcon from '@mui/icons-material/ScoreboardTwoTone';



export default function DataButton() {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    const checkAuth = async() => {
      try {
        const response = await fetch('session')
        await response.json()
        setAuth(true);
      } catch (err) {
        setAuth(false);
      }
    }
    checkAuth();
  }, []);
  if (auth) {
    return (
      <Fab color="primary" aria-label="scores" style={{
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 20,
        left: 'auto',
        position: 'fixed'
      }}>
        <ScoreboardIcon />
      </Fab>
    )
  }
};