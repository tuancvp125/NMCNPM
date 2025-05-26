import React, { useState, useEffect, useRef } from "react";  
import './productCreate.css';
import { getAllCategoryApi } from "../../../../axios/category";
import { createProductApi } from "../../../../axios/product";
import { useNavigate } from "react-router-dom";

// Hàm chuyển đổi ảnh sang Base64
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export default function ProductCreate() {
    const navigate = useNavigate();
    const [categorys, setCategorys] = useState([]);
    const [showCategoryList, setShowCategoryList] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        color: '',
        size: '',
        material: '',
        productCondition: '',
        image: null,
        category: ''
    });
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const storedToken = localStorage.getItem('authToken');

    const categoryListRef = useRef(null); // Dùng để kiểm tra nhấp bên ngoài danh sách

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsLoading(true); // Bắt đầu tải ảnh
            try {
                const base64Image = await convertToBase64(file);
                setFormData({
                    ...formData,
                    image: base64Image // Lưu chuỗi Base64
                });
                setPreview(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
            } catch (error) {
                console.error("Lỗi khi chuyển đổi ảnh sang Base64:", error);
            } finally {
                setIsLoading(false); // Kết thúc quá trình tải ảnh
            }
        }
    };

    const handleCategory = async () => {
        const response = await getAllCategoryApi(storedToken);
        setCategorys(Array.isArray(response) ? response : []); 
        setShowCategoryList(!showCategoryList); // Toggle hiển thị danh sách
    };

    const selectCategory = (category) => {
        setFormData({
            ...formData,
            category: category
        });
        setShowCategoryList(false); // Ẩn danh sách sau khi chọn
    };

    // Đóng danh sách khi nhấn bên ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryListRef.current && !categoryListRef.current.contains(event.target)) {
                setShowCategoryList(false); // Ẩn danh sách nếu nhấp bên ngoài
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedCategory = categorys.find((cat) => cat.name === formData.category);
        if (!selectedCategory) {
            alert("Vui lòng chọn danh mục hợp lệ!");
            return;
        }

        const productData = {
            name: formData.name,
            price: formData.price,
            quantity: formData.quantity,
            description: formData.description,
            color: formData.color,
            size: formData.size,
            material: formData.material,
            productCondition: formData.productCondition || "New",
            categoryId: selectedCategory.id,
            image: formData.image
        };

        // Create a clean object with only the necessary data
        const apiData = {
            name: productData.name,
            image_1: productData.image,
            price: productData.price,
            description: productData.description,
            quantity: productData.quantity,
            color: productData.color,
            size: productData.size,
            material: productData.material,
            productCondition: productData.productCondition
        };

        try {
            const response = await createProductApi(
                storedToken,
                productData.categoryId,
                apiData.name,
                apiData.image_1,
                apiData.price,
                apiData.description,
                apiData.quantity,
                apiData.color,
                apiData.size,
                apiData.material,
                apiData.productCondition
            );
            console.log("Tạo sản phẩm thành công:", response);
            alert("Tạo sản phẩm thành công!");
            setTimeout(() => {
                navigate("/admin/product-management");
            }, 3000);
        } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            alert("Có lỗi xảy ra khi tạo sản phẩm!");
        }
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <h1>Danh sách sản phẩm/Thêm sản phẩm</h1>
                <form className="product-create" onSubmit={handleSubmit}>
                    <label htmlFor="category">
                        <span>Loại</span>
                        <input 
                            type="text" 
                            id="category" 
                            name="category" 
                            value={formData.category}
                            onClick={handleCategory}
                            readOnly 
                        />
                        {showCategoryList && (
                            <ul className="category-list" ref={categoryListRef}>
                                {categorys.map((cat, index) => (
                                    <li 
                                        key={index} 
                                        onClick={() => selectCategory(cat.name)}
                                    >
                                        {cat.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </label>
                    <label htmlFor="name">
                        <span>Tên</span>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                    </label>
                    <label htmlFor="price">
                        <span>Giá</span>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0"/>
                    </label>
                    <label htmlFor="quantity">
                        <span>Số lượng</span>
                        <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="0"/>
                    </label>
                    <label htmlFor="description">
                        <span>Mô tả</span>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                    </label>
                    <label htmlFor="color">
                        <span>Màu sắc</span>
                        <input type="text" id="color" name="color" value={formData.color} onChange={handleChange} />
                    </label>
                    <label htmlFor="size">
                        <span>Kích cỡ</span>
                        <input type="text" id="size" name="size" value={formData.size} onChange={handleChange} />
                    </label>
                    <label htmlFor="material">
                        <span>Chất liệu</span>
                        <input type="text" id="material" name="material" value={formData.material} onChange={handleChange} />
                    </label>
                    <label htmlFor="productCondition">
                        <span>Tình trạng</span>
                        <input type="text" id="productCondition" name="productCondition" value={formData.productCondition} onChange={handleChange} />
                    </label>
                    <label htmlFor="image">
                        <span>Ảnh minh họa</span>
                        <input type="file" id="image" name="image" onChange={handleImageChange} />
                    </label>
                    {isLoading && <p>Đang tải ảnh...</p>} {/* Hiển thị trạng thái tải */}
                    {preview && <img src={preview} alt="Preview" className="image-preview" />}
                    <input type="submit" value="Tạo" />
                </form>
            </div>
        </div>
    );
}
