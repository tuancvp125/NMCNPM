import axios from 'axios';
import {API_URL} from "../constant.js";

async function getAllCategoryApi(authToken) {

    const url = `${API_URL}/admin/category/all`; // Đường dẫn API
    const token = authToken; 

    try {
        const response = await axios.get(url, {
            headers: {
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

async function createCategoryApi(authToken, name) {
    const url = `${API_URL}/admin/category/add`; // Đường dẫn API
    const token = authToken; // Thay authToken bằng giá trị token hợp lệ

    try {
        const response = await axios.post(
            url,
            {
                name,        // Tên category
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Bearer Token
                    "Content-Type": "application/json" // Định dạng JSON
                }
            }
        );

        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error response status:", error.response?.status);
        console.error("Error response data:", error.response?.data || error.message);
        throw error;
    }
}
async function updateCategoryApi(authToken, categoryId, name) {
    const url = `${API_URL}/admin/category/update?categoryId=${categoryId}`; // Đường dẫn API

    try {
        const response = await axios.put(
            url,
            {
                name,        // Tên sản phẩm
                
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Bearer Token
                    "Content-Type": "application/json"    // Định dạng JSON
                }
            }
        );

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

async function deleteCategoryApi(authToken, id) {
    const url = `${API_URL}/admin/category/delete?categoryId=${id}`; // Đường dẫn API

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
    getAllCategoryApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi
};