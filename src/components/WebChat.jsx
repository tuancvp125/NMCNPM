import React, { useEffect, useState } from 'react';
import { getChatHistory, sendChatMessage } from '../axios/chat';

const WebChat = ({ productId, userEmail }) => {
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!userEmail || !productId) return;

    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error("Token not found"); //Check ky hon o day

        const data = await getChatHistory(token, userEmail, productId);
        setChatLog(data);
      } catch (err) {
        console.error("Lỗi fetch chat:", err);
        setError('Không thể tải cuộc trò chuyện.');
      }
    };

    fetchChat();
  }, [productId, userEmail, refresh]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("Token not found");

      await sendChatMessage(token, userEmail, productId, message);
      setMessage('');
      setRefresh(prev => !prev);
    } catch (err) {
      if (err.message.includes("Token")) {
        setError("Vui lòng đăng nhập lại.");
      } else {
        setError("Gửi tin nhắn thất bại.");
      }
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-2">Hỏi đáp với admin</h3>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="h-64 overflow-y-scroll bg-gray-100 p-3 rounded">
        {chatLog.length === 0 ? (
          <p className="italic text-gray-500">Chưa có tin nhắn.</p>
        ) : (
          chatLog.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.isFromAdmin ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-3 py-2 rounded-lg max-w-[70%] break-words ${
                msg.isFromAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-900'
              }`}>
                {msg.content}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex mt-3 gap-2">
        <input
          type="text"
          className="border p-2 rounded flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default WebChat;
