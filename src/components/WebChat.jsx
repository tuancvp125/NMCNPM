import React, { useEffect, useState } from 'react';
import { getChatHistory, sendChatMessage, sendChatFile } from '../axios/chat';

const WebChat = ({ productId, userEmail }) => {
  const [chatLog, setChatLog] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!userEmail || !productId) return;

    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error("Token not found");

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
    if (!message.trim() && !file) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("Token not found");

      if (file) {
        await sendChatFile(token, userEmail, productId, file, false);
      }

      if (message.trim()) {
        await sendChatMessage(token, userEmail, productId, message, false);
      }

      setMessage('');
      setFile(null);
      setRefresh(prev => !prev);
    } catch (err) {
      if (err.message.includes("Token")) {
        setError("Vui lòng đăng nhập lại.");
      } else {
        setError("Gửi tin nhắn thất bại.");
        console.log("LỖIIIIIIIII: "+ err.message);
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const renderMessageContent = (msg) => {
    if (!msg.isFile) {
      return <span>{msg.content}</span>;
    }

    const isImage = msg.content.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    return isImage ? (
      <img
        src={msg.content}
        alt="Ảnh đính kèm"
        className="max-w-full h-auto rounded"
      />
    ) : (
      <a
        href={msg.content}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-600"
      >
        📎 Tải file
      </a>
    );
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
            <div key={idx} className={`mb-2 ${msg.isFromAdmin ? 'text-left' : 'text-right'}`}>
              <div
                className={`inline-block px-3 py-2 rounded-lg max-w-[70%] break-words ${
                  !msg.isFromAdmin ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {renderMessageContent(msg)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex mt-3 gap-2 items-center">
        <input
          type="text"
          className="border p-2 rounded flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
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
          <p className="text-sm text-gray-600 italic truncate max-w-[150px]">{file.name}</p>
        )}
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default WebChat;
