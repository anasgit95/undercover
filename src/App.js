import React ,{useEffect} from 'react';
import Header from './components/Header';
import GamePage from './pages/GamePage';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});



function App() {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ''; // Nécessaire pour certains navigateurs
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Nettoyage de l'événement quand le composant est démonté
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <GamePage />
    </ThemeProvider>
  );
}

export default App;
