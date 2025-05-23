import React, { useState, useEffect } from "react";
import {
    Enable2FAApi,
    Disable2FAApi,
    Get2FAStatusApi
} from "../axios/user";

const TwoFactorPage = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        Get2FAStatusApi()
            .then((res) => setIsEnabled(res.enabled))
            .catch(() => setIsEnabled(false));
    }, []);

    const handleEnable2FA = async () => {
        try {
            await Enable2FAApi();
            setIsEnabled(true);
            alert("2FA đã được bật. Bạn sẽ nhận OTP qua email khi đăng nhập.");
        } catch (err) {
            alert("Không thể bật 2FA: " + (err.response?.data || err.message));
        }
    };

    const handleDisable2FA = async () => {
        try {
            await Disable2FAApi();
            setIsEnabled(false);
            alert("2FA đã được tắt.");
        } catch (err) {
            alert("Không thể tắt 2FA: " + (err.response?.data || err.message));
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Xác thực hai yếu tố (2FA)</h2>
            <p>Trạng thái: {isEnabled ? "✅ Đã bật" : "❌ Đã tắt"}</p>

            {!isEnabled ? (
                <button onClick={handleEnable2FA} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                    Bật 2FA
                </button>
            ) : (
                <button onClick={handleDisable2FA} className="mt-4 bg-red-600 text-white px-4 py-2 rounded">
                    Tắt 2FA
                </button>
            )}
        </div>
    );
};

export default TwoFactorPage;
