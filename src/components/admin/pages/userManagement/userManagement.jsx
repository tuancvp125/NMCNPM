import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { getAllUserApi } from "../../../../axios/user.jsx";
import './userManagement.css';

export default function UserManagement() {
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const navigate = useNavigate();

    const [users, setUsers] = useState([]); // Khởi tạo là mảng rỗng
    const [searchInput, setSearchInput] = useState("");

    // Gọi API khi component được mount
    useEffect(() => {
        async function fetchUsers() {
            const storedToken = localStorage.getItem('authToken'); // Khai báo storedToken bên trong hàm fetchUsers
            if (!storedToken) {
                console.error("Token không tồn tại trong localStorage");
                return;
            }
    
            try {
                console.log("Token được sử dụng trang userManagement:", storedToken);
                const data = await getAllUserApi(storedToken);
                console.log("Danh sách người dùng:", data);
                setUsers(Array.isArray(data) ? data : []); // Đảm bảo users luôn là mảng
            } catch (error) {
                console.error("Không thể lấy danh sách người dùng:", error);
                setUsers([]); // Gán mảng rỗng nếu có lỗi
            }
        }
    
        fetchUsers();
    }, []); // Chỉ gọi useEffect khi component được mount        

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1); 
    };

    // Lọc dữ liệu dựa trên từ khóa tìm kiếm
    const filteredData = users.filter(
        (item) =>
            (item.name?.toLowerCase().includes(searchInput.toLowerCase()) || false) ||
            (item.email?.toLowerCase().includes(searchInput.toLowerCase()) || false) ||
            (item.phone?.includes(searchInput) || false)
    );
    

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);
    
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleEdit = (user) => {
        navigate("/user-management/user-edit", { state: { user } });
    };

    return (
        <div className="user-container">
            <div className="user-header">
                <h1>Quản lý tài khoản</h1>
                <div className="user-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        name="search"
                        placeholder="Nhập Tên/ Email/ Số điện thoại"
                        value={searchInput}
                        onChange={handleChange}
                    />
                </div>
                {/* <Link to="/user-management/user-create" className="btn-add">Thêm tài khoản</Link> */}
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        {/* <th>Hành động</th> */}
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.email}</td>
                            <td>{item.firstname} {item.lastname}</td>
                            <td>{item.phoneNumber}</td>
                            <td>{item.role}</td>
                            {/* <td>
                                <div className="user-btn">
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button>
                                    <button className="btn-delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Trước
                </button>
                <span>Trang {currentPage} trên {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Sau
                </button>
            </div>
        </div>
    );
}