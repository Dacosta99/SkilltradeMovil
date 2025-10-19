import { fetchUserNameAndPhoto } from './authService';

export async function fetchReviewsFromAPI(cliente_id?: string) {
    const API_URL = 'http://localhost:8003';
    const url = cliente_id ? `${API_URL}/users/${cliente_id}/reviews` : `${API_URL}/reviews`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error al obtener las reseñas');
    }

    return await response.json();
}

export async function postReviewToAPI(review: { service_id: string, reviewer_id: string, rating: number, comment: string }) {
    const API_URL = 'http://localhost:8003/reviews';

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al enviar la reseña');
    }

    return await response.json();
}

export async function fetchReviewsByService(serviceId: string) {
    const API_URL = 'http://localhost:8003/reviews';
    const response = await fetch(`${API_URL}/service/${serviceId}`);

    if (!response.ok) {
        throw new Error('Error al obtener las reseñas del servicio');
    }

    return await response.json();
}

export async function fetchReviewsByServiceWithAuthors(serviceId: string) {
    try {
        // Obtener las reseñas del servicio
        const reviews = await fetchReviewsByService(serviceId);

        // Para cada reseña, obtener la información del autor
        const reviewsWithAuthors = await Promise.all(
            reviews.map(async (review: any) => {
                try {
                    const author = await fetchUserNameAndPhoto(review.reviewer_id);
                    return {
                        id: review.id,
                        serviceId: review.service_id,
                        rating: review.rating,
                        comment: review.comment,
                        date: review.created_at,
                        author: {
                            id: review.reviewer_id,
                            name: author.nombre_completo,
                            avatar: `http://localhost:8001${author.foto_url}`,
                        },
                    };
                } catch (error) {
                    console.error(`Error obteniendo autor para reseña ${review.id}:`, error);
                    return {
                        id: review.id,
                        serviceId: review.service_id,
                        rating: review.rating,
                        comment: review.comment,
                        date: review.created_at,
                        author: {
                            id: review.reviewer_id,
                            name: 'Usuario no disponible',
                            avatar: '',
                        },
                    };
                }
            })
        );

        return reviewsWithAuthors;
    } catch (error) {
        console.error('Error cargando reseñas con autores:', error);
        throw error;
    }
}

export async function createReviewWithAuthorInfo(reviewData: { service_id: string, reviewer_id: string, rating: number, comment: string }) {
    try {
        // Crear la reseña
        const createdReview = await postReviewToAPI(reviewData);
        
        // Obtener información del autor
        const author = await fetchUserNameAndPhoto(createdReview.reviewer_id);
        
        // Combinar la información
        return {
            id: createdReview.id,
            serviceId: createdReview.service_id,
            rating: createdReview.rating,
            comment: createdReview.comment,
            date: createdReview.created_at,
            author: {
                id: createdReview.reviewer_id,
                name: author.nombre_completo,
                avatar: `http://localhost:8001${author.foto_url}`,
            },
        };
    } catch (error) {
        console.error('Error creando reseña con información del autor:', error);
        throw error;
    }
}