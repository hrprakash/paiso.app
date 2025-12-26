import React from 'react'
import { TrendingUp, Instagram, Facebook , Copyright} from 'lucide-react'

const Footer = () => {
    return (
        <footer className=''>
         

            <div className='bg-neutral-800 py-12 px-6'>
                <div className='max-w-[1400px] mx-auto'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-12 text-white'>
                        <div className='flex flex-col gap-6'>
                            <div className='flex items-center gap-2'>
                                <TrendingUp className='w-8 h-8 text-emerald-500' />
                                <span className='cursor-pointer text-2xl font-semibold'>Paiso</span>
                            </div>
                            <div className='flex gap-4'>
                                <Instagram className='w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors' />
                                <Facebook className='w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors' />
                                <img className='invert' src="/itk.svg" alt="" />
                            </div>
                        </div>

                        <div>
                            <h3 className='font-semibold text-lg mb-4'>Menus</h3>
                            <ul className='space-y-2 text-gray-400'>
                                <li className='hover:text-white cursor-pointer transition-colors'>News</li>
                                <li className='hover:text-white cursor-pointer transition-colors'>blogs</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className='font-semibold text-lg mb-4'>Discover</h3>
                            <ul className='space-y-2 text-gray-400'>
                                <li className='hover:text-white cursor-pointer transition-colors'>Terms & Conditions</li>
                                <li className='hover:text-white cursor-pointer transition-colors'>Privacy Policy</li>
                                <li className='hover:text-white cursor-pointer transition-colors'>Our policy</li>
                                <li className='hover:text-white cursor-pointer transition-colors'>Risk Disclosure</li>
                                <li className='hover:text-white cursor-pointer transition-colors'>Billing Subscription</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className='font-semibold text-lg mb-4'>Company</h3>
                            <ul className='space-y-2 text-gray-400'>
                                <li className='hover:text-white cursor-pointer transition-colors'>Contact</li>
                                <li className='hover:text-white cursor-pointer transition-colors'>Support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
    <div className="border-b-4 border-gray-500"></div>
            <div className='border-b-4 border-gray-800'>
        <p className='bg-neutral-800  p-4 pl-12 text-sm flex items-center justify-center gap-2 text-white'> <Copyright className=''/> Copyright Paiso 2025</p>
            </div>
        </footer>
    )
}

export default Footer