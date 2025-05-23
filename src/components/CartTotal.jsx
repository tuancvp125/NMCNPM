import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({total}) => {

  const {currency,delivery_fee,getCartAmount} = useContext(ShopContext);

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'THÀNH'} text2={'TIỀN'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
            {/* <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{Intl.NumberFormat().format(getCartAmount())} {currency}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{Intl.NumberFormat().format(delivery_fee)} {currency}</p>
            </div>
            <hr /> */}
            <div className='flex justify-between'>
                <b className="font-sans">Tổng tiền</b>
                <b className="font-sans">{Intl.NumberFormat().format(total)}{currency}</b>
            </div>
      </div>
    </div>
  )
}

export default CartTotal
