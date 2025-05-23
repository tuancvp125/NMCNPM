import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

   const { products } = useContext(ShopContext);
   const [latestProducts,setLastestProducts] = useState([]);

   useEffect(()=>{
        setLastestProducts(products.slice(0,10));
   },[])

  return (
    <div className='my-10'>
        <div className='font-sans text-center py-8 text-3xl'>
            <Title text1={'SẢN PHẨM'} text2={'MỚI'}/>
            <p className='font-sans w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Khám Phá Bộ Sưu Tập Thể Thao Mới Nhất - Phong Cách Đỉnh Cao, Hiệu Suất Tối Ưu!
            </p>
        </div>

        {/* Rendering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                latestProducts.map((item,index)=>(
                    <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                ))
            }
        </div>

    </div>
  )
}

export default LatestCollection
