import React, { useContext, useState, useEffect } from 'react'; // Thêm useEffect
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
// Sửa import: CheckOutCartApi là cho COD, VNPay cho VNPay.
// Thêm initiateSec404PaymentCheckout cho Sec404
import { clearCart, CheckOutCartApi, Payment as QRPayment, VNPay, initiateSec404PaymentCheckout } from '../axios/order';
// import { useNavigate } from 'react-router-dom'; // navigate đã có trong context

import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  // Lấy navigate từ context, hoặc nếu không có thì import và dùng const navigate = useNavigate();
  const { navigate, total, setQRCode, setCartItems, cartItems: contextCartItems } = useContext(ShopContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // State để hiển thị lỗi trên UI

  // Lấy userId và cartId từ localStorage. Đảm bảo chúng tồn tại.
  const userId = localStorage.getItem("userId");
  const cartId = localStorage.getItem("cartId") || localStorage.getItem("defaultCartId");

  const [address, setAddress] = useState({
    doorNumber: '',
    street: '',
    district: '',
    city: '',
    phone: ''
    // Quan trọng: Đảm bảo các trường này khớp với Address model ở backend
    // Backend của bạn đang nhận: doorNumber, street, city, district, contactNumber
    // Nên đổi 'phone' thành 'contactNumber' ở đây HOẶC đổi ở backend
  });

  // Tự động điền thông tin user nếu có (ví dụ)
  useEffect(() => {
      const storedUser = localStorage.getItem("user"); // Giả sử bạn lưu user info
      if (storedUser) {
          try {
              const parsedUser = JSON.parse(storedUser);
              // Giả sử user object có address, hoặc bạn có API lấy address mặc định
              if (parsedUser.defaultAddress) {
                setAddress(prev => ({
                    ...prev,
                    doorNumber: parsedUser.defaultAddress.doorNumber || '',
                    street: parsedUser.defaultAddress.street || '',
                    district: parsedUser.defaultAddress.district || '',
                    city: parsedUser.defaultAddress.city || '',
                    phone: parsedUser.defaultAddress.contactNumber || '' // Khớp với backend
                }));
              } else if (parsedUser.phone) {
                setAddress(prev => ({...prev, phone: parsedUser.phone}));
              }
          } catch (e) {
              console.error("Failed to parse user from localStorage", e);
          }
      }
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const isPhoneValid = (phone) => /^[0-9]{10,11}$/.test(phone);

  const handlePlaceOrder = async () => { // Đổi tên hàm cho rõ ràng hơn
    setError(''); // Reset lỗi cũ
    if (!address.doorNumber || !address.street || !address.district || !address.city || !address.phone) {
        alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
        return;
    }
    if (!isPhoneValid(address.phone)) {
      alert("Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).");
      return;
    }
    if (!method) {
        alert("Vui lòng chọn phương thức thanh toán.");
        return;
    }

    setLoading(true);
    const authToken = localStorage.getItem('authToken'); // Lấy token xác thực

    // Đảm bảo cấu trúc address gửi đi khớp với backend
    const addressPayload = {
        doorNumber: address.doorNumber,
        street: address.street,
        city: address.city,
        district: address.district,
        contactNumber: address.phone // Đổi tên key thành contactNumber
    };

    try {
        if (!cartId) {
            throw new Error("Không tìm thấy thông tin giỏ hàng (cartId).");
        }
        if (!userId) { // userId cũng quan trọng cho COD flow hiện tại của bạn
            throw new Error("Không tìm thấy thông tin người dùng (userId). Vui lòng đăng nhập lại.");
        }
        if (!authToken) {
            throw new Error("Bạn cần đăng nhập để thực hiện thao tác này.");
        }


        if (method === 'cod') {

            const orderResponse = await CheckOutCartApi(userId, cartId, addressPayload, "Thanh toán khi nhận hàng");
            if (localStorage.getItem('cartId')) localStorage.removeItem('cartId'); // Xóa cartId cụ thể nếu có
            localStorage.removeItem('defaultCartId'); // Xóa cả defaultCartId
            setCartItems({}); 
            // clearCart(cartId); // Gọi hàm clearCart từ context để xóa trên server nếu cần thiết
            navigate(`/thank-you?orderId=${orderResponse.orderId || orderResponse}&method=COD`); // Backend trả về orderId hoặc chỉ ID
            toast.success("Đặt hàng COD thành công!");

        } else if (method === 'qr') {
            // Logic cho QR Payment (tạo đơn hàng trước)
            // API CheckOutCartApi hiện tại đã xử lý đơn hàng (trừ kho, xóa giỏ)
            // Điều này không lý tưởng cho QR/VNPAY/Sec404 vì khách chưa thanh toán
            // Tạm thời giữ nguyên luồng của bạn: tạo đơn -> lấy QR
            const orderResponse = await CheckOutCartApi(userId, cartId, addressPayload, "Chuyển khoản qua QR code");
            const orderIdForQR = orderResponse.orderId || orderResponse; // Lấy ID đơn hàng

            const qrData = await QRPayment(orderIdForQR, total); // total từ context
            setQRCode(qrData.data.qrDataURL); // Giả sử response có data.qrDataURL
            if (localStorage.getItem('cartId')) localStorage.removeItem('cartId');
            localStorage.removeItem('defaultCartId');
            setCartItems({});
            // clearCart(cartId);
            navigate('/pay'); // Chuyển đến trang hiển thị QR
            toast.success("Đơn hàng đã được tạo. Vui lòng quét mã QR để thanh toán.");

        } else if (method === 'vnpay') {
            // Logic cho VNPay (tạo đơn hàng trước)
            const orderResponse = await CheckOutCartApi(userId, cartId, addressPayload, "Thanh toán qua VNPay");
            const orderIdForVNPay = orderResponse.orderId || orderResponse;

            const vnpayUrl = await VNPay(orderIdForVNPay, total);
            if (localStorage.getItem('cartId')) localStorage.removeItem('cartId');
            localStorage.removeItem('defaultCartId');
            setCartItems({});
            // clearCart(cartId);
            window.location.href = vnpayUrl; // Redirect đến URL thanh toán VNPay

        } else if (method === 'sec404') {

            // API này sẽ: backend tạo order (chưa trừ kho), gọi Sec404, trả về paymentUrl
            const sec404Response = await initiateSec404PaymentCheckout(cartId, addressPayload, authToken);

            if (sec404Response && sec404Response.paymentUrl) {

                // Backend nên xóa cart ID hoặc cart items sau khi callback thành công
                toast.info('Đang chuyển hướng đến cổng thanh toán Sec404...');
                window.location.href = sec404Response.paymentUrl;
            } else {
                throw new Error('Không thể khởi tạo thanh toán Sec404. Vui lòng thử lại.');
            }
        }
    } catch (error) {
        console.error("Lỗi khi đặt hàng:", error);
        // Cố gắng lấy message từ error.response.data hoặc error.message
        let displayErrorMessage = "Có lỗi xảy ra trong quá trình đặt hàng.";
        if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
                displayErrorMessage = error.response.data;
            } else if (error.response.data.message) {
                displayErrorMessage = error.response.data.message;
            }
        } else if (error.message) {
            displayErrorMessage = error.message;
        }
        toast.error(displayErrorMessage.includes("does not have enough stock")
            ? "Một hoặc nhiều sản phẩm không đủ số lượng."
            : displayErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra nếu giỏ hàng trống
  // `contextCartItems` là array từ `GetCartApi`
  const isCartEmpty = !contextCartItems || (Array.isArray(contextCartItems) && contextCartItems.length === 0);


  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Left Side - Form nhập địa chỉ */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'THÔNG TIN'} text2={'GIAO HÀNG'} />
        </div>
        <input required className="border rounded py-1.5 px-3.5" type="text" name="doorNumber" placeholder="Số nhà, tên đường" value={address.doorNumber} onChange={handleInputChange} />
        <input required className="border rounded py-1.5 px-3.5" type="text" name="street" placeholder="Phường/Xã" value={address.street} onChange={handleInputChange} />
        <div className="flex gap-3">
          <input required className="border rounded py-1.5 px-3.5 w-full" type="text" name="district" placeholder="Quận/Huyện" value={address.district} onChange={handleInputChange} />
          <input required className="border rounded py-1.5 px-3.5 w-full" type="text" name="city" placeholder="Tỉnh/Thành phố" value={address.city} onChange={handleInputChange} />
        </div>
        <input required className="border rounded py-1.5 px-3.5" type="tel" name="phone" placeholder="Số điện thoại" value={address.phone} onChange={handleInputChange} />
      </div>

      {/* Right Side - Tổng giỏ hàng và Phương thức thanh toán */}
      <div className="mt-8 w-full sm:max-w-[480px] lg:max-w-[520px]"> {/* Điều chỉnh width */}
        <CartTotal total={total} /> {/* total từ context đã được cập nhật */}

        <div className="mt-12">
          <Title text1={'PHƯƠNG THỨC'} text2={'THANH TOÁN'} />
          <div className="flex gap-3 flex-col"> {/* Cho các lựa chọn xếp chồng */}
            <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded ${method === 'cod' ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-300'}`}>
              <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400 border-green-500' : 'border-gray-400'}`}></div>
              <p>Thanh toán khi nhận hàng (COD)</p>
            </div>
            {/* QR và VNPay hiện tại đang dùng chung luồng `CheckOutCartApi`
                Nếu muốn Sec404 có luồng riêng (không trừ kho trước), nó sẽ khác
            */}
            <div onClick={() => setMethod('qr')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded ${method === 'qr' ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-300'}`}>
              <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'qr' ? 'bg-green-400 border-green-500' : 'border-gray-400'}`}></div>
              <p>Thanh toán bằng QR code VietQR</p>
            </div>
            <div onClick={() => setMethod('vnpay')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded ${method === 'vnpay' ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-300'}`}>
              <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'vnpay' ? 'bg-green-400 border-green-500' : 'border-gray-400'}`}></div>
              <img src="/src/assets/vnpay.png" alt="VNPay" className="w-6 h-6 object-contain" />
              <p>Thanh toán qua VNPay</p>
            </div>
            {/* THÊM LỰA CHỌN SEC404 */}
            <div onClick={() => setMethod('sec404')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer rounded ${method === 'sec404' ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-300'}`}>
              <div className={`min-w-3.5 h-3.5 border rounded-full ${method === 'sec404' ? 'bg-green-400 border-green-500' : 'border-gray-400'}`}></div>
              {/* Bạn có thể thêm logo của Sec404 nếu có */}
              {/* <img src="/path/to/sec404_logo.png" alt="Sec404" className="w-6 h-6" /> */}
              <p>Thanh toán qua Sec404 Gateway</p>
            </div>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <p className="text-red-500 mt-4">{error}</p>}


          <div className="w-full text-end mt-8">
            <button
              onClick={handlePlaceOrder} // Đổi tên hàm xử lý
              className="bg-black text-white px-16 py-3 text-sm rounded hover:bg-gray-800 disabled:opacity-50"
              disabled={loading || isCartEmpty} // Vô hiệu hóa nếu đang loading hoặc giỏ hàng trống
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;