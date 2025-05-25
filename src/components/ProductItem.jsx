import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price, color, size, material, productCondition}) => {

    const {currency} = useContext(ShopContext);

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden'
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt="" />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{Intl.NumberFormat().format(price)}{currency}</p>
      <p className='text-sm'>Color: {color}</p>
      <p className='text-sm'>Size: {size}</p>
      <p className='text-sm'>Material: {material}</p>
      <p className='text-sm'>Condition: {productCondition}</p>
    </Link>
  )
}

export default ProductItem
