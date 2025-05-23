import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ResetPasswordApi } from '../axios/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [message, setMessage] = useState('');

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleRePasswordVisibility = () => {
        setShowRePassword(!showRePassword);
    };
    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                alert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm cả chữ cái viết thường, viết hoa, và số.');
                return;
            }

            if (newPassword !== rePassword) {
                alert('Mật khẩu không khớp. Vui lòng nhập lại.');
                return;
            }

            await ResetPasswordApi(token, newPassword);
            setMessage('Đặt lại mật khẩu thành công. Đang chuyển hướng...');
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessage('Lỗi khi đặt lại mật khẩu. Token không hợp lệ hoặc đã hết hạn.');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mt-20">
            <h2 className="text-2xl font-bold mb-4">Đặt lại mật khẩu</h2>
            <form onSubmit={handleReset} className="flex flex-col gap-4">
                <div className="relative w-full">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        name="password"
                        className="font-sans w-full px-3 py-2 border border-gray-800"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon
                        icon={showNewPassword ? faEye : faEyeSlash}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                    />
                </div>
                <div className="relative w-full">
                    <input
                        type={showRePassword ? "text" : "password"}
                        name="rePassword"
                        className="font-sans w-full px-3 py-2 border border-gray-800"
                        placeholder="Nhập lại mật khẩu"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        required
                    />
                    <FontAwesomeIcon
                        icon={showRePassword ? faEye : faEyeSlash}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={toggleRePasswordVisibility}
                    />
                </div>
                <button type="submit" className="bg-black text-white px-4 py-2">
                    Xác nhận
                </button>
                {message && <p className="text-sm text-center mt-2">{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;
