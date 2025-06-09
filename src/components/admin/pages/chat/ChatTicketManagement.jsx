import React, { useEffect, useState } from 'react';
import styles from '../dashboard/Dashboard.module.css';
import {
  getAllChatTickets,
  getChatHistory,
  sendChatMessage,
  sendChatFile
} from '../../../../axios/chat';

const ChatTicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [file, setFile] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getAllChatTickets(token);
      console.log
      setTickets(data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách ticket:', err);
    }
  };

  const selectTicket = async (ticket) => {
    setSelectedTicket(ticket);
    try {
      const data = await getChatHistory(token, ticket.userEmail, ticket.productId);
      //console.log("selectTicket ID: "+ticket.productId);
      setMessages(data);
    } catch (err) {
      console.error('Lỗi khi tải tin nhắn:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSend = async () => {
    if (!reply.trim() && !file) return;
    try {

      if (file) {
        await sendChatFile(token, selectedTicket.userEmail, selectedTicket.productId, file, true);
      }
      
      if(reply.trim()){
        await sendChatMessage(token, selectedTicket.userEmail, selectedTicket.productId, reply, true);
      }
      
      console.log("ChatTicketManagement ID: "+ selectTicket.productId);

      setReply('');
      setFile(null);
      selectTicket(selectedTicket); // refresh messages
    } catch (err) {
      console.error('Gửi tin nhắn thất bại:', err);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard1}>
        <div className={styles.stat}>
          <p className={styles.stat__title}>Tổng số ticket</p>
          <p className={styles.stat__number}>{tickets.length}</p>
          <p className={styles.stat__time}>Hệ thống chat</p>
        </div>
      </div>

      <div className={styles.main__dashboard}>
        <div className={styles.right__table}>
          <div className={styles.right__tableTitle}>Danh sách Ticket</div>
          <div className={styles.right__tableWrapper}>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>ID sản phẩm</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, idx) => (
                  <tr key={idx}>
                    <td>{ticket.userEmail}</td>
                    <td>{ticket.productId}</td>
                    <td>{ticket.status}</td>
                    <td>
                      <button
                        onClick={() => selectTicket(ticket)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedTicket && (
          <div className={styles.right__table}>
            <div className={styles.right__tableTitle}>
              Trò chuyện với {selectedTicket.userEmail} ({selectedTicket.productId})
            </div>
            <div className="p-4 h-[400px] overflow-y-auto bg-white border rounded">
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.isFromAdmin ? 'text-right' : 'text-left'}`}>
                  <span
                    className={`inline-block px-3 py-2 rounded-lg max-w-[70%] break-words ${
                      msg.isFromAdmin ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.content.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={`http://localhost:9999${msg.content}`}
                        alt="chat-img"
                        className="max-w-full h-auto rounded"
                      />
                    ) : (
                      <span>{msg.content}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 p-4">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="border p-2 flex-1 rounded"
              />
              <label htmlFor="fileInput" className="cursor-pointer text-xl px-2">
                🧷
              </label>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-gray-600 italic mt-1">Tệp đã chọn: {file.name}</p>
              )}
              <button onClick={handleSend} className="bg-black text-white px-4 py-2 rounded">
                Gửi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatTicketManagement;
