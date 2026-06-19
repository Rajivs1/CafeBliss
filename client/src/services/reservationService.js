import api from './api';

export const reservationService = {
  createReservation: async (reservationData) => {
    const response = await api.post('/reservations', reservationData);
    return response.data.data; // Access the 'data' property
  },

  getMyReservations: async () => {
    const response = await api.get('/reservations/my-reservations');
    return response.data.data; // Access the 'data' property
  },

  getAllReservations: async () => {
    const response = await api.get('/reservations');
    return response.data.data; // Access the 'data' property
  },

  updateReservation: async (id, data) => {
    const response = await api.patch(`/reservations/${id}`, data);
    return response.data.data;
  },

  cancelReservation: async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data.data;
  }
};
