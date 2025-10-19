import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: { rating: number; comment: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSend = () => {
    onSubmit({ rating, comment });
    setRating(5);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar reseña</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Typography variant="subtitle1">Calificación</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {[1,2,3,4,5].map((star) => (
              <StarIcon
                key={star}
                sx={{ color: star <= rating ? 'gold' : 'grey.300', fontSize: 32, cursor: 'pointer' }}
                onClick={() => setRating(star)}
              />
            ))}
          </Box>
          <TextField
            label="Comentario"
            multiline
            minRows={3}
            value={comment}
            onChange={e => setComment(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancelar</Button>
        <Button onClick={handleSend} color="primary" variant="contained" disabled={!comment.trim()}>Enviar reseña</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
