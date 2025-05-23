import React, { useState, useEffect } from 'react';
import SearchIcon from '../../components/Assets/dashboard/search.svg';
import {API_URL} from "../../../../constant.js";

import axios from 'axios';
import './Orders.css';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số đơn hàng hiển thị mỗi trang

  const statusCodes = {
    "Khởi tạo": "INITIATED",
    "Đang giao": "SHIPPING",
    "Đã thanh toán": "PAID",
    "Hoàn thành": "COMPLETED",
    "Đã huỷ": "CANCELED",
  };

  // Lấy dữ liệu đơn hàng từ API
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(
        `${API_URL}/admin/orders/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data);
    } catch (error) {
      console.error("Error in order pages:", error);
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, status) => {
    const statusCode = statusCodes[status];
    if (!statusCode) return;

    const confirmChange = window.confirm(
      `Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng #${orderId} thành "${status}" không?`
    );
    if (!confirmChange) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.put(
        `${API_URL}/admin/orders/update-status?orderId=${orderId}&status=${statusCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        alert('Trạng thái đơn hàng đã được cập nhật!');
        fetchData();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const countOrders = (status) => {
    switch (status) {
      case 'Khởi tạo':
        return orders.filter(order => order.statusDescription?.includes('Khởi tạo')).length;
      case 'Đang giao':
        return orders.filter(order => order.statusDescription?.includes('Đang giao')).length;
      case 'Đã thanh toán':
        return orders.filter(order => order.statusDescription?.includes('Đã thanh toán')).length;
      case 'Hoàn thành':
        return orders.filter(order => order.statusDescription === 'Hoàn thành').length;
      case 'Đã huỷ':
        return orders.filter(order => order.statusDescription === 'Đã huỷ').length;
      case 'Tất cả':
      default:
        return orders.length;
    }
  };

  const filterOrders = (status) => {
    let filteredOrders = orders;
    if (status === 'Khởi tạo') filteredOrders = orders.filter(order => order.statusDescription?.includes('Khởi tạo'));
    if (status === 'Đang giao') filteredOrders = orders.filter(order => order.statusDescription?.includes('Đang giao'));
    if (status === 'Đã thanh toán') filteredOrders = orders.filter(order => order.statusDescription?.includes('Đã thanh toán'));
    if (status === 'Hoàn thành') filteredOrders = orders.filter(order => order.statusDescription === 'Hoàn thành');
    if (status === 'Đã huỷ') filteredOrders = orders.filter(order => order.statusDescription === 'Đã huỷ');

    if (search) {
      filteredOrders = filteredOrders.filter((order) => {
        const searchValue = search.toLowerCase();
        return (
          order.id.toString().toLowerCase().includes(searchValue) ||
          `${order.user.firstname} ${order.user.lastname}`.toLowerCase().includes(searchValue) ||
          order.orderDate.toLowerCase().includes(searchValue)
        );
      });
    }

    return filteredOrders;
  };

  const getPaginatedOrders = () => {
    const filteredOrders = filterOrders(activeTab);
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filterOrders(activeTab).length / itemsPerPage);

  const getStatusClass = (status) => {
    if (!status) return '';
    if (status.includes('Khởi tạo')) return 'status-green';
    if (status.includes('Đã huỷ')) return 'status-red';
    if (status.includes('Đang giao')) return 'status-blue';
    if (status.includes('Đã thanh toán')) return 'status-blue';
    if (status.includes('Hoàn thành')) return 'status-yellow';
    return '';
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="order-container">
      {/* Tabs */}
      <div className="order-tabs">
        {['Tất cả', 'Khởi tạo', 'Đang giao', 'Đã thanh toán', 'Hoàn thành', 'Đã huỷ'].map((tab) => (
          <button
            key={tab}
            className={`order-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab}
            <span>{countOrders(tab)}</span>
          </button>
        ))}
      </div>

      {/* Tìm kiếm */}
      <div className="order-search">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, mã ID"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className="search-btn">
          <img src={SearchIcon} alt="Search" />
        </button>
      </div>

      {/* Bảng đơn hàng */}
      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ngày mua</th>
            <th>Khách hàng</th>
            <th>Trạng thái</th>
            <th>Số điện thoại</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Hành động</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedOrders().map((order) => (
            <tr key={order.id}>
              <td>{`#${order.id}`}</td>
              <td>{order.orderDate}</td>
              <td>{`${order.user.firstname} ${order.user.lastname}`}</td>
              <td>
                <span className={`status ${getStatusClass(order.statusDescription)}`}>
                  {order.statusDescription}
                </span>
              </td>
              <td>{order.address.contactNumber}</td>
              <td>{order.totalAmount.toFixed(2)} VNĐ</td>
              <td>{order.payment === 'CASH_ON_DELIVERY' ? 'Thanh toán khi nhận hàng' : order.payment}</td>
              <td>
                <select
                  value={order.statusDescription}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="Khởi tạo">Khởi tạo</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã thanh toán">Đã thanh toán</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Đã huỷ">Đã huỷ</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleViewDetails(order)}>Xem chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination-order">
        <button
          className='btn-prev'
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className='btn-next'
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Tiếp
        </button>
      </div>

      {/* Modal hiển thị chi tiết đơn hàng */}
      {selectedOrder && (
         <div className="order-detail-modal" onClick={closeModal}>
  <div className="order-detail-content" onClick={(e) => e.stopPropagation()} >
    {/* Header */}
    <div className="order-header">
      <strong>Chi tiết đơn hàng # {selectedOrder.id}</strong>
    </div>

    {/* Thông tin đơn hàng */}
    <div className="order-section">
      <div className="order-left">
        <div className="order-products">

            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                    <img src={item.product.image_1} alt={item.product.name} />
                    </td>
                    <td>
                      <span>{item.product.name}</span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.product.price} VNĐ</td>
                    <td>{item.quantity * item.product.price} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </table>

          <div className="order-total">Tổng cộng: {selectedOrder.totalAmount} VNĐ</div>
        </div>
      </div>

      <div className="order-right">
        <div className="info-group">
          <p><strong>Khách hàng:</strong> {`${selectedOrder.user.firstname} ${selectedOrder.user.lastname}`}</p>
        </div>
        <div className="info-group">
          <p><strong>Email:</strong> {selectedOrder.user.email}</p>
        </div>
        <div className="info-group">
          <p className='address'><strong>Địa chỉ:</strong> {selectedOrder.address.doorNumber} - {selectedOrder.address.street} - {selectedOrder.address.district} - {selectedOrder.address.city}</p>
        </div>
      </div>
    </div>

    {/* Nút đóng */}
    <button className="btn-close-modal" onClick={closeModal}>Đóng</button>
  </div>
</div>

      )}
    </div>
  );
};

export default Order;
