import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Breadcrumbs.css'; 
import {API_URL} from "../../../../constant.js";


const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const [productName, setProductName] = useState('');
  const [productList, setProductList] = useState([]);

  const breadcrumbMap = {
    admin: 'Quản trị viên',
    dashboard: 'Tổng quan',
    products: 'Sản phẩm',
    order: 'Quản lý đơn hàng',
    "product-management": 'Quản lý sản phẩm',
    "user-management": 'Quản lý tài khoản',
    setting: 'Cài đặt',
    "category-management": 'Quản lý danh mục',
    "product-create": "Thêm sản phẩm mới",
    "product-edit": "Chỉnh sửa sản phẩm",
    "user-edit": "Chỉnh sửa người dùng",
    "user-create": "Thêm mới người dùng",

  };

  useEffect(() => {
    // Tải danh sách tất cả sản phẩm
    axios.get(`${API_URL}/user/products/all`)
      .then((response) => {
        if (response.status === 200) {
          setProductList(response.data);
        }
      })
      .catch((error) => console.error('Error fetching product list:', error));
  }, []);

  useEffect(() => {
    const productId = pathnames[pathnames.length - 1];
    if (pathnames.includes('dashboard') && !isNaN(productId)) {
      const product = productList.find((item) => item.id === parseInt(productId));
      if (product) {
        setProductName(product.name);
      } else {
        setProductName('Sản phẩm không tồn tại');
      }
    } else {
      setProductName('');
    }
  }, [pathnames, productList]);

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <li
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              key={to}
              aria-current="page"
            >
              {productName || breadcrumbMap[value] || value}
            </li>
          ) : (
            <li className="breadcrumb-item" key={to}>
              <NavLink 
                to={to}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {breadcrumbMap[value] || value}
              </NavLink>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
