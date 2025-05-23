import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { GetCartApi } from "../axios/order";

const Cart = () => {
  const { total, setTotal, currency, cartItems, updateQuantity, navigate, setCartItems, removeCartItem, removeAllCart } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  const cartId = localStorage.getItem("defaultCartId");

  // Fetch cart data from API
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (cartId) {
          const updatedCart = await GetCartApi(cartId);
          console.log(updatedCart);
          setTotal(updatedCart.total);
          setCartItems(updatedCart.cart.items); // Set context cart items
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, [cartId, setCartItems]);

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={'GIỎ HÀNG'} text2={'CỦA BẠN'} />
      </div>

      <div>
        {Array.isArray(cartItems) && cartItems.length > 0 ? (
          cartItems.map((item, index) => {
            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={item.product.image_1} alt={item.product.name} />
                  <div>
                    <p className="font-sans text-xs sm:text-lg font-medium">{item.product.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>{Intl.NumberFormat().format(item.product.price)}{currency}</p>
                    </div>
                  </div>
                </div>
                <input
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                  onChange={(e) => item.quantity = Number(e.target.value)} // Cập nhật giá trị tạm thời
                />
                <div 
                  onClick={() => updateQuantity(cartId, item.id, item.quantity)} // Gọi API với giá trị mới
                  className="font-sans w-4 mr-4 sm:w-5 cursor-pointer"
                >
                  Cập nhật
                </div>
                <img
                  onClick={() => removeCartItem(cartId, item.id)}
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                  src={assets.bin_icon}
                  alt="Delete"
                />
              </div>
            );
          })
        ) : (
          <p className="font-sans">Chưa có sản phẩm trong giỏ hàng.</p>
        )}
      </div>

      <button onClick={() => removeAllCart(cartId)} className='font-sans'>Xóa giỏ hàng</button>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal total={total}/>
          <div className="w-full text-end">
            <button onClick={() => navigate('/place-order')} className="font-sans bg-black text-white text-sm my-8 px-8 py-3">
              TIẾN HÀNH THANH TOÁN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;