import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { faFile, faCreditCard, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import './loanDetail.css'
// import { Link } from "react-router-dom";

export default function LoanDetail() {
    const products = [
        {
            id: 1,
            name: "Giày MLB Chunky Wide New York [Đen - 40]",
            code: "WYOIRKDEN40CASU",
            price: 100000,
            quantity: 2,
            image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/467/909/products/giay-mlb-chunky-wide-new-york-ya-5.jpg?v=1723531214610"
        },
        {
            id: 2,
            name: "Giày Converse Chuck Taylor All Star",
            code: "CNVALLST001",
            price: 120000,
            quantity: 1,
            image: "https://product.hstatic.net/200000265619/product/m9166c-web-thumb_11c8e1f97a9e47a6885393d41fe15dce_1024x1024.jpg"
        },
    ];
    

    return (
        <div class="order-status">
            <div class="order-header">
                <p>Danh sách hóa đơn / Hóa đơn HD15030032</p>
            </div>
            <div class="steps">
                <div className="step-completed">
                    <div className="icon" style={{backgroundColor: "#1E73BE"}}>
                        <FontAwesomeIcon icon={faFile} />
                    </div>
                    <div className="arrow">
                        <span className="line" style={{backgroundColor: "#1E73BE"}}></span>
                        <span className="dot"></span>
                        <span className="arrow-content" style={{backgroundColor: "#1E73BE"}}>
                            <span className="play-left"></span>
                            <span className="play-right" style={{borderLeftColor: "#1E73BE"}}></span>
                        </span>
                    </div>
                    <span className="label">Tạo đơn hàng</span>
                </div>
                <div class="step-completed">
                <div className="icon" style={{backgroundColor: "rgb(30, 205, 190)"}}>
                        <FontAwesomeIcon icon={faTruck} />
                    </div>
                    <div className="arrow">
                        <span className="line" style={{backgroundColor: "rgb(30, 205, 190)"}}></span>
                        <span className="dot"></span>
                        <span className="arrow-content" style={{backgroundColor: "rgb(30, 205, 190)"}}>
                            <span className="play-left"></span>
                            <span className="play-right" style={{borderLeftColor: "rgb(30, 205, 190)"}}></span>
                        </span>
                    </div>
                    <div class="loan-title">Chờ giao</div>
                </div>
                <div class="step completed">
                <div className="icon" style={{backgroundColor: "rgb(30, 205, 135)"}}>
                        <FontAwesomeIcon icon={faTruckFast} />
                    </div>
                    <div className="arrow">
                        <span className="line" style={{backgroundColor: "rgb(30, 205, 135)"}}></span>
                        <span className="dot"></span>
                        <span className="arrow-content" style={{backgroundColor: "rgb(30, 205, 135)"}}>
                            <span className="play-left"></span>
                            <span className="play-right" style={{borderLeftColor: "rgb(30, 205, 135)"}}></span>
                        </span>
                    </div>
                    <div class="loan-title">Đang giao</div>
                </div>
                <div class="step completed">
                <div className="icon" style={{backgroundColor: "rgb(255, 223, 94)"}}>
                        <FontAwesomeIcon icon={faCreditCard} />
                    </div>
                    <div className="arrow">
                        <span className="line" style={{backgroundColor: "rgb(255, 223, 94)"}}></span>
                        <span className="dot"></span>
                        <span className="arrow-content" style={{backgroundColor: "rgb(255, 223, 94)"}}>
                            <span className="play-left"></span>
                            <span className="play-right" style={{borderLeftColor: "rgb(255, 223, 94)"}}></span>
                        </span>
                    </div>
                    <div class="loan-title">Đã thanh toán</div>
                </div>
                <div class="step completed">
                <div className="icon" style={{backgroundColor: "rgb(228, 76, 30)"}}>
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </div>
                    <div className="arrow">
                        <span className="line" style={{backgroundColor: "rgb(228, 76, 30)"}}></span>
                        <span className="dot"></span>
                        <span className="arrow-content" style={{backgroundColor: "rgb(228, 76, 30)"}}>
                            <span className="play-left"></span>
                            <span className="play-right" style={{borderLeftColor: "rgb(228, 76, 30)"}}></span>
                        </span>
                    </div>
                    <div class="loan-title">Hoàn thành</div>
                </div>
            </div>
            <div class="actions">
                <button class="loan-btn" style={{backgroundColor: "#ff001be8"}}>Hủy</button>
                <button class="loan-btn" style={{backgroundColor: "#2424e1"}}>Giao hàng</button>
            </div>
            <div>
                <div className="loan-item">
                    <div className="loan-text">Thông tin đơn hàng</div>
                    <div className="loan-content">
                        <div className="loan-col">
                            <div className="col-1">
                                <div>Trạng thái:</div>
                                <div>Mã đơn hàng:</div>
                                <div>Loại đơn hàng:</div>
                            </div>
                            <div className="col-2">
                                <div>Trạng thái</div>
                                <div>Mã đơn hàng</div>
                                <div>Loại đơn hàng</div>
                            </div>
                        </div>
                        <div className="loan-col">
                            <div className="col-1">
                                <div>Phí thanh toán:</div>
                                <div>Tổng tiền:</div>
                                <div>Phải thanh toán:</div>
                            </div>
                            <div className="col-2">
                                <div>Phí thanh toán</div>
                                <div>Tổng tiền</div>
                                <div>Phải thanh toán</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="loan-item">
                    <div className="loan-text">Thông tin khách hàng</div>
                    <div className="loan-content">
                        <div className="loan-col">
                            <div className="col-1">
                                <div>Tên:</div>
                                <div>Số điện thoại:</div>
                            </div>
                            <div className="col-2">
                                <div>Tên</div>
                                <div>Số điện thoại</div>
                            </div>
                        </div>
                        <div className="loan-col">
                            <div className="col-1">
                                <div>Email:</div>
                                <div>Địa chỉ:</div>
                            </div>
                            <div className="col-2">
                                <div>Email</div>
                                <div>Địa chỉ</div>
                            </div>
                        </div>
                    </div>   
                </div>
                <div className="loan-item">
                    <div className="loan-text">DANH SÁCH SẢN PHẨM</div>
                    {products.map((product) => (
                        <div key={product.id} className="product-item">
                            <div className="product-image">
                                <img src={product.image} alt={product.name} />
                            </div>
                            <div className="product-details">
                                <p className="product-name">{product.name}</p>
                                <p className="product-code">Mã sản phẩm: {product.code}</p>
                                <p className="product-price">Đơn giá: <span style={{color: "#C00000"}}>{product.price.toLocaleString()} đ</span></p>
                            </div>
                            <div className="product-quantity">
                                <input type="number" defaultValue={product.quantity} min="1" />
                            </div>
                            <div className="product-total">
                                <p>{(product.price * product.quantity).toLocaleString()} đ</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="loan-btn" style={{backgroundColor: "#eda820f0"}}>Xác nhận thanh toán</button>
            </div>
        </div>
    );
}