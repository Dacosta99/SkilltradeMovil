import type { Review } from '../types/review';

export const reviews: Review[] = [
  {
    id: '1',
    serviceId: '684cfbd93229323fa6dec960',
    rating: 5,
    comment: 'Excelente profesor de guitarra. Muy paciente y explica todo de manera clara y sencilla. Recomendado 100%.',
    date: '2023-05-15T14:30:00Z',
    author: {
      id: 'user5',
      name: 'Miguel Fernández',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=6'
    }
  },
  {
    id: '2',
    serviceId: '684cfbd93229323fa6dec960',
    rating: 4,
    comment: 'Muy buenas clases, he aprendido mucho en poco tiempo. El único inconveniente es que a veces las clases se alargan más de lo previsto.',
    date: '2023-04-22T10:15:00Z',
    author: {
      id: 'user6',
      name: 'Elena Ruiz',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=7'
    }
  },
  {
    id: '3',
    serviceId: '6850e19bcdb58da2bec5a294',
    rating: 5,
    comment: 'Ana arregló mi ordenador en tiempo récord. Muy profesional y con un precio muy justo. Volveré a contactarla si tengo más problemas.',
    date: '2023-06-03T16:45:00Z',
    author: {
      id: 'user7',
      name: 'Javier Torres',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=8'
    }
  },
  {
    id: '4',
    serviceId: '6850e19bcdb58da2bec5a294',
    rating: 5,
    comment: 'Servicio impecable. No solo arregló mi portátil sino que me dio consejos para mantenerlo en buen estado. Muy recomendable.',
    date: '2023-05-28T09:20:00Z',
    author: {
      id: 'user8',
      name: 'Carmen Díaz',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=9'
    }
  },
  {
    id: '5',
    serviceId: '6850e214cdb58da2bec5a295',
    rating: 5,
    comment: 'Las clases de cocina con Roberto son fantásticas. He aprendido recetas deliciosas y técnicas que no conocía. Ambiente muy agradable.',
    date: '2023-06-10T18:30:00Z',
    author: {
      id: 'user9',
      name: 'Pablo Moreno',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=10'
    }
  },
  {
    id: '6',
    serviceId: '68516024beb55e356a9988ff',
    rating: 4,
    comment: 'Laura diseñó un logo muy profesional para mi negocio. El proceso fue fluido y entendió perfectamente lo que buscaba. Solo 4 estrellas porque me hubiera gustado recibir más opciones iniciales.',
    date: '2023-05-05T11:15:00Z',
    author: {
      id: 'user10',
      name: 'Sofía Navarro',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=11'
    }
  },
  {
    id: '7',
    serviceId: '5',
    rating: 5,
    comment: 'Miguel cuidó de mi gato durante mis vacaciones y estoy muy satisfecho. Me enviaba fotos diarias y mi mascota estaba feliz cuando regresé. Definitivamente volveré a contar con él.',
    date: '2023-06-20T14:00:00Z',
    author: {
      id: 'user1',
      name: 'Carlos Mendoza',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=2'
    }
  },
  {
    id: '8',
    serviceId: '6',
    rating: 5,
    comment: 'Las clases de yoga con Elena son justo lo que necesitaba. Ha adaptado las sesiones a mis necesidades y he notado una gran mejora en mi flexibilidad y bienestar general.',
    date: '2023-06-15T17:30:00Z',
    author: {
      id: 'user2',
      name: 'Ana Martínez',
      avatar: 'https://img.heroui.chat/image/avatar?w=200&h=200&u=3'
    }
  }
];
