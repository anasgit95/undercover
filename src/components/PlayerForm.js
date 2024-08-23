import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PlayerForm = ({ players, setPlayers }) => {
  const [newPlayer, setNewPlayer] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Charger les joueurs à partir du localStorage au démarrage
  useEffect(() => {
    const storedPlayers = JSON.parse(localStorage.getItem('players'));
    if (storedPlayers) {
      setPlayers(storedPlayers);
    }
  }, [setPlayers]);

  // Sauvegarder les joueurs dans le localStorage à chaque mise à jour
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const addOrUpdatePlayer = () => {
    if (newPlayer.trim() === '') return;

    if (isEditing) {
      // Modifier le joueur existant
      const updatedPlayers = [...players];
      updatedPlayers[currentIndex] = newPlayer;
      setPlayers(updatedPlayers);
      setIsEditing(false);
      setCurrentIndex(null);
    } else {
      // Ajouter un nouveau joueur
      setPlayers([...players, newPlayer]);
    }

    setNewPlayer('');
  };

  const handleEdit = (index) => {
    setNewPlayer(players[index]);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const handleDelete = (index) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    setPlayers(updatedPlayers);
  };

  const handleResetGame = () => {
    setPlayers([]);
    localStorage.removeItem('players');
  };

  const handleClearAllPlayers = () => {
    setPlayers([]);
    localStorage.removeItem('players');
  };

  return (
    <div>
      <TextField
        label="Nom du joueur"
        variant="outlined"
        value={newPlayer}
        onChange={(e) => setNewPlayer(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={addOrUpdatePlayer} fullWidth>
        {isEditing ? 'Modifier' : 'Ajouter'}
      </Button>
      <List sx={{ mt: 2 }}>
        {players.map((player, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={player} />
          </ListItem>
        ))}
      </List>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" color="warning" onClick={handleResetGame} fullWidth>
          Réinitialiser le jeu
        </Button>
        <Button variant="contained" color="error" onClick={handleClearAllPlayers} fullWidth>
          Supprimer tous les joueurs
        </Button>
      </Stack>
    </div>
  );
};

export default PlayerForm;
