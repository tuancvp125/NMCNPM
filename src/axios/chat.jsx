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

// Gửi file đính kèm (tin nhắn dạng file)
export const sendChatFile = async (token, userEmail, productId, file, isFromAdmin) => {
  console.log("chat.jsx: "+ productId);
  const formData = new FormData();
  formData.append('userEmail', userEmail);
  formData.append('productId', productId);
  formData.append('isFromAdmin', isFromAdmin);
  formData.append('file', file); // tên 'file' phải trùng với tên field mà backend mong đợi

  const res = await axios.post(`${API_URL}/chat/send-file`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  return res.data;
};
