import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faCirclePlus,
    faPenToSquare,
    faTrash,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { getAllCategoryApi } from "../../../../axios/category";
import { getAllProductApi, deleteProductApi } from "../../../../axios/product";
import "./productManagement.css";

export default function ProductManagement() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");
    const categoryListRef = useRef(null);

    const storedToken = localStorage.getItem("authToken");

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        async function fetchProducts() {
            if (!storedToken) {
                console.error("Token không tồn tại trong localStorage");
                return;
            }

            try {
                const data = await getAllProductApi(storedToken);
                console.log("Danh sách sản phẩm:", data);
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Không thể lấy danh sách sản phẩm:", error);
                setProducts([]);
            }
        }

        fetchProducts();
    }, []);

    const filteredData = products.filter(
        (item) =>
            item.name.toLowerCase().includes(searchInput.toLowerCase()) &&
            (selectedCategory ? item.category.name === selectedCategory : true)
    );

    console.log("Dữ liệu sản phẩm sau khi lọc:", filteredData);

    const totalPages = Math.max(Math.ceil(filteredData.length / recordsPerPage), 1);

    const indexOfLastRecord = Math.min(currentPage * recordsPerPage, filteredData.length);
    const indexOfFirstRecord = Math.max(indexOfLastRecord - recordsPerPage, 0);
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    console.log("Dữ liệu sản phẩm trên trang hiện tại:", currentRecords);

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

    const handleCategory = async () => {
        if (!storedToken) {
            console.error("Token không tồn tại trong localStorage");
            return;
        }
        try {
            const response = await getAllCategoryApi(storedToken);
            setCategories(Array.isArray(response) ? response : []);
            setShowCategoryList(!showCategoryList);
        } catch (error) {
            console.error("Không thể lấy danh sách danh mục:", error);
        }
    };

    const selectCategory = (categoryName) => {
        setSelectedCategory(categoryName);
        setShowCategoryList(false);
        setCurrentPage(1);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryListRef.current && !categoryListRef.current.contains(event.target)) {
                setShowCategoryList(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleEdit = (product) => {
        navigate("/admin/product-management/product-edit", { state: { product } });
    };

    const handleDelete = async (id) => {
        if (!storedToken) {
            console.error("Token không tồn tại trong localStorage");
            return;
        }

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (!confirmDelete) {
        console.log("Người dùng hủy xóa.");
        return; // Nếu người dùng không xác nhận, không thực hiện xóa
    }

        try {
            await deleteProductApi(storedToken, id);
            setProducts((prevProducts) => {
                const updatedProducts = prevProducts.filter((product) => product.id !== id);
                const newTotalPages = Math.max(Math.ceil(updatedProducts.length / recordsPerPage), 1);
                if (currentPage > newTotalPages) {
                    setCurrentPage(newTotalPages);
                }
                return updatedProducts;
            });
            alert(`Sản phẩm có ID ${id} đã được xóa thành công.`);
            console.log(`Sản phẩm có ID ${id} đã được xóa thành công.`);
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
        }
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <div className="product-header">
                    <div className="product-btn">
                        <h1>Danh sách sản phẩm</h1>
                        <Link to="/admin/product-management/product-create" className="btn-add">
                            <FontAwesomeIcon icon={faCirclePlus} />
                            <span>Thêm sản phẩm</span>
                        </Link>
                    </div>
                    <div className="product-content">
                        <div className="pro-con-left">
                            <span>Tên sản phẩm</span>
                            <div className="product-search">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                <input
                                    name="search"
                                    placeholder="Tìm kiếm sản phẩm theo tên..."
                                    value={searchInput}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <label htmlFor="category">
                            <span>Danh mục</span>
                            <div className="product-search">
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    value={selectedCategory || ""}
                                    onClick={handleCategory}
                                    readOnly
                                />
                                {showCategoryList && (
                                    <ul className="category-selection" ref={categoryListRef}>
                                        {categories.map((cat, index) => (
                                            <li key={index} onClick={() => selectCategory(cat.name)}>
                                                {cat.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <FontAwesomeIcon icon={faChevronDown} className="icon-down" />
                            </div>
                        </label>
                    </div>
                </div>

                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Đã bán</th>
                            <th>Mô tả</th>
                            <th>Ảnh minh họa</th>
                            <th>Danh mục</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.length > 0 ? (
                            currentRecords.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td className="table-cell">{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.b_quantity}</td>
                                    <td className="table-cell">{item.description}</td>
                                    <td>
                                        {item.image_1 ? (
                                            <img
                                                src={
                                                    item.image_1.startsWith("data:image/")
                                                        ? item.image_1
                                                        : `data:image/jpeg;base64,${item.image_1}`
                                                }
                                                alt={item.name}
                                                style={{ width: "50px", height: "55px", objectFit: "cover" }}
                                            />
                                        ) : (
                                            <span>Không có ảnh</span>
                                        )}
                                    </td>
                                    <td>{item.category.name}</td>
                                    <td>
                                        <div className="product-btn">
                                            <button className="btn-edit" onClick={() => handleEdit(item)}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </button>
                                            <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>
                                    Không có sản phẩm nào để hiển thị.
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
