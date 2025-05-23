import React from "react";
import styles from "./Sidebar.module.css";
import logo from "../Assets/sidebar/logo.png";
import { NavLink } from "react-router-dom";
import  DashboardIcon  from '../Assets/sidebar/dashboard.svg';
import  UserIcon from "../Assets/header/user.svg";
import  CartIcon  from "../Assets/sidebar/cart.svg";
import  LogoutIcon  from "../Assets/sidebar/logout.svg";
import  TruckIcon  from "../Assets/sidebar/truck.svg";
import SettingIcon  from "../Assets/sidebar/setting.svg";
import {LogoutApi} from '../../../../axios/axios'

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sideLogo}>
        <img src={logo} alt="Logo" />
      </div>
      <nav>
        <ul>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <img src={DashboardIcon} className={styles.sideIcon} />
            Tổng quan
          </NavLink>

          <NavLink
            to="/admin/order"
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <img src={TruckIcon} className={styles.sideIcon} />
            Bán hàng
          </NavLink>
          <NavLink
            to="/admin/product-management"
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <img src={CartIcon} className={styles.sideIcon} />
            Quản lý sản phẩm
          </NavLink>
          <NavLink
            to="/admin/user-management"
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <img src={UserIcon} className={styles.sideIcon} />
            Quản lý tài khoản
          </NavLink>
          <NavLink
            to="/admin/category-management"
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <img src={SettingIcon} className={styles.sideIcon} />
            Quản lý danh mục
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
            onClick={async () => {
              const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
              if (!token) {
                alert('Không tìm thấy token, vui lòng đăng nhập lại!');
                return;
              }
              try {
                await LogoutApi(token); // Gọi API với token
                alert('Đăng xuất thành công!');
                localStorage.clear()
                window.location.href = "/"; // Chuyển hướng về trang chủ
              } catch (error) {
                alert('Đăng xuất thất bại, vui lòng thử lại.');
                console.error('Error during logout:', error.response || error.message);
              }
            }}
          >
            <img src={LogoutIcon} className={styles.sideIcon}/>
            Thoát
          </NavLink>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;

