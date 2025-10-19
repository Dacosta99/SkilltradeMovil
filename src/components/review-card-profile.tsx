import React from 'react';
import { Card, CardContent, Avatar, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import type { ReviewProfile } from '../types/review';

interface ReviewCardProps {
    review: ReviewProfile;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
        }).format(date);
    };

    const renderStars = (rating: number) => (
        <Box sx={{ display: 'flex' }}>
        {[...Array(5)].map((_, i) => (
            <StarIcon
            key={i}
            sx={{ color: i < rating ? 'gold' : 'grey.300', fontSize: 20 }}
            />
        ))}
        </Box>
    );

    return (
        <Card sx={{ mb: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={review.author.avatar} />
                <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {review.author.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {formatDate(review.date)}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                        Servicio: {review.serviceTitle}
                    </Typography>
                </Box>
            </Box>
            {renderStars(review.rating)}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {review.comment}
            </Typography>
        </CardContent>
        </Card>
    );
};