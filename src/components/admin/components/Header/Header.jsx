import React from "react";
import styles from "./Header.module.css";
import UserIcon  from "../Assets/sidebar/user.svg";
import NotificationIcon from "../Assets/header/notification.svg";

function Header() {
  const adminName=localStorage.getItem("userName");
  return (
    <header className={styles.header}>
      <div className={styles.icons}>
        <span className="admin-name">{adminName}</span>
        <img src={UserIcon} className={styles.icon} />
        
      </div>
    </header>
  );
}

export default Header;
