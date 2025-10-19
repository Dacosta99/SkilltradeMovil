export interface Review {
  id: string;
  serviceId: string;
  rating: number;
  comment: string;
  date: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface ReviewProfile extends Review {
  serviceTitle: string;
}
