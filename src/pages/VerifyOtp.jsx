import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Verify2FAApi } from "../axios/axios";
import { ShopContext } from "../context/ShopContext";

const VerifyOtp = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { handleAuthentication } = useContext(ShopContext);

    const email = localStorage.getItem("pendingEmail");

    // Redirect if email is missing (e.g. after refresh)
    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6 || isNaN(otp)) {
            setError("Vui lòng nhập mã OTP hợp lệ gồm 6 chữ số.");
            return;
        }

        try {
            const res = await Verify2FAApi(email, otp);

            // Save login info after OTP success
            localStorage.setItem("authToken", res.token);
            localStorage.setItem("userName", res.name);
            localStorage.setItem("userId", res.userId);
            localStorage.setItem("userEmail", res.email);
            localStorage.setItem("userRole", res.role);
            localStorage.setItem("defaultCartId", res.defaultCartId);
            localStorage.removeItem("pendingEmail");

            handleAuthentication(true);

            navigate(res.role === "ADMIN" ? "/admin" : "/");
        } catch (err) {
            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Mã OTP không đúng hoặc đã hết hạn.";
            setError(message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center mt-16 p-6 max-w-sm mx-auto bg-white shadow rounded">
            <h2 className="text-2xl font-semibold mb-4">Xác thực mã OTP</h2>
            <p className="text-sm mb-4 text-gray-600">
                Nhập mã OTP gồm 6 chữ số đã được gửi đến email:{" "}
                <strong>{email || "Không tìm thấy"}</strong>
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    placeholder="Nhập mã OTP"
                    className="border border-gray-300 px-3 py-2 rounded text-center text-lg tracking-widest"
                />
                {error && (
                    <p className="text-red-600 text-sm">{String(error)}</p>
                )}
                <button type="submit" className="bg-black text-white py-2 rounded mt-2">
                    Xác minh
                </button>
            </form>
        </div>
    );
};

export default VerifyOtp;
