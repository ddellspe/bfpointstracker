import StatsSection from './components/StatsSection';
import AdminSection from './components/AdminSection';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <Container maxWidth="xl">
      <Box>
        <Typography align="center" variant="h3" component="h1" gutterBottom>
          Brian Ferentz Point Tracker
        </Typography>
      </Box>
      <StatsSection />
      <AdminSection />
    </Container>
  );
}
export default App;