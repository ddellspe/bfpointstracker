import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import GamesIcon from '@mui/icons-material/GamesTwoTone';
import GamesGrid from './GamesGrid';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ScoreboardIcon from '@mui/icons-material/ScoreboardTwoTone';
import ScoresGrid from './ScoresGrid';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SportsFootballIcon from '@mui/icons-material/SportsFootballTwoTone';
import Typography from '@mui/material/Typography';

export default function AdminSection() {
  const [auth, setAuth] = useState(false);
  const [openSpeedDialOptions, setOpenSpeedDialOptions] = useState(false);
  const [openScoresModal, setOpenScoresModal] = useState(false);
  const [openGamesModal, setOpenGamesModal] = useState(false);
  const toggleDial = () => setOpenSpeedDialOptions(!openSpeedDialOptions);
  const handleOpenScoresModal = () => {
    setOpenSpeedDialOptions(false);
    setOpenScoresModal(true);
    setOpenGamesModal(false);
  };
  const handleOpenGamesModal = () => {
    setOpenSpeedDialOptions(false);
    setOpenScoresModal(false);
    setOpenGamesModal(true);
  };
  const handleCloseAll = () => {
    setOpenSpeedDialOptions(false);
    setOpenScoresModal(false);
    setOpenGamesModal(false);
  };
  useEffect(() => {
    const checkAuth = async() => {
      try {
        const response = await fetch('session').catch();
        await response.json()
        setAuth(true);
      } catch (err) {
        setAuth(false);
      }
    }
    checkAuth();
  }, []);
  return (
    <Box>
      <SpeedDial
        ariaLabel="controlled open manageData"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<GamesIcon />} openIcon={<CloseIcon />} />}
        onClick={toggleDial}
        open={openSpeedDialOptions}
        hidden={auth}
        FabProps={{ color:"info" }}
      >
        <SpeedDialAction
          key="scores"
          icon={<ScoreboardIcon />}
          tooltipTitle="Manage Scores"
          onClick={handleOpenScoresModal}/>
        <SpeedDialAction
          key="games"
          icon={<SportsFootballIcon />}
          tooltipTitle="Manage Games"
          onClick={handleOpenGamesModal}/>
      </SpeedDial>
      <Dialog
        open={openGamesModal}
        onClose={handleCloseAll}
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
              <IconButton aria-label="close" onClick={handleCloseAll}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <GamesGrid opened={openGamesModal} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={openScoresModal}
        onClose={handleCloseAll}
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
              <IconButton aria-label="close" onClick={handleCloseAll}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <ScoresGrid opened={openScoresModal} />
        </DialogContent>
      </Dialog>
    </Box>
  )
};