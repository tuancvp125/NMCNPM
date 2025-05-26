import axios from 'axios';
import {API_URL} from "../constant.js";

async function CreateCartApi(userId) {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const response = await axios.post(
            `${API_URL}/cart/create`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    user_id: userId,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error during CreateCartApi: ', error.response ? error.response.data : error.message);
        if (error.message === 'Token not found. Please log in again.') {
            error.isAuthError = true; // Đánh dấu đây là lỗi xác thực
        }
        throw error;
    }
}

async function GetCartApi(cartId) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gửi yêu cầu GET
        const response = await axios.get(`${API_URL}/cart/get`, {
            params: { id: cartId },
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while fetching cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function AddProductToCartApi(cartId, productId, quantity) {
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        const url = `${API_URL}/cart/add/items?cartId=${cartId}&productId=${productId}&quantity=${quantity}`;

        const response = await axios.post(url, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error while adding product to cart:', error.response ? error.response.data : error.message);
        if (error.message === 'Token not found. Please log in again.') {
            error.isAuthError = true; // Đánh dấu đây là lỗi xác thực
        }
        throw error;
    }
}

async function updateQuantityItem(cartId, itemId, quantity) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gửi yêu cầu PUT với query parameters
        const response = await axios.put(
            `${API_URL}/cart/update/item/quantity`,
            null, // No body content required for PUT request
            {
                params: {
                    cartId: cartId,    // Cart ID
                    itemId: itemId,    // Item ID
                    quantity: quantity // New quantity
                },
                headers: {
                    Authorization: `Bearer ${token}` // Authorization header with the token
                }
            }
        );

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while updating cart:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function removeItem(cartId, itemId) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gửi yêu cầu DELETE
        const response = await axios.delete(
            `${API_URL}/cart/remove/items`,
            {
                params: {
                    cartId: cartId,    // Query Parameter: Cart ID
                    itemId: itemId,    // Query Parameter: Item ID
                },
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong Authorization Header
                }
            }
        );

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while removing cart item:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function clearCart(cartId) {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gửi yêu cầu DELETE
        const response = await axios.delete(
            `${API_URL}/cart/clear`,
            {
                params: {
                    id: cartId
                },
                headers: {
                    Authorization: `Bearer ${token}` // Gửi token trong Authorization Header
                }
            }
        );

        // Trả về dữ liệu từ API
        return response.data;
    } catch (error) {
        console.error('Error while removing cart item:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function CheckOutCartApi(userId, cartId, address, paymentMethod) {
    try {
        // Token từ localStorage hoặc thay thế bằng giá trị cố định (nếu cần)
        const token = localStorage.getItem('authToken'); // Thay bằng token thực tế

        // URL endpoint
        const url = `${API_URL}/orders/checkout?userId=${userId}&cartId=${cartId}&paymentMethod=${paymentMethod}`;

        // Body chứa thông tin địa chỉ
        const body = {
            doorNumber: address.doorNumber,
            street: address.street,
            city: address.city,
            district: address.district,
            contactNumber: address.phone
        };

        // Gửi yêu cầu POST
        const response = await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${token}`, // Thêm Bearer token
                'Content-Type': 'application/json', // Đảm bảo đúng định dạng JSON
            },
        });

        // Trả về kết quả
        return response.data;
    } catch (error) {
        console.error('Error while checking out cart:', error.response ? error.response.data : error.message);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
}

async function Payment(id_dh, amount) {
    try {
        // URL endpoint
        const url = "https://api.vietqr.io/v2/generate";

        // Body chứa thông tin địa chỉ
        const body = {
            "accountNo": "0964406858",
            "accountName": "DINH THI PHUONG THUY",
            "acqId": "970422",
            "addInfo": `Thanh toán đơn hàng ${id_dh}`,
            "amount": String(amount), // Chuyển sang chuỗi nếu cần
            "template": "compact2"
        };

        // Gửi yêu cầu POST
        const response = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json', // Đảm bảo đúng định dạng JSON
            },
        });

        // Trả về kết quả
        return response.data;
    } catch (error) {
        console.error('Error while processing payment:', error.response ? error.response.data : error.message);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
}

async function VNPay(id_dh, amount) {
    try {
      // URL endpoint
        const url = `${API_URL}/api/vnpay/create-payment?amount=${amount}&orderInfo=${id_dh}`;
  
        console.log("Requesting VNPay API with:", { id_dh, amount });
    
        // Gửi yêu cầu POST mà không cần body
        const response = await axios.post(url, {}, {
            headers: {
            'Content-Type': 'application/json', // Đảm bảo đúng định dạng JSON
            },
        });
    
        // Log và trả về kết quả
        console.log("VNPay API Response:", response.data);
        return response.data;
        } catch (error) {
        console.error('Error while processing payment:', error);
    
        // Lấy thông tin lỗi chi tiết
        const errorMessage = error.response?.data || error.message || "Có lỗi xảy ra.";
        throw new Error(`Payment error: ${errorMessage}`);
    }
}

async function GetAllOrderApi() {
    try {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');

        if (!token) {
            throw new Error('Token not found. Please log in again.');
        }

        // Gọi API với cấu hình đúng
        const response = await axios.get(`${API_URL}/orders/all`, {
            params: {
                userId: userId // Truyền userId qua params
            },
            headers: {
                Authorization: `Bearer ${token}` // Header với token
            }
        });

        // Trả về kết quả
        return response.data;
    } catch (error) {
        console.error('Error while fetching orders:', error.response ? error.response.data : error.message);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
}

// HÀM MỚI CHO SEC404PAYMENT
/**
 * Khởi tạo thanh toán với Sec404Payment.
 * Sẽ gọi API backend để tạo đơn hàng ban đầu và sau đó lấy URL thanh toán từ Sec404.
 * @param {string} cartId - ID của giỏ hàng.
 * @param {object} address - Đối tượng địa chỉ giao hàng.
 * @param {string} token - JWT token để xác thực.
 * @returns {Promise<object>} - Promise chứa { paymentUrl: "..." } nếu thành công.
 */
const initiateSec404PaymentCheckout = async (cartId, address, token) => {
    try {
        // API Backend: POST /api/sec404payment/initiate-checkout
        // Nhận cartId làm query param và address làm request body
        const response = await axios.post(
            `${API_URL}/api/sec404payment/initiate-checkout?cartId=${cartId}`,
            address, // address object là request body
            {
                headers: {
                    'Content-Type': 'application/json', // Đảm bảo backend nhận đúng
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data; // Mong đợi backend trả về { paymentUrl: "URL_CUA_SEC404" }
    } catch (error) {
        console.error("Error initiating Sec404 payment checkout:", error.response ? error.response.data : error.message);
        // Ném lỗi để component PlaceOrder.jsx có thể bắt và hiển thị
        // Bạn có thể muốn chuẩn hóa đối tượng lỗi trả về
        const errData = error.response?.data;
        if (errData && typeof errData === 'string') { // Nếu backend trả lỗi là string
             throw new Error(errData);
        }
        throw errData || error; // Ném lỗi để component xử lý
    }
};

export { 
    CreateCartApi, 
    GetCartApi, 
    AddProductToCartApi, 
    updateQuantityItem,
    removeItem,
    clearCart,
    CheckOutCartApi, 
    Payment,
    GetAllOrderApi,
    VNPay,
    initiateSec404PaymentCheckout
};