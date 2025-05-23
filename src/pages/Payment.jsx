import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Payment = () => {
  const { QRCode } = useContext(ShopContext);

  if (!QRCode || !QRCode.data) {
    return <p>Đang tải QR Code...</p>; 
  }

  return (
    <div
      style={{
        display: 'flex',            
        justifyContent: 'center',   
        alignItems: 'center',       
        height: '100vh',            
        margin: 0,                  
      }}
    >
      {/* Hiển thị hình ảnh QR Code nếu có */}
      {QRCode.data.qrDataURL && (
        <img
          src={QRCode.data.qrDataURL}
          alt="QR Code"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}
    </div>
  );
};

export default Payment;