import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
          <img src={assets.logo} className='mb-5 w-32 ' alt="" />
          <p className='font-sans w-full md:w-2/3 text-gray-600 '>
          Sporter chuyên cung cấp đồ thể thao chất lượng cao, từ trang phục, giày dép đến phụ kiện. Chúng tôi cam kết mang đến sự thoải mái, hiệu quả và dịch vụ tận tâm cho mọi khách hàng.
          </p>
        </div>

        {/* <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About us</li>
                <li>Delivery</li>
                <li>Privacy policy</li>
            </ul>
        </div> */}

        <div>
            <p className='font-sans text-xl font-medium mb-5'>THÔNG TIN LIÊN LẠC</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+1-234-567-890</li>
                <li>contact@sporter.com</li>
            </ul>
        </div>

      </div>

      <div>
          <hr />
          <p className='py-5 text-sm text-center'>Bản quyền thuộc về 2024@sporter.com.</p>
      </div>

    </div>
  )
}

export default Footer
