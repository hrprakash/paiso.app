"use client"
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className='min-h-screen pt-12  '> 
      
      <div className='flex justify-center'>
        
        <div className='bg-green-100/70 inline-flex items-center rounded-full border border-green-200 shadow-sm'>
          
          <p className='px-4 py-2 text-sm font-semibold text-green-700'>
            Blogs
          </p>
          
        </div>
      </div>
      
      <div className=' my-4 items-center flex flex-col justify-center max-w-md mx-auto mt-8 p-4'>
        <h1 className='font-ovo text-2xl md:text-4xl font-bold '>Insights for the </h1>
            <h1 className='font-ovo text-2xl md:text-4xl  font-bold'>Nepalsese Stock Market</h1>
      </div>
            <p className='flex items-center justify-center font-ovo text-md '>Stay informed with the latest news and analysis from the Nepalsese stock market.</p>

            <div className='mt-6 flex items-center justify-center space-x-4' >
            <p className='p-2 text-xs shadow-amber-200 border rounded-full'>
                Nepse
            </p>
            <p className='p-2 text-xs shadow-amber-200 border rounded-full'>Finance</p>
            <p className='p-2 text-xs shadow-amber-200 border rounded-full'>Economy</p>
            </div>

          <div className='max-w-4xl mx-auto '>
    <div className='my-6 mx-4  border-t light:border-gray-200 dark:border-gray-700'></div>
    <p className='my-2 mx-4 text-xs font-medium text-gray-600 dark:text-gray-400'>
            Blogs
        </p>

      <div className='max-w-4xl mx-auto mb-6'>
        

        <div className='mx-4'>
          
          <h1 className='text-xl md:text-3xl font-bold my-4 dark:text-white'>Our Trending Article</h1>
          
          <div className='p-6 bg-white  dark:bg-gray-700 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-6 border border-gray-200 dark:border-gray-700'>
            
            <div className='md:w-3/4'>
              <h2 className='text-xl font-bold mb-3 light:text-gray-900 dark:text-white'>
                How Promoters Benefit from IPOs The Hidden Side of Public Offerings Explained
              </h2>
              <p className='text-sm text-gray-700 dark:text-gray-400 mb-8'>
                Learn how promoters benefit from IPOs, how they raise capital, reduce risk, expand business, and use public money for long-term growth.
              </p>
              
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-gray-500'>
                  Nov 29, 2025 | Paiso
                </p>
              </div>
            </div>

            <div className='w-full md:w-1/4 flex-shrink-0'>
                <div className='bg-green-100 rounded-lg p-3 flex items-center justify-center w-full aspect-square'>
                  <Image src="/f3fe472a14ca4f5283340f8137a4d8d2.webp" alt='ipo icon' width={150} height={150} priority/>
                </div>
            </div>
          </div>
        </div>
      </div>
            <div className='max-w-4xl mx-auto mb-6'>
        

        <div className='mx-4'>
          
          
          <div className='p-6 bg-white  dark:bg-gray-700 rounded-2xl flex flex-col md:flex-row items-start justify-between gap-6 border border-gray-200 dark:border-gray-700'>
            
            <div className='md:w-3/4'>
              <h2 className='text-xl font-bold mb-3 light:text-gray-900 dark:text-white'>
                How Promoters Benefit from IPOs The Hidden Side of Public Offerings Explained
              </h2>
              <p className='text-sm text-gray-700 dark:text-gray-400 mb-8'>
                Learn how promoters benefit from IPOs, how they raise capital, reduce risk, expand business, and use public money for long-term growth.
              </p>
              
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-gray-500'>
                  Nov 29, 2025 | Paiso
                </p>
              </div>
            </div>

            <div className='w-full md:w-1/4 flex-shrink-0'>
                <div className='bg-green-100 rounded-lg p-3 flex items-center justify-center w-full aspect-square'>
                  <Image src="/f3fe472a14ca4f5283340f8137a4d8d2.webp" alt='ipo icon' width={150} height={150} priority/>
                </div>
            </div>
          </div>
        </div>
      </div>
</div>
    </div>
  )
}

export default page