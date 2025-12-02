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
  onSubmit: (review: { rating: number; comment: string }) => Promise<void> | void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setError(null);
      setSending(false);
    }
  }, [open]);

  const handleSend = async () => {
    if (sending) return;

    setError(null);
    setSending(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
      setRating(5);
      setComment('');
      onClose();
    } catch (err: any) {
      console.error('Error al enviar reseña:', err);
      setError(err?.message || 'No pudimos guardar tu reseña. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
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
          <Typography variant="caption" color="text.secondary">
            Califica de 1 a 5 y deja un breve comentario sobre tu experiencia.
          </Typography>
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancelar</Button>
        <Button onClick={handleSend} color="primary" variant="contained" disabled={!comment.trim() || sending}>
          {sending ? 'Enviando...' : 'Enviar reseña'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
