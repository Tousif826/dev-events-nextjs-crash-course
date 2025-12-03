import Image from 'next/image'
import React from 'react'

const ExploreBtn = () => {
  return (
    <button type="button" id='explore-btn' className='mt-7 mx-auto'>
        <a href="#events">Explore Btn</a>
        <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24}></Image>
    </button>
    
  )
}

export default ExploreBtn
