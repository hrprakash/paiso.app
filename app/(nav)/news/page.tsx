"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import ApiClient from '@/lib/utils/client';
import { showNewsApi } from '@/lib/api/news';
import { Darumadrop_One } from 'next/font/google';
import next from 'next';
import { NewsListResponse } from '@/lib/api/types';
import { LoaderIcon, Newspaper, FileText, Download } from 'lucide-react';
import Link from 'next/link';


const page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentDateTime, setcurrentDateTime] = useState("")
  const [newsData, setnewsData] = useState<NewsListResponse>({
    count: 0,
    next: null,
    previous: null,
    results: []
  })

  async function loadnews(page: number) {
    try {
      setLoading(true)
      setError(null)

      const response = await showNewsApi.newsList({
        page: page,
        page_size: 10
      })
      console.log("news", response);
      if (response.success && response.data) {
        setnewsData(response.data)
      } else {
        setError(response.message || "error loading page")
      }
    } catch (error) {
      console.log(error);
      setError("failed to load news")
    } finally {
      setLoading(false)
    }
  }

  const handleNextPage = () => {
    if (newsData.next) {
        setCurrentPage(prev => prev + 1);
        loadnews(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (newsData.previous) {
        setCurrentPage(prev => prev - 1);
        loadnews(currentPage - 1);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const isPDF = (url: string | null | undefined) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf');
  };

  const isImage = (url: string | null | undefined) => {
    if (!url) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  useEffect(() => {
    loadnews(currentPage)

    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      const formatted = now.toLocaleString('en-US', options);
      setcurrentDateTime(formatted);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, [currentPage]);

  return (
    <div className='min-h-screen w-[80vw] lg:w-[60vw] mx-auto '>
      <div className='flex justify-between border-b-2 border-gray-200 dark:border-gray-700'>
        <div className='flex m-6 items-center justify-center'>
          <h1 className='text-3xl font-semibold text-black  dark:text-white'>Paiso</h1>
          <h1 className='text-3xl font-semibold text-emerald-500'>News</h1>
          <p className="pt-2 ml-4 text-sm sm:text-base ">{currentDateTime}</p>
        </div>
      </div>

      <div className='m-6'>
        <p className='text-sm text-gray-700 dark:text-gray-300 mb-3'>Categories:</p>

        <div className='flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800'>
          {['All news', 'NEPSE', 'Economy', 'Finance', 'Market Summary', 'Technical Analysis', 'IPOs', 'Mutual Funds', 'Budget', 'Global Markets'].map((category) => (
            <div key={category} className='text-xs hover:bg-emerald-500 hover:text-white rounded-full border border-gray-300 dark:border-gray-600 p-2 shadow-md cursor-pointer whitespace-nowrap transition-colors text-gray-700 dark:text-gray-300'>
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className='max-w-4xl mx-auto lg:max-w-8xl'>
        <div className='m-6'>
          <h1 className='text-3xl font-bold mb-6 text-gray-900 dark:text-white'>Latest News</h1>
          
          {loading && (
            <div className='text-center p-8 flex items-center justify-center'>
              <LoaderIcon className='animate-spin w-12 h-12' />
            </div>
          )}

          {error && !loading && (
            <div className='text-center p-8 text-red'>
              <p className='text-xl font-bold text-red-700 dark:text-red-300'>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className='space-y-6'>
              {newsData.results.map((newsItem) => {
                const fileUrl = newsItem.file || newsItem.remote_file_path;
                
                return (
                  <Link 
                    href={`/news/${newsItem.id}`}
                    key={newsItem.id}
                    className='block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-shadow'
                  >
                    <div className='flex flex-col md:flex-row'>
                      {/* Image/Thumbnail Section */}
                      <div className='md:w-1/3 bg-gray-200 dark:bg-gray-800'>
                        <div className='relative w-full h-48 md:h-full min-h-[200px]'>
                          {isPDF(fileUrl) ? (
                            // PDF indicator
                            <div className='w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'>
                              <FileText className='w-12 h-12 text-red-600 dark:text-red-400 mb-2'/>
                              <p className='text-sm font-semibold text-gray-800 dark:text-gray-200'>PDF Document</p>
                            </div>
                          ) : isImage(fileUrl) ? (
                            // Image
                            <img
                              src={fileUrl || ''}
                              alt={newsItem.title || "News thumbnail"}
                              className='w-full h-full object-cover'
                              onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback placeholder - shown when no file or image fails */}
                          {!fileUrl || (!isPDF(fileUrl) && !isImage(fileUrl)) ? (
                            <div className='w-full h-full flex flex-col items-center justify-center bg-gray-300 dark:bg-gray-700'>
                              <Newspaper className='w-12 h-12 text-gray-500 dark:text-gray-400'/>
                              <p className='text-xs mt-2 text-gray-600 dark:text-gray-400'>No preview</p>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className='md:w-2/3 p-6'>
                        <span className='inline-block px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-3'>
                          {newsItem.symbol || 'NEWS'}
                        </span>
                        
                        <h2 className='text-xl md:text-2xl font-bold mb-3 text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'>
                          {newsItem.title}
                        </h2>
                        
                        {newsItem.body && (
                          <p className='text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-3'>
                            {newsItem.body}
                          </p>
                        )}
                        
                        <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500'>
                          <span>{formatDate(newsItem.published_date || newsItem.created_on)}</span>
                          {newsItem.security_name && (
                            <>
                              <span>•</span>
                              <span>{newsItem.security_name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Pagination */}
              <div className='flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700'>
                <button
                  onClick={handlePrevPage}
                  disabled={!newsData.previous || loading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors 
                    ${newsData.previous && !loading 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:cursor-pointer'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                >
                  Previous
                </button>
                
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Page {currentPage} of {Math.ceil(newsData.count / 10)}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={!newsData.next || loading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors  
                    ${newsData.next && !loading 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:cursor-pointer'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed '}`}
                >
                  Next
                </button>
              </div>
            </div> 
          )}
        </div>
      </div>
    </div>
  )
}

export default page