import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { GetAllOrderApi } from '../axios/order';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const currency = "đ"; // Đơn vị tiền tệ

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await GetAllOrderApi(); // Gọi API để lấy danh sách order
        console.log(data);
        setOrders(data); // Cập nhật state với dữ liệu trả về từ API
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrders();
  }, []); // Gọi 1 lần khi component được render

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"ĐƠN HÀNG"} text2={"CỦA TÔI"} />
      </div>

      <div>
        {orders.length === 0 ? (
          <p className="font-sans text-gray-500 text-center">Không tìm thấy đơn đặt hàng nào.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="py-4 border-t border-b text-gray-700 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <p className="font-sans text-lg font-semibold">
                    ID đơn hàng: {order.id}
                  </p>
                  <p className="font-sans text-gray-500 mt-1">
                    Ngày: <span className="text-gray-400">{order.orderDate}</span>
                  </p>
                </div>
                <p className="font-sans text-gray-700 font-medium">
                  Trạng thái:{" "}
                  <span className="font-sans text-gray-600">{order.statusDescription}</span>
                </p>
                <p className="font-sans text-gray-700 font-medium">
                  Thanh toán:{" "}
                  <span className="font-sans text-gray-600">{order.payment}</span>
                </p>
              </div>

              {/* Duyệt qua tất cả các sản phẩm trong orderItems */}
              <div className="flex flex-col gap-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-6 text-sm">
                    <img
                      className="w-16 sm:w-20"
                      src={
                        item.product?.image_1 || 
                        "https://via.placeholder.com/150" // Hình ảnh mặc định nếu không có
                      }
                      alt={item.product?.name || "Product"}
                    />
                    <div>
                      <p className="font-sans sm:text-base font-medium">
                        {item.product?.name || "Product Name"}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-lg">
                          {Intl.NumberFormat().format(item.orderedProductPrice)}
                          {currency}
                        </p>
                        <p className='font-sans'>Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="font-sans text-lg font-semibold">
                  Tổng tiền: {Intl.NumberFormat().format(order.totalAmount)}{currency}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;