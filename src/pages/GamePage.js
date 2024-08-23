import React, { useState, useEffect } from 'react';
import { Button, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import PlayerForm from '../components/PlayerForm';
import dictionary from '../words.json'; // Assurez-vous que le chemin est correct
import './GamePage.css'; // Fichier CSS pour les animations

const GamePage = () => {
  const [players, setPlayers] = useState(['anas', 'ahmed', 'dhekra', 'syrine', 'lamis']);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [guess, setGuess] = useState('');
  const [showGuessPopup, setShowGuessPopup] = useState(false);
  const [correctGuess, setCorrectGuess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  useEffect(() => {
    if (showCongratulations) {
      // Attendre 3 secondes, puis redémarrer le jeu automatiquement
      const timer = setTimeout(() => {
        setShowCongratulations(false);
        startGame(); // Redémarre le jeu après l'affichage de la popup
      }, 3000);

      // Nettoyer le timer si le composant est démonté
      return () => clearTimeout(timer);
    }
  }, [showCongratulations]);

  const handleViewRole = () => {
    setShowRole(true);
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
    setCorrectGuess(false);
    setResetConfirmOpen(false);
    setCurrentPlayerIndex(0);
    setGuess('');
    setShowCongratulations(false); // Réinitialise l'état de félicitations

    if (players.length < 4) {
      alert('Il faut au moins 4 joueurs pour commencer le jeu.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * dictionary.length);
    const selectedWords = shuffleArray(dictionary)[randomIndex];

    const roles = [];
    roles.push({ mot: 'Mr. White', role: 'Mr.White' });
    roles.push(...Array(2).fill({
      mot: selectedWords.undercover,
      role: 'undercover'
    }));
    roles.push(...Array(players.length - 3).fill({
      mot: selectedWords.civil,
      role: 'Civil'
    }));

    const shuffledRoles = shuffleArray(roles);
    const shuffledPlayers = shuffleArray(players);

    const assignedCards = shuffledPlayers.map((player, index) => ({
      player,
      role: shuffledRoles[index].role,
      mot: shuffledRoles[index].mot,
      revealed: false,
    }));

    setCards(assignedCards);
    setGameStarted(true);
    setIsModalOpen(true);

    localStorage.setItem('cards', JSON.stringify(assignedCards));
  };

  const handleNextPlayer = () => {
    if (currentPlayerIndex < cards.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setShowRole(false);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const revealCard = (index) => {
    const updatedCards = [...cards];
    updatedCards[index].revealed = true;
    setCards(updatedCards);

    localStorage.setItem('cards', JSON.stringify(updatedCards));

    if (updatedCards[index].role === 'Mr.White') {
      setShowGuessPopup(true);
    }
  };

  const handleGuessSubmit = () => {
    const correctWord = dictionary[0].undercover;
    if (guess.toLowerCase() === correctWord.toLowerCase()) {
      setCorrectGuess(true);
      setShowCongratulations(true); // Afficher le popup de félicitations
    } else {
      setCorrectGuess(false);
    }
    setShowGuessPopup(false);
  };

  const handleResetGame = () => {
    setResetConfirmOpen(true);
  };

  const confirmResetGame = () => {
    setResetConfirmOpen(false);
    startGame();
    localStorage.removeItem('cards');
  };

  const cancelResetGame = () => {
    setResetConfirmOpen(false);
  };

  return (
    <div className="game-container">
      {!gameStarted ? (
        <>
          <PlayerForm players={players} setPlayers={setPlayers} />
          <Button
            variant="contained"
            color="secondary"
            onClick={startGame}
            sx={{ mt: 2 }}
            fullWidth
            className="start-game-btn"
          >
            Commencer le jeu
          </Button>
        </>
      ) : (
        <>
          <Grid container spacing={2}>
            {cards.map((card, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  onClick={() => revealCard(index)}
                  className={`game-card ${card.revealed ? 'revealed' : ''}`}
                  sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <CardContent>
                    {card.revealed ? (
                      <>
                        <Typography variant="h6">{card.player}</Typography>
                        <Typography variant="body1">{card.role}</Typography>
                      </>
                    ) : (
                      <Typography variant="h6">{card.player}</Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog open={isModalOpen} onClose={handleNextPlayer}>
            <DialogTitle>Tour de {cards[currentPlayerIndex].player}</DialogTitle>
            <DialogContent>
              <Typography variant="h6">
                {showRole ? `${cards[currentPlayerIndex].mot}` : "Appuyez sur 'Voir le rôle' pour découvrir votre rôle."}
              </Typography>
            </DialogContent>
            <DialogActions>
              {!showRole && (
                <Button onClick={handleViewRole} color="primary" variant="contained">
                  Voir le rôle
                </Button>
              )}
              {showRole && (
                <Button onClick={handleNextPlayer} color="secondary" variant="contained">
                  Joueur suivant
                </Button>
              )}
            </DialogActions>
          </Dialog>

          <Dialog open={showGuessPopup} onClose={() => setShowGuessPopup(false)}>
            <DialogTitle>Devinez le mot</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Entrez votre réponse :</Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Votre réponse"
                fullWidth
                variant="outlined"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
              />
              {correctGuess === false && <Alert severity="error">Incorrect! Essayez encore.</Alert>}
              {correctGuess === true && <Alert severity="success">Correct! Vous avez gagné!</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleGuessSubmit} color="primary" variant="contained">
                Soumettre
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={showCongratulations} onClose={() => setShowCongratulations(false)}>
            <DialogTitle>Félicitations !</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Mr. White a deviné correctement le mot. Le jeu va redémarrer !</Typography>
            </DialogContent>
          </Dialog>

          <Dialog open={resetConfirmOpen} onClose={cancelResetGame}>
            <DialogTitle>Réinitialiser le jeu</DialogTitle>
            <DialogContent>
              <Typography variant="h6">Êtes-vous sûr de vouloir réinitialiser le jeu ?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={confirmResetGame} color="secondary" variant="contained">
                Oui
              </Button>
              <Button onClick={cancelResetGame} color="primary" variant="contained">
                Non
              </Button>
            </DialogActions>
          </Dialog>

          <Button
            variant="contained"
            color="error"
            onClick={handleResetGame}
            sx={{ mt: 2 }}
            fullWidth
          >
            Réinitialiser le jeu
          </Button>
        </>
      )}
    </div>
  );
};

export default GamePage;
