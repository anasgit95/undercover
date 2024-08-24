import React, { useState, useEffect } from 'react';
import { Button, Grid, Card, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import PlayerForm from '../components/PlayerForm';
import dictionary from '../words.json';
import './GamePage.css';
import undercover from '../assets/images/underover.png';
import civil from '../assets/images/civil.png';
import white from '../assets/images/white.png';
import score from '../assets/images/score.png';
import who from '../assets/images/who.jpg';


const GamePage = () => {
  const [players, setPlayers] = useState(['player1', 'player2', 'player3', 'player4', 'player5']);
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
  const [startPlayerIndex, setStartPlayerIndex] = useState(0);
  const [scores, setScores] = useState([]);


   

  useEffect(() => {
    if (showCongratulations) {
        updateScores('Mr.White');

      const timer = setTimeout(() => {
        setShowCongratulations(false);
        startGame();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showCongratulations]);

  const handleViewRole = () => {
    setShowRole(true);
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const updateScores = (winningRole) => {
    const updatedScores = { ...scores };
    cards.forEach(card => {
      if (winningRole === 'Civil' && card.role === 'Civil') {
        updatedScores[card.player] = (updatedScores[card.player] || 0) + 1;
      } else if (winningRole === 'undercover' && card.role === 'undercover') {
        updatedScores[card.player] = (updatedScores[card.player] || 0) + 2;
      } else if (winningRole === 'Mr.White' && card.role === 'Mr.White') {
        updatedScores[card.player] = (updatedScores[card.player] || 0) + 3;
      }
    });
    setScores(updatedScores);
  };
  

  const startGame = () => {
    setShowRole(false)
    setCorrectGuess(false);
    setResetConfirmOpen(false);
    setCurrentPlayerIndex(0);
    setGuess('');
    setShowCongratulations(false);

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
 
    const assignedCards =  players.map((player, index) => ({
      player,
      role: shuffledRoles[index].role,
      mot: shuffledRoles[index].mot,
      revealed: false,
    }));

    setCards(assignedCards);
    setGameStarted(true);
    setIsModalOpen(true);

    localStorage.setItem('cards', JSON.stringify(assignedCards));

    // Choisir aléatoirement un joueur qui n'est pas Mr. White pour commencer
    const nonWhitePlayers = assignedCards.filter(card => card.role !== 'Mr.White');
    const randomStartingPlayerIndex = Math.floor(Math.random() * nonWhitePlayers.length);
    const startingPlayer = nonWhitePlayers[randomStartingPlayerIndex].player;

    const startingPlayerIndex = assignedCards.findIndex(card => card.player === startingPlayer);
    setStartPlayerIndex(startingPlayerIndex);
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
   if( updatedCards.filter(card=>!card.revealed && card.role==='Civil').length === updatedCards.filter(card=>!card.revealed).length)
   updateScores('Civil') 
   if( updatedCards.filter(card=>!card.revealed && card.role==='undercover').length === updatedCards.filter(card=>!card.revealed).length)
   updateScores('Undercover') 

    if (updatedCards[index].role === 'Mr.White') {
      setShowGuessPopup(true);
    }
  };
 
  const handleGuessSubmit = () => {
     const correctWord = cards.filter(card=>card.role==='Civil')[0].mot;
    if (guess.toLowerCase() === correctWord.toLowerCase()) {
      setCorrectGuess(true);
      setShowCongratulations(true);
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
    setShowRole(false)
    startGame();
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
                    position:'relative'
                  }}
                >
                  <CardContent >
                    {index===startPlayerIndex?<p style={{color:'red',fontSize:25,position:'absolute',background:'black',top:0,borderRadius:'50%',width:40,height:40}}>1</p> :''}
                    {card.revealed ? (
                      <>
                        <Typography variant="h6">{card.player}</Typography>
                        {card.role==='Civil'?
                        <img src={civil} style={{height:50}} alt="Example" />
                        :card.role==='undercover'?
                        <img src={undercover} style={{height:50}} alt="Example" />
                        :<img src={white}   style={{height:50}} alt="Example" />


                    }
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

          <Dialog open={isModalOpen} onClose={handleNextPlayer} style={{textAlign:"center",alignItems:"center"}}>
            <DialogTitle color="#40E0D0" fontFamily='cursive'>Tour de {cards[currentPlayerIndex].player}</DialogTitle>
            <img src={who} style={{height:80}}/>
            <DialogContent>
              
              <Typography variant="h6" style={{fontWeight:"bold"}}>
                {showRole ? `${cards[currentPlayerIndex].mot}` : ""}
              </Typography>
            </DialogContent>
            <DialogActions style={{alignContent:"center",alignItems:"center",textAlign:"center"}}>
              {!showRole && (
                <Button style={{justifyContent:"center",background:'#40E0D0',color:'white',fontWeight:'bold'}} onClick={handleViewRole} color='secondary' variant='text'>
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
          <div className="game-container" style={{textAlign:"center"}}>
<img src={score} style={{maxWidth:200}}/>      
<table className="score-table">
        <thead>
          <tr>
            <th>Joueur</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(scores).map((player, index) => (
            <tr key={index}>
              <td>{player}</td>
              <td>{scores[player]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Le reste du code de l'interface */}
    </div>
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
