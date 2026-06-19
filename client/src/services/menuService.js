import api from './api';

export const menuService = {
  getAllItems: async () => {
    const response = await api.get('/menu');
    return response.data.data; // Access the 'data' property from the response
  },

  getItemById: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data.data; // Access the 'data' property from the response
  },

  createItem: async (itemData) => {
    const response = await api.post('/menu', itemData);
    return response.data.data;
  },

  updateItem: async (id, itemData) => {
    const response = await api.put(`/menu/${id}`, itemData);
    return response.data.data;
  },

  deleteItem: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  }
};
