import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateProductApi } from "../../../../axios/product";
import "./productEdit.css";

export default function ProductEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const existingProduct = location.state?.product || {};

    const [formData, setFormData] = useState({
        id: existingProduct.id || "",
        name: existingProduct.name || "",
        price: existingProduct.price || "",
        quantity: existingProduct.quantity || "",
        description: existingProduct.description || "",
        color: existingProduct.color || "",
        size: existingProduct.size || "",
        material: existingProduct.material || "",
        productCondition: existingProduct.productCondition || "",
        category: existingProduct.category?.name || "",
    });

    const [preview] = useState(
        existingProduct.image_1?.startsWith("data:image/")
            ? existingProduct.image_1
            : existingProduct.image_1
                ? `data:image/jpeg;base64,${existingProduct.image_1}`
                : null
    );

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedToken = localStorage.getItem("authToken");

        try {
            await updateProductApi(
                storedToken,
                1, // Thay `1` bằng `categoryId` phù hợp
                formData.id,
                formData.name,
                parseFloat(formData.price),
                formData.description,
                parseInt(formData.quantity, 10),
                formData.color,
                formData.size,
                formData.material,
                formData.productCondition
            );

            setSubmitted(true);
            setTimeout(() => navigate("/admin/product-management"), 2000);
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
        }
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <h1>Danh sách sản phẩm/Chỉnh sửa thông tin sản phẩm</h1>
                <form className="product-edit" onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        <span>Tên</span>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label htmlFor="price">
                        <span>Giá</span>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </label>
                    <label htmlFor="quantity">
                        <span>Số lượng</span>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </label>
                    <label htmlFor="description">
                        <span>Mô tả</span>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="category">
                        <span>Danh mục</span>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="color">
                        <span>Màu sắc</span>
                        <input
                            type="text"
                            id="color"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="size">
                        <span>Kích cỡ</span>
                        <input
                            type="text"
                            id="size"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="material">
                        <span>Chất liệu</span>
                        <input
                            type="text"
                            id="material"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="productCondition">
                        <span>Tình trạng</span>
                        <input
                            type="text"
                            id="productCondition"
                            name="productCondition"
                            value={formData.productCondition}
                            onChange={handleChange}
                        />
                    </label>
                    {preview && <img src={preview} alt="Preview" className="image-preview" />}
                    <input type="submit" value="Chỉnh sửa" />
                </form>
                {submitted && (
                    <p className="submission-message">
                        Thông tin sản phẩm đã được gửi thành công! Đang quay lại danh sách...
                    </p>
                )}
            </div>
        </div>
    );
}
