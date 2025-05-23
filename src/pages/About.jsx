import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
//import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      
      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'VỀ'} text2={'CHÚNG TÔI'} />
      </div>
      
      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
              <p className='font-sans'>Sporter ra đời từ niềm đam mê đổi mới và mong muốn cách mạng hóa cách mọi người mua sắm trực tuyến. Hành trình của chúng tôi bắt đầu với ý tưởng đơn giản: tạo ra một nền tảng nơi khách hàng có thể dễ dàng khám phá, trải nghiệm và mua sắm các sản phẩm thể thao ngay tại nhà.</p>
              <p className='font-sans'>Từ khi thành lập, Sporter không ngừng nỗ lực để chọn lọc những sản phẩm chất lượng cao, đáp ứng mọi nhu cầu và sở thích. Từ trang phục, giày dép đến phụ kiện thể thao, chúng tôi mang đến bộ sưu tập đa dạng từ những thương hiệu và nhà cung cấp đáng tin cậy.</p>
              <b className='font-sans text-gray-800'>Sứ Mệnh</b>
              <p className='font-sans'>Sứ mệnh của Sporter là mang đến cho khách hàng sự lựa chọn, tiện lợi và sự tin tưởng. Chúng tôi cam kết mang lại trải nghiệm mua sắm hoàn hảo, vượt xa mong đợi của bạn, từ việc tìm kiếm và đặt hàng cho đến giao hàng và hỗ trợ sau đó.</p>
          </div>
      </div>

      <div className='text-xl py-4'>
          <Title text1={'ĐẾN VỚI'} text2={'CHÚNG TÔI'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b className='font-sans'>Đảm bảo chất lượng:</b>
            <p className='font-sans text-gray-600'>Chúng tôi lựa chọn và kiểm tra kỹ lưỡng từng sản phẩm để đảm bảo đáp ứng các tiêu chuẩn chất lượng nghiêm ngặt.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b className='font-sans'>Tiện lợi:</b>
            <p className='font-sans text-gray-600'>Với giao diện thân thiện với người dùng và quy trình đặt hàng đơn giản, việc mua sắm chưa bao giờ dễ dàng đến thế.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b className='font-sans'>Dịch vụ khách hàng tận tâm:</b>
            <p className='font-sans text-gray-600'>Đội ngũ chuyên gia tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn, đảm bảo sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi.</p>
          </div>
      </div>

      {/* <NewsletterBox/> */}

    </div>
  )
}

export default About
