import api from './api';

export const userService = {
  getAllUsers: async (role = '') => {
    const response = await api.get('/users', { params: { role } });
    return response.data.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
