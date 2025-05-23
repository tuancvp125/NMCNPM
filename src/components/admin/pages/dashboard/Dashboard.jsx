
  import React, { useEffect, useState } from "react";
  import styles from "./Dashboard.module.css";
  import axios from "axios";
  import { Link } from "react-router-dom";
  import ReactPaginate from "react-paginate";
  import { Pie } from "react-chartjs-2"; // Import Pie chart từ react-chartjs-2
  import CartIcon from '/src/components/admin/components/Assets/dashboard/cart.svg';
  import DollarIcon from '/src/components/admin/components/Assets/dashboard/dollar.svg';
  import TruckIcon from '/src/components/admin/components/Assets/dashboard/truck.svg';
  import SackDollarIcon from '/src/components/admin/components/Assets/dashboard/sackDollar.svg';
  import { getAllProductApi } from "../../../../axios/product";
import {API_URL} from "../../../../constant.js";

  import DailyChart from "../../components/Chart/DailySales";

  import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from "chart.js";

  // Đăng ký các thành phần cần thiết
  ChartJS.register(ArcElement, Tooltip, Legend);

  function Dashboard() {
    const [allProducts, setAllProducts] = useState([]);
    const [totalProductsInMonth, setTotalProductsInMonth] = useState(0); // State cho tổng số sản phẩm
    const [totalProducts, setTotalProducts] = useState(0); // State cho tổng số sản phẩm
    const [totalRevenue, setTotalRevenue] = useState(0); // State cho tổng doanh thu
    const [currentPage, setCurrentPage] = useState(0);
    const [productsPerPage] = useState(5);
    const [currentOrders, setCurrentOrders] = useState([]);
    const [producstInWeek, setProductsInWeek] = useState(0);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Lấy token từ localStorage
        if (!token) {
          console.error("No auth token found");
          return;
        }
        const products = await getAllProductApi(token); // Gọi API để lấy dữ liệu sản phẩm
        
        const totalQuantity = products.reduce((total, product) => {
          return total + (product.quantity-product.b_quantity || 0); // Giả sử 'stock' là số lượng của sản phẩm
        }, 0);

        setTotalProducts(totalQuantity);
        setAllProducts(products); // Cập nhật state với dữ liệu nhận được
      } catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
      }
    };

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken')
        console.log(token);
        // Gửi yêu cầu API với token trong header Authorization
        const response = await axios.get(`${API_URL}/admin/orders/current-month`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.status === 200) {
          const orders = response.data; // Dữ liệu trả về từ API
          let totalProductsCount = 0;
          let totalRevenueCount = 0;

          // Lặp qua từng đơn hàng
          orders.forEach((order) => {
            order.orderItems.forEach((item) => {
              totalProductsCount += item.quantity; // Đếm số lượng sản phẩm
              totalRevenueCount += item.quantity * item.product.price; // Tính doanh thu
            });
          });



          // Cập nhật giá trị trong state
          setTotalProductsInMonth(totalProductsCount);
          setTotalRevenue(totalRevenueCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchOrdersCurrentWeek = async () => {
      try {
        const token = localStorage.getItem('authToken')
        console.log(token);
        // Gửi yêu cầu API với token trong header Authorization
        const response = await axios.get(`${API_URL}/admin/orders/current-week`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.status === 200) {
          const orders = response.data; // Dữ liệu trả về từ API
          let totalProductsCount = 0;

          // Lặp qua từng đơn hàng
          orders.forEach((order) => {
            order.orderItems.forEach((item) => {
              totalProductsCount += item.quantity; // Đếm số lượng sản phẩm
            });
          });


          setCurrentOrders(orders);
          // Cập nhật giá trị trong state
          setProductsInWeek(totalProductsCount);
          console.log("donhangtuannay",orders);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    useEffect(() => {
      fetchData();
    }, []);
    useEffect(() => {
      fetchOrders();
    }, []);
    useEffect(() => {
      fetchOrdersCurrentWeek();
    }, []);



    const sortedProducts = allProducts.slice().sort((a, b) => b.b_quantity - a.b_quantity);
    const offset = currentPage * productsPerPage;
    const currentPageProducts = sortedProducts.slice(
      offset,
      offset + productsPerPage
    );

    const handlePageChange = ({ selected }) => {
      setCurrentPage(selected);
    };


    return (
      <>
        <div className={styles.dashboard}>
          {/* Thống kê */}
          <div className={styles.dashboard1}>
            <div className={styles.stat}>
              <p className={styles.stat__title}>Doanh số </p>
              <p className={styles.stat__number}>{totalRevenue} VNĐ</p>
              <p className={styles.stat__time}>Tháng này</p>
              <img src={SackDollarIcon} className={styles.icon} />
            </div>
            <div className={styles.stat}>
              <p className={styles.stat__title}>Đã bán</p>
              <p className={styles.stat__number}>{producstInWeek} &nbsp; sản phẩm</p>
              <p className={styles.stat__time}>Tuần này</p>
              <img src={DollarIcon} className={styles.icon} />

            </div>
            <div className={styles.stat}>
              <p className={styles.stat__title}>Đã bán</p>
              <p className={styles.stat__number}>{totalProductsInMonth}  &nbsp; sản phẩm </p>
              <p className={styles.stat__time}>Tháng này</p>
              <img src={CartIcon} className={styles.icon} />

            </div>
            <div className={styles.stat}>
              <p className={styles.stat__title}>Sản phẩm </p>
              <p className={styles.stat__number}>{totalProducts}   &nbsp; sản phẩm </p>
              <p className={styles.stat__time}>Trong kho</p>
              <img src={TruckIcon} className={styles.icon} />
              

              </div>
          </div>

          <div className={styles.main__dashboard}>
          <div className={styles.daily__chart}>
              <div className={styles.right__tableTitle}>Doanh số các ngày gần đây</div>
              <div className={styles.right__chart}><DailyChart /></div>
              <div className={styles.right__tableTitle}>Đơn hàng mới nhất</div>
              <div className="recent-orders">
                  <table className={styles.order__table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Ngày mua</th>
                        <th>Khách hàng</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                    {currentOrders
                      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)) // Sort by orderDate in descending order
                      .slice(0, 10) // Get the first 3 most recent orders
                      .map((order) => (
                        <tr key={order.id}>
                          <td>{`#${order.id}`}</td>
                          <td>{order.orderDate}</td>
                          <td>{`${order.user.firstname} ${order.user.lastname}`}</td>
                          {/* <td>{order.statusDescription}</td> */}
                          <td>
                            <span className={
                            order.statusDescription === "Khởi tạo" ? styles.status__created :
                            order.statusDescription === "Đã huỷ" ? styles.status__cancelled :
                            order.statusDescription === "Hoàn thành" ? styles.status__completed :
                            order.statusDescription === "Đang giao" ? styles.status__shipping :
                            order.statusDescription === "Đã thanh toán" ? styles.status__paid :
                            '' // Default class if none match
                          }> {order.statusDescription} </span>
                            
                          </td>

                          <td>{order.totalAmount} VNĐ</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>

              </div>
              {/* Bảng sản phẩm */}
              
              <div className={styles.right__table}>
                <div className={styles.right__tableTitle}>Top sản phẩm bán chạy</div>
                <div className={styles.right__tableWrapper}>
                  <table>
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Hình ảnh</th>
                        <th>Sản phẩm</th>
                        <th>Đã bán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPageProducts.map((product, index) => {
                        return (
                          <tr key={index}>
                            <td data-label="STT">{index + 1 + offset}</td>
                            <td data-label="Hình ảnh">
                              <Link to={`/admin/dashboard/${product.id}`}>
                                <img src={product.image_1} alt="" />
                              </Link>
                            </td>
                            <td data-label="Sản phẩm">
                              <Link to={`/admin/dashboard/${product.id}`}>
                                <strong>{product.name}</strong>
                                <br />
                                <span>{product.price}</span>
                                <br />
                                <span>Danh mục: {product.category.name}</span>
                              </Link>
                            </td>
                            <td data-label="Đã bán">{product.b_quantity}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <ReactPaginate
                  previousLabel={"Trước"}
                  nextLabel={"Tiếp"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(sortedProducts.length / productsPerPage)}
                  onPageChange={handlePageChange}
                  containerClassName={styles.pagination}
                  activeClassName={styles.active}
                />
              </div>


            
          </div>
        </div>
      </>
    );
  }

  export default Dashboard;
