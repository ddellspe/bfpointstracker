import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import timezone from 'dayjs/plugin/timezone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker  } from '@mui/x-date-pickers/MobileDateTimePicker';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

dayjs.extend(utc);
dayjs.extend(advancedFormat);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Chicago');

export default function GameForm({opened, creds, onClose, game}) {
  const [gameNum, setGameNum] = useState(game.gameNum);
  const [date, setDate] = useState(dayjs.utc(game.date));
  const [opponent, setOpponent] = useState(game.opponent);
  const [opponentLogo, setOpponentLogo] = useState(game.opponentLogo);
  const [won, setWon] = useState(game.won === null ? "null" : game.won);
  const [showError, setShowError] = useState(false);
  const [dataSent, setDataSent] = useState("");
  const killAlert = () => {
    setShowError(false);
    setTimeout(() => setDataSent(""), 1000);
  }

  const wonOptions = [
    {value: true, label: "Won"},
    {value: false, label: "Lost"},
    {value: "null", label: "Not Complete"}
  ];

  const handleWon = (event) => {
     setWon(event.target.value);
  }

  const setGame = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    var object = {};
    data.forEach((value, key) => {object[key] = value});
    object.gameNum = parseInt(object.gameNum)
    object['date'] = date.toISOString()
    object.won = object.won === "null" ? null : object.won
    fetch('api/game', {
      method: game.gameNum === 0 ? 'POST' : 'PUT',
      headers: new Headers({'Authorization': 'Basic ' + creds, 'Content-Type': 'application/json'}),
      body: JSON.stringify(object)})
    .then((resp) => {
      if (resp.ok) {
        const action = game.gameNum === 0 ? "created" : "updated"
        onClose(true, `Game ${object.gameNum} against ${object.opponent} ${action}`)
        return true;
      } else {
        return resp.json();
      }
    })
    .then(data => {
      if (typeof data === "object") {
        setShowError(true);
        setDataSent(data.errors.errorMessage);
      }
    })
  };

  useEffect(() => {
    setGameNum(game.gameNum);
    setDate(dayjs.utc(game.date));
    setOpponent(game.opponent);
    setOpponentLogo(game.opponentLogo);
    if (game.won === null) {
      setWon("null")
    } else {
      setWon(game.won);
    }
  }, [game]);

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      component="form"
      onSubmit={setGame}
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
            <Typography id="game-modal-title" variant="h5" component="h3">
              Game
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ width: '100%', my: 1 }}>
            <TextField
              label="Number"
              required
              name="gameNum"
              id="gameNum"
              defaultValue={gameNum}
              sx={{ mr: 1, width: '100%' }}
            />
          </Box>
          <Box sx={{ width: '100%', my: 1 }}>
            <MobileDateTimePicker
              timezone='system'
              value={date}
              onChange={setDate}
              id="date"
              name="date"
              label="Date"
              sx={{ mr: 1, width: '100%' }}
            />
          </Box>
          <Box sx={{ width: '100%', my: 1 }}>
            <TextField
              label="Opponent"
              required
              name="opponent"
              id="opponent"
              defaultValue={opponent}
              sx={{ mr: 1, width: '100%' }}
            />
          </Box>
          <Box sx={{ width: '100%', my: 1, minWidth: '50ch' }}>
            <TextField
              label="Opponent Logo"
              required
              name="opponentLogo"
              id="opponentLogo"
              defaultValue={opponentLogo}
              sx={{ mr: 1, width: '100%' }}
            />
          </Box>
          <Box sx={{ width: '100%', my: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="wonLabel">Result</InputLabel>
              <Select
                labelId="wonLabel"
                id="won"
                value={won}
                onChange={handleWon}
                label="Result"
                name="won"
              >
                {wonOptions.map((opt, id) => (
                  <MenuItem key={id} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Box sx={{ justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{mr: 1}}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
          >
            {game.gameNum === 0 ? 'Create' : 'Update'}
          </Button>
        </Box>
      </DialogActions>
      <Snackbar
        anchorOrigin={{vertical:'top', horizontal: 'center'}}
        open={showError}
        autoHideDuration={6000}
        onClose={killAlert}
      >
        <Alert severity="error" sx={{width: '100%'}}>{dataSent}</Alert>
      </Snackbar>
    </Dialog>
  )
}