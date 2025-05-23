

import React, { useState } from "react";
import "./Setting.css"
function Setting() {
  const [profile, setProfile] = useState({
    name: "Admin Name",
    email: "admin@example.com",
    phone: "0123456789",
    // notification: true,
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleSaveProfile = () => {
    alert("Thông tin cá nhân đã được cập nhật!");
    // Call API để lưu thông tin
  };

  const handleChangePassword = () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    alert("Mật khẩu đã được cập nhật!");
    // Call API để cập nhật mật khẩu
  };

  return (
    <div className="profile-settings">
      <h2>Cài đặt Profile</h2>

      {/* Thông tin cá nhân */}
      <div className="profile-info">
        <h3>Thông tin cá nhân</h3>
        <label>
          Họ và tên:
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Số điện thoại:
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
          />
        </label>
        {/* <label>
          Nhận thông báo:
          <input
            type="checkbox"
            name="notification"
            checked={profile.notification}
            onChange={(e) =>
              setProfile({ ...profile, notification: e.target.checked })
            }
          />
        </label> */}
        <button onClick={handleSaveProfile}>Lưu thông tin</button>
      </div>

      {/* Thay đổi mật khẩu */}
      <div className="password-change">
        <h3>Thay đổi mật khẩu</h3>
        <label>
          Mật khẩu hiện tại:
          <input
            type="password"
            name="currentPassword"
            value={password.currentPassword}
            onChange={handlePasswordChange}
          />
        </label>
        <label>
          Mật khẩu mới:
          <input
            type="password"
            name="newPassword"
            value={password.newPassword}
            onChange={handlePasswordChange}
          />
        </label>
        <label>
          Xác nhận mật khẩu:
          <input
            type="password"
            name="confirmPassword"
            value={password.confirmPassword}
            onChange={handlePasswordChange}
          />
        </label>
        <button onClick={handleChangePassword}>Cập nhật mật khẩu</button>
      </div>
    </div>
  );
};

export default Setting;