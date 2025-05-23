import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategoryApi, createCategoryApi, deleteCategoryApi, updateCategoryApi } from "../../../../axios/category";
import "./categoryManagement.css";

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [newCategory, setNewCategory] = useState({ name: "" });
    const [showAddForm, setShowAddForm] = useState(false);

    const recordsPerPage = 8; // Số danh mục hiển thị mỗi trang
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchCategories() {
            if (!token) {
                console.error("Token không tồn tại trong localStorage");
                return;
            }
            try {
                const data = await getAllCategoryApi(token);
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Không thể lấy danh sách danh mục:", error);
                setCategories([]);
            }
        }
        fetchCategories();
    }, []);

    // const handleDelete = async (id) => {
    //     if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
    //         try {
    //             await deleteCategoryApi(token, category.id);
    //             setCategories((prevCategories) =>
    //                 prevCategories.filter((category) => category.id !== id)
    //             );
    //             console.log(`Danh mục có ID ${id} đã được xóa thành công.`);
    //         } catch (error) {
    //             console.error("Lỗi khi xóa danh mục:", error);
    //         }
    //     }
    // };

    const handleDelete = async (categoryId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
            try {
                // Chỉ truyền id vào API để xóa danh mục
                await deleteCategoryApi(token, categoryId); 
                setCategories((prevCategories) =>
                    prevCategories.filter((category) => category.id !== categoryId) // Lọc danh mục đã bị xóa khỏi danh sách
                );
                console.log(`Danh mục có ID ${categoryId} đã được xóa thành công.`);
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
            }
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.name.trim()) {
            alert("Tên danh mục không được để trống.");
            return;
        }
    
        try {
            const createdCategory = await createCategoryApi(token, newCategory.name);
            setCategories((prevCategories) => [...prevCategories, createdCategory]);
            setNewCategory({ name: "" });
            setShowAddForm(false);
            console.log("Thêm danh mục thành công");
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error.response?.data || error.message);
            alert("Lỗi khi thêm danh mục. Vui lòng thử lại.");
        }
    };
    

    const handleEdit = (category) => {
        navigate("/admin/category-management/category-edit", { state: { category } });
    };

    const totalPages = Math.ceil(categories.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = categories.slice(indexOfFirstRecord, indexOfLastRecord);

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

    return (
        <div className="category-container">
            <div className="category-body">
                <div className="category-header">
                    <h1>Danh sách danh mục</h1>
                    <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
                        <FontAwesomeIcon icon={faCirclePlus} />
                        <span>Thêm danh mục</span>
                    </button>
                </div>

                {showAddForm && (
                    <div className="add-category-form">
                        <input
                            type="text"
                            placeholder="Nhập tên danh mục"
                            value={newCategory.name}
                            onChange={(e) =>
                                setNewCategory({ ...newCategory, name: e.target.value })
                            }
                        />
                        <button onClick={handleAddCategory} className="btn-save">
                            Lưu
                        </button>
                        <button
                            onClick={() => setShowAddForm(false)}
                            className="btn-cancel"
                        >
                            Hủy
                        </button>
                    </div>
                )}



                <table className="category-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Danh mục</th>
                            {/* <th>Số sản phẩm</th> */}
                            {/* <th>Số sản phẩm đã bán</th> */}
                            <th>Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    {/* <td>1</td> */}
                                    {/* <td>1</td> */}
                                    <td>
                                        <div className="category-actions">
                                            <button className="btn-delete" onClick={() => handleDelete(category.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    Không có danh mục nào để hiển thị.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Trước
                </button>
                <span>
                    Trang {currentPage} trên {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Sau
                </button>
            </div>
        </div>
    );
}
