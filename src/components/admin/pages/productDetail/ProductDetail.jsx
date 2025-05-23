import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GroceryIcon from "../../components/Assets/product-detail/grocery.svg";
import axios from "axios";
import "./productDetail.css";
import {API_URL} from "../../../../constant.js";


function ProductDetail() {
  const { id } = useParams(); // Lấy ID từ URL
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const authToken = localStorage.getItem('authToken'); 
        const url = `${API_URL}/user/products/all`; 

        // Gọi API để lấy danh sách sản phẩm
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Tìm sản phẩm theo ID từ danh sách trả về
        const product = response.data.find((item) => item.id === parseInt(id));
        if (product) {
          setProductDetail(product);
        } else {
          setError(`Product with ID ${id} not found.`);
        }
      } catch (err) {
        setError(err.response?.data || "Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetail();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="product-detail">
      <div className="thumbnails">
        <div className="main-thumbnail">
          <img src={productDetail.image_1} alt="Main Thumbnail" className="img-thumbnail" />
        </div>
        <div className="product-thumbnails">
          <img src={productDetail.image_1} alt="Thumbnail 1" className="product-thumbnail" />
          <img src={productDetail.image_1} alt="Thumbnail 2" className="product-thumbnail" />
        </div>
      </div>
      <div className="detail">
        <div className="product-title">{productDetail.name}</div>
        <div className="price-category">
          <div className="product-price">{productDetail.price} VNĐ</div>
          <div className="category">
            <span className="product-category">Danh mục</span>
            <img src={GroceryIcon} alt="Category Icon" className="icon-category" />
            <div className="product-category">{productDetail.category.name}</div>
          </div>
        </div>
        <div className="product-quantity">Đã bán: {productDetail.b_quantity}</div>
        <div className="product-quantity">Trong kho: {productDetail.quantity - productDetail.b_quantity}</div>
        <div className="product-description">Mô tả: {productDetail.description}</div>
      </div>
    </div>
  );
}

export default ProductDetail;
