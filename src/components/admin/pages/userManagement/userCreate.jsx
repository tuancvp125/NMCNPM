import React, { useState } from "react";
import './userCreate.css';

export default function UserCreate() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleCreateUser = (e) => {
        e.preventDefault();
        const userData = new FormData();
        userData.append("email", formData.email);
        userData.append("name", formData.name);
        userData.append("phone", formData.phone);
        userData.append("address", formData.address);

        console.log("User data submitted:", formData);
    }

    return (
        <div className="user-container">
            <div className="user-header">
                <h1>Quản lý tài khoản/Tạo tài khoản</h1>
            </div>
            <form className="user-create" onSubmit={handleCreateUser}>
                <label htmlFor="email">
                    <span>Email</span> 
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}/>
                </label>
                <label htmlFor="name">
                    <span>Tên</span>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}/>
                </label>
                <label htmlFor="phone">
                    <span>Số điện thoại</span>
                    <input type="number" id="phone" name="phone" value={formData.phone} onChange={handleChange} min="0"/>
                </label>
                <label htmlFor="address">
                    <span>Địa chỉ</span>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange}/>
                </label>
                <input type="submit" value="Tạo"/>
            </form>
        </div>
    );
}
