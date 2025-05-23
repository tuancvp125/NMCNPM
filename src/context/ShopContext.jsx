import { createContext, useEffect, useState } from "react";
import { products, formatProductData } from "../assets/assets";
import { toast } from "react-toastify";
import Product from "../pages/Product";
import { useNavigate } from "react-router-dom";
import { LogoutApi } from "../axios/axios";
import { AddProductToCartApi, GetCartApi, updateQuantityItem, removeItem, clearCart } from "../axios/order";
import { getAllProductApi } from "../axios/product";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'đ';
    const delivery_fee = 20000;
    const [search,setSearch] = useState('');
    const [showSearch,setShowSearch] = useState(false);
    const [cartItems,setCartItems] = useState({});
    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
    const [loadingProducts, setLoadingProducts] = useState(true); // Trạng thái tải sản phẩm
    const [total, setTotal] = useState("");
    const [QRCode, setQRCode] = useState("");
    // Lấy trạng thái từ localStorage (mặc định là false nếu chưa có giá trị)
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return JSON.parse(localStorage.getItem("isAuthenticated")) || false;
    });

    const navigate = useNavigate();

    // Hàm lấy dữ liệu sản phẩm
    const fetchProductData = async () => {
        try {
            const productData = await getAllProductApi(); // Gọi API lấy sản phẩm
            const formattedData = formatProductData(productData); // Định dạng dữ liệu
            setProducts(formattedData); // Cập nhật state sản phẩm
        } catch (error) {
            console.error('Failed to fetch product data:', error.message);
            toast.error('Lỗi tải sản phẩm. Vui lòng đợi.');
        } finally {
            setLoadingProducts(false); // Kết thúc trạng thái loading
        }
    };

    // Gọi fetchProductData khi component được mount
    useEffect(() => {
        fetchProductData();
    }, []);

    // Hàm để cập nhật trạng thái xác thực và lưu vào localStorage
    const handleAuthentication = (value) => {
        setIsAuthenticated(value);
        localStorage.setItem("isAuthenticated", JSON.stringify(value));
    };

    const addToCart = async (cartId, productId, quantity) => {
        try {    
            // Gọi API để thêm sản phẩm vào giỏ hàng
            const addResponse = await AddProductToCartApi(cartId, productId, quantity);
    
            // Gọi API để lấy dữ liệu giỏ hàng mới
            const updatedCartData = await GetCartApi(cartId);
    
            // Cập nhật trạng thái cartItems
            setCartItems(updatedCartData.cart);
    
            toast.success('Sản phẩm đã được thêm vào giỏ');
        } catch (error) {
            if (error.isAuthError) {
                toast.error('Bạn cần đăng nhập để thực hiện thao tác này.');
                setTimeout(() => navigate("/login"), 2000);
            } else {
                console.error('Add to cart error:', error);
                toast.error('Lỗi thêm sản phẩm vào giỏ');
            }
        }
    };         

    const getCartCount = () => {
        let totalCount = 0;
    
        // Kiểm tra nếu cartItems có giá trị và cartItems.items là một mảng
        const itemsArray = Array.isArray(cartItems?.items) ? cartItems.items : [];
    
        itemsArray.forEach(item => {
            if (item.quantity > 0) {
                totalCount += item.quantity;
            }
        });
    
        return totalCount;
    };           

    const updateQuantity = async (cartId, itemId, quantity) => {
        console.log(cartId, itemId, quantity);
        const cartData = await updateQuantityItem(cartId, itemId, quantity);
        if (cartData !== "Cart item quantity updated successfully") {
            toast.error('Lỗi khi cập nhật số lượng sản phẩm');
            return;
        }

        toast.success('Số lượng sản phẩm đã được cập nhật');

        const updatedCartData = await GetCartApi(cartId);

        setCartItems(updatedCartData.cart.items);
        setTotal(updatedCartData.total);
    }

    const removeCartItem = async (cartId, itemId) => {
        const cartData = await removeItem(cartId, itemId);

        const updatedCartData = await GetCartApi(cartId);

        setCartItems(updatedCartData.cart.items);
        setTotal(updatedCartData.total);
    }

    const removeAllCart = async (cartId) => {
        try {
          await clearCart(cartId); // Xóa toàn bộ giỏ hàng qua API
          
          const updatedCartData = await GetCartApi(cartId); // Lấy lại dữ liệu giỏ hàng
          setCartItems(updatedCartData.cart.items); // Cập nhật danh sách sản phẩm trong context
          setTotal(updatedCartData.total); // Cập nhật tổng giá trị giỏ hàng trong context
        } catch (error) {
          console.error("Error clearing cart:", error);
        }
      };

    const getCartAmount = () => {
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id === items);
            for(const item in cartItems[items]){
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }

    const logout = async () => {
        try {
          const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
      
          if (!token) {
            console.warn('No token found. Proceeding to clear session.');
          } else {
            await LogoutApi(token); // Gọi API logout
            console.log('Logged out successfully from server.');
          }
        } catch (error) {
          console.error('Error during logout:', error.response ? error.response.data : error.message);
          alert('Failed to log out from server, but session will be cleared locally.');
        } finally {
          // Dù thành công hay lỗi, vẫn xóa localStorage và điều hướng
          setIsAuthenticated(false);
          localStorage.clear();
          navigate('/login');
        }
    };
    
    const value = {
        products, loadingProducts, currency, delivery_fee,
        search,setSearch,showSearch,setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount,updateQuantity, removeCartItem, removeAllCart,
        getCartAmount, navigate, total, setTotal,
        QRCode, setQRCode,
        isAuthenticated, setIsAuthenticated, handleAuthentication, logout
    }

    return (
        <ShopContext.Provider value={value}>
            {loadingProducts ? <div>Đang tải sản phẩm, vui lòng đợi ...</div> : props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;