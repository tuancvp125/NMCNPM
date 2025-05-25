import axios from 'axios';
import {API_URL} from "../constant.js";

async function getAllProductApi(authToken) {
    const url = `${API_URL}/user/products/all`; // Đường dẫn API
    const token = authToken; 

    try {
        const response = await axios.get(url, {
        });
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error response data:", error.response?.data || error.message);
        throw error;
    }
    
}

async function createProductApi(authToken, categoryId, name, image_1, price, description, quantity, color, size, material, productCondition) {
    const url = `${API_URL}/admin/products/add?categoryId=${categoryId}`;
    const token = authToken;

    try {
        const response = await axios.post(
            url,
            {
                name,
                image_1,
                price,
                description,
                quantity,
                color,
                size,
                material,
                productCondition
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error response data:", error.response?.data || error.message);
        throw error;
    }
}

async function updateProductApi(authToken, categoryId, id, name, price, description, quantity, color, size, material, productCondition) {
    const url = `${API_URL}/admin/products/update?categoryId=${categoryId}`;

    try {
        const response = await axios.put(
            url,
            {
                id,
                name,
                price,
                description,
                quantity,
                color,
                size,
                material,
                productCondition
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Response data:", response.data);     // Dữ liệu trả về
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        if (error.response) {
            console.error("Error response data:", error.response.data);
        } else if (error.request) {
            // Xử lý lỗi không nhận được phản hồi từ server
            console.error("No response received:", error.request);
        } else {
            // Xử lý lỗi khác (ví dụ: cấu hình request)
            console.error("Error setting up request:", error.message);
        }
        throw error; // Ném lỗi ra ngoài để xử lý tiếp
    }
}

async function deleteProductApi(authToken, id) {
    const url = `${API_URL}/admin/products/delete?id=${id}`; // Đường dẫn API

    try {
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${authToken}`, // Bearer Token
                "Content-Type": "application/json",    // Định dạng JSON
            },
        });

        console.log("Response status:", response.status); // Trạng thái HTTP
        console.log("Response data:", response.data);     // Dữ liệu trả về
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        if (error.response) {
            // Xử lý lỗi từ server (4xx, 5xx)
            console.error("Error status:", error.response.status);
            console.error("Error response data:", error.response.data);
        } else if (error.request) {
            // Xử lý lỗi không nhận được phản hồi từ server
            console.error("No response received:", error.request);
        } else {
            // Xử lý lỗi khác (ví dụ: cấu hình request)
            console.error("Error setting up request:", error.message);
        }
        throw error; // Ném lỗi ra ngoài để xử lý tiếp
    }
}

export { 
    getAllProductApi,
    createProductApi,
    updateProductApi,
    deleteProductApi
};
