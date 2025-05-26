import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
//import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'LIÊN HỆ'} text2={''} />
      </div>
      
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-sans font-semibold text-xl text-gray-600'>Địa chỉ</p>
          <p className='font-sans text-gray-500'>B0-111 Đại Học Bách Khoa Hà Nội <br /> Bách Khoa, Hai Bà Trưng, Hà Nội</p>
          <p className='text-gray-500'>Tel: (123) 456-7890 <br /> Email: contact@cyberxes.com</p>
          <p className='font-sans font-semibold text-xl text-gray-600'>Tuyển dụng tại CyberXes</p>
          <p className='font-sans text-gray-500'>Hiện tại chưa có vị trí mới...</p>
          {/* <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button> */}
        </div>
      </div>

      {/* <NewsletterBox/> */}
    </div>
  )
}

export default Contact
