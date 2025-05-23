import React, { useState } from 'react';
import { RequestPasswordResetApi } from '../axios/axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await RequestPasswordResetApi (email);
            setMessage('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
        } catch (error) {
            setMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="border px-4 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="bg-black text-white px-4 py-2">
                    Gửi liên kết đặt lại mật khẩu
                </button>
                {message && <p className="text-sm text-center mt-2">{message}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;
