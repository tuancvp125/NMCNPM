import axios from 'axios';
import {API_URL} from "../constant.js";

async function getAllUserApi(authToken) {
    const url = `${API_URL}/admin/users/get`; // Đường dẫn API
    const token = authToken; 

    try {
        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        });
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error response status:", error.response?.status);
        console.error("Error response data:", error.response?.data || error.message);
        throw error;
    }
    
}

/*async function changeRole(userEmail) {
    const token = localStorage.getItem('authToken');  // Lấy token từ localStorage
    console.log(userEmail);
    
    if (!token) {
        console.error("Token không tồn tại trong localStorage");
        return;
    }

    const url = `${API_URL}/user/${userEmail}/role?newRole=ADMIN`;

    try {
        const response = await axios.put(url, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,  // Thêm token vào header
            },
        });

        console.log("Thay đổi vai trò thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thay đổi vai trò:", error);
        throw error;
    }
}*/

async function Enable2FAApi() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    try {
        const response = await axios.post(`${API_URL}/user/enable-2fa`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error enabling 2FA:", error.response?.data || error.message);
        throw error;
    }
}

async function Disable2FAApi() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    try {
        const response = await axios.post(`${API_URL}/user/disable-2fa`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error disabling 2FA:", error.response?.data || error.message);
        throw error;
    }
}

async function Get2FAStatusApi() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        throw new Error("Authentication token not found");
    }

    try {
        const response = await axios.get(`${API_URL}/user/2fa-status`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error getting 2FA status:", error.response?.data || error.message);
        throw error;
    }
}

export { 
    getAllUserApi,
    Get2FAStatusApi,
    Disable2FAApi,
    Enable2FAApi
};