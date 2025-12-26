import React from 'react'

import LiveMarket from '@/components/LiveMarket'

const page = () => {
  return (
    <div className='min-h-screen'>



            <div className='flex items-center justify-center my-8'>
                <h1 className='text-4xl font-ovo font-semibold '>Market Summary</h1>
            </div>

            <div className='mx-4'>

            <LiveMarket/>
            </div>

            <div className='flex  items-center justify-center my-6 '>
      <p className='font-semibold text-lg'>
        *NOTE: 
        </p>
       <span className='text-md'>
         Close Price and Market Capitalization will be calculated after market close.
        </span>
        </div>
      
    </div>
  )
}

export default page
