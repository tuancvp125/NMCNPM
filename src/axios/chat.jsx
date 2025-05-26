import axios from 'axios';
import { API_URL } from '../constant';

// Lấy tất cả các ticket
export const getAllChatTickets = async (token) => {
  const res = await axios.get(`${API_URL}/admin/chat/tickets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Lấy lịch sử chat của một ticket
export const getChatHistory = async (token, userEmail, productId) => {
  const res = await axios.get(`${API_URL}/chat/history`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { userEmail, productId }
  });
  return res.data;
};

// Gửi tin nhắn
export const sendChatMessage = async (token, userEmail, productId, content, isFromAdmin) => {
  const res = await axios.post(`${API_URL}/chat/send`, {
    userEmail,
    productId,
    content,
    isFromAdmin
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return res.data;
};
