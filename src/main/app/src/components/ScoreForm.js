import { useState, useEffect } from 'react';
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
import Slider from '@mui/material/Slider';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function ScoreForm({opened, creds, onClose, score, games}) {
  const [id, setId] = useState(score.id);
  const [gameNum, setGameNum] = useState(score.gameNum);
  const [quarter, setQuarter] = useState(score.quarter);
  const [minutesRemaining, setMinutesRemaining] = useState(score.minutesRemaining);
  const [secondsRemaining, setSecondsRemaining] = useState(score.secondsRemaining);
  const [points, setPoints] = useState(score.points);
  const [showError, setShowError] = useState(false);
  const [dataSent, setDataSent] = useState("");
  const killAlert = () => {
    setShowError(false);
    setTimeout(() => setDataSent(""), 1000);
  }

  const pointOptions = [
    {value: 1, label: "XP Ret"},
    {value: 2, label: "Safety"},
    {value: 3, label: "FG"},
    {value: 6, label: "TD"},
    {value: 7, label: "+XP"},
    {value: 8, label: "+2PT"}
  ];

  const handleChange = (event) => {
    if (event.target.name === 'gameNum') {
      setGameNum(event.target.value);
    } else if (event.target.name === 'quarter') {
      setQuarter(event.target.value);
    } else {
      setPoints(event.target.value);
    }
  }

  const setScore = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    var object = {};
    data.forEach((value, key) => {object[key] = parseInt(value)});
    fetch('api/score', {
      method: score.id === 0 ? 'POST' : 'PUT',
      headers: new Headers({'Authorization': 'Basic ' + creds, 'Content-Type': 'application/json'}),
      body: JSON.stringify(object)})
    .then((resp) => {
      if (resp.ok) {
        const action = score.id === 0 ? "created" : "updated"
        const timeLeft = `${('00' + object.minutesRemaining).slice(-2)}:${('00' + object.secondsRemaining).slice(-2)}`
        const msg = `Score ${action} with points of ${object.points} with ${timeLeft} left in quarter ${object.quarter} for game ${object.gameNum}`;
        onClose(true, msg);
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
    setMinutesRemaining(score.minutesRemaining);
    setSecondsRemaining(score.secondsRemaining);
    setId(score.id);
    setGameNum(score.gameNum);
    setQuarter(score.quarter);
    setPoints(score.points);
  }, [score]);

  return (
    <Dialog
      open={opened}
      onClose={onClose}
      component="form"
      onSubmit={setScore}
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
            <Typography id="score-modal-title" variant="h5" component="h3">
              Score
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <input type="hidden" name="id" value={id} />
        <Box sx={{ width: '100%', my: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="gameNumLabel">Game</InputLabel>
            <Select
              labelId="gameNumLabel"
              id="gameNum"
              value={gameNum}
              onChange={handleChange}
              label="Game Number"
              name="gameNum"
            >
              {games.map((game) => (
                <MenuItem key={game.gameNum} value={game.gameNum}>{game.opponent}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '100%', my: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="quarterLabel">Quarter</InputLabel>
            <Select
              labelId="quarterLabel"
              id="quarter"
              value={quarter}
              onChange={handleChange}
              label="Quarter"
              name="quarter"
            >
              {[...Array(4).keys()].map((num) => (
                <MenuItem key={num + 1} value={num + 1}>{num + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: '100%', my: 1 }}>
          <TextField
            label="Minutes Left"
            required
            name="minutesRemaining"
            id="minutesRemaining"
            defaultValue={minutesRemaining}
            sx={{ mr: 1, width: '20ch' }}
          />
          <TextField
            label="Seconds Left"
            required
            name="secondsRemaining"
            id="secondsRemaining"
            defaultValue={secondsRemaining}
            sx={{ ml: 1, width: '20ch' }}
          />
        </Box>
        <Box sx={{ width: '100%', my: 1 }}>
          <Typography id="score-slider" gutterBottom>
            Points
          </Typography>
          <Slider
            aria-labelledby="score-slider"
            value={points}
            marks={pointOptions}
            step={null}
            valueLabelDisplay="auto"
            name="points"
            id="points"
            onChange={handleChange}
            min={1}
            max={8}
          />
        </Box>
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
            {score.id === 0 ? 'Create' : 'Update'}
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