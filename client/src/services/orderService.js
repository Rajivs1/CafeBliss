import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data.data; // Access the 'data' property
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data.data; // Access the 'data' property
  },

  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data.data; // Access the 'data' property
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data.data;
  },

  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  }
};
