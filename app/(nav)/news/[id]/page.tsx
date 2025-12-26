"use client"
import React from 'react'
import Link from 'next/link'
import { ArrowLeft, UserCircle2, CalendarDays, Clock3, Share, Link as LinkIcon, Loader, FileText, Download, AlertCircle, ExternalLink} from 'lucide-react'
import { showNewsApi } from '@/lib/api/news'
import { CompanyNewsNAlert } from '@/lib/api/types'
import { useState, use } from 'react'
import { useEffect } from 'react'
import { toast } from "sonner";

const page = ({ params }: { params: Promise<{ id: string }> }) => {
   const resolvedParams = use(params)
  const newsId = resolvedParams.id
  const numericId = Number(newsId)

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [newsData, setNewsData] = useState<CompanyNewsNAlert | null>(null)

  useEffect(() => {
    async function readNews() {
      if (isNaN(numericId)) {
        setError("Invalid news ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await showNewsApi.getNewsById(numericId)
        
        console.log("Full API Response:", response)
        console.log("News Data:", response.data)
        
        if (response.success && response.data) {
          setNewsData(response.data)
        } else {
          setError(response.message || "error loading news")
        }
      } catch (error) {
        console.log(error)
        setError("failed to load news")
      } finally {
        setLoading(false)
      }
    }

    readNews()
  }, [numericId])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    } catch {
      return dateString
    }
  }

  const handleDownload = () =>{
    
  }



  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  const parseTitle = (title: string) => {
    const lines = title.split('\n').filter(line => line.trim())
    return lines
  }
 const handleViewPDF = () => {
    const fileUrl = newsData?.file || newsData?.remote_file_path
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer')
      toast.success("Opening document in new tab")
    } else {
      toast.error("No document available to view")
    }
  }
  // Check if file is a PDF
  const isPDF = (url: string | null | undefined) => {
    if (!url) return false
    return url.toLowerCase().endsWith('.pdf')
  }

  // Check if file is an image
  const isImage = (url: string | null | undefined) => {
    if (!url) return false
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext))
  }

  const fileUrl = newsData?.file || newsData?.remote_file_path
  const hasFile = !!fileUrl
  const hasBody = newsData?.body && newsData.body.trim().length > 0

  return (
    <div className='min-h-screen mt-6 mx-auto md:w-[80vw] lg:w-[60vw] px-4 pb-20'>
      <Link className='flex text-emerald-600 hover:text-emerald-700 cursor-pointer gap-2 items-center' href={"/news"}>
        <ArrowLeft className='w-4' /> Back to news
      </Link>

      {loading && (
        <div className='text-center flex items-center justify-center mt-20'>
          <Loader className='animate-spin w-8 h-8 text-emerald-500' />
        </div>
      )}

      {error && !loading && (
        <div className='text-center mt-20'>
          <p className='text-sm font-bold text-red-700 dark:text-red-300'>{error}</p>
          <Link className='flex items-center justify-center mt-4 text-emerald-600 cursor-pointer gap-2' href={"/news"}>
            <ArrowLeft className='w-4' /> <p className='text-xs'>Back to news</p>
          </Link>
        </div>
      )}

      {!loading && !error && newsData && (
        <>
          {/* Symbol Badge */}
          <div className='rounded-2xl mt-6 px-4 inline-flex p-2 bg-emerald-500'>
            <p className='text-xs text-white font-medium'>{newsData.symbol || 'News'}</p>
          </div>

          {/* Title */}
          <div className='w-full space-y-4 mt-4'>
            <h1 className='text-3xl font-semibold'>
              {parseTitle(newsData.title || '')[0] || newsData.title}
            </h1>
          </div>

          {/* Metadata */}
          <div className='flex flex-wrap gap-4 items-center mt-6'>
            <div className='flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
              <UserCircle2 className='w-4' /> {newsData.security_name || 'Paiso'}
            </div>
            <div className='gap-2 flex items-center text-xs text-gray-600 dark:text-gray-400'>
              <CalendarDays className='w-4' /> {formatDate(newsData.published_date || newsData.created_on || "")}
            </div>
            <div className='gap-2 flex items-center text-xs text-gray-600 dark:text-gray-400'>
              <Clock3 className='w-4' /> 2min read
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-wrap gap-3 w-full items-center mt-6 text-xs'>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: newsData.title || '',
                    url: window.location.href
                  }).catch(() => handleCopyLink())
                } else {
                  handleCopyLink()
                }
              }}
              className='hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer border border-gray-300 dark:border-gray-600 rounded-full px-3 py-2 flex items-center space-x-2'>
              <p>Share</p>
              <Share className='w-4' />
            </button>

            <button 
              onClick={handleCopyLink}
              className='border border-gray-300 dark:border-gray-600 hover:bg-emerald-500 hover:text-white transition-colors rounded-full px-3 py-2 cursor-pointer flex items-center space-x-2'>
              <p>Copy Link</p>
              <LinkIcon className='w-4' />
            </button>

            {hasFile && (
              <button 
                onClick={handleViewPDF}
                className='border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors rounded-full px-3 py-2 cursor-pointer flex items-center space-x-2'>
                <p>{isPDF(fileUrl) ? 'View PDF' : 'View Document'}</p>
                <ExternalLink className='w-4' />
              </button>
            )}
          </div>

          <div className='my-6 border-t border-gray-200 dark:border-gray-700'></div>

          {/* Display image ONLY if it's actually an image, not a PDF */}
          {hasFile && isImage(fileUrl) && (
            <div className='w-full mb-6 rounded-lg overflow-hidden'>
              <img
                src={fileUrl || ''}
                alt={newsData.title || "News Image"}
                className='w-full h-auto object-contain rounded-lg bg-gray-100 dark:bg-gray-800'
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}

          {/* Main Content */}
        {/* Main Content */}
<div className='space-y-6 mb-8'>
  {/* Body Content */}
  {hasBody && newsData.body && newsData.body.trim().length > 0 ? (
    <div className='prose dark:prose-invert max-w-none'>
      <div className='text-lg text-gray-700 dark:text-gray-300 space-y-4'>
        {newsData.body.split('\n').map((paragraph, index) => (
          paragraph.trim() ? (
            <p key={index} className='leading-relaxed'>
              {paragraph}
            </p>
          ) : null
        ))}
      </div>
    </div>
  ) : (
              /* Fallback for empty body */
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-3'>
                <div className='flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-4'>
                  <FileText className='w-5 h-5' />
                  <h3 className='font-semibold text-lg'>Notice Details</h3>
                </div>
                
                {parseTitle(newsData.title || '').map((line, index) => (
                  <div key={index} className='py-2 border-b border-gray-200 dark:border-gray-700 last:border-0'>
                    <p className='text-sm text-gray-900 dark:text-gray-100'>{line}</p>
                  </div>
                ))}

                {newsData.security_name && (
                  <div className='py-2 border-b border-gray-200 dark:border-gray-700'>
                    <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>Company Name: </span>
                    <span className='text-sm text-gray-900 dark:text-gray-100'>{newsData.security_name}</span>
                  </div>
                )}

                {newsData.published_date && (
                  <div className='py-2'>
                    <span className='text-xs font-medium text-gray-500 dark:text-gray-400'>Published: </span>
                    <span className='text-sm text-gray-900 dark:text-gray-100'>{formatDate(newsData.published_date)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Additional Info Card - Show when there's metadata */}
            {(newsData.security_name || newsData.published_date || newsData.board_meeting_date) && hasBody && (
              <div className='bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-6 border border-emerald-200 dark:border-emerald-700'>
                <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-4'>Additional Information</h4>
                <div className='space-y-2 text-sm'>
                  {newsData.security_name && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-400'>Company:</span>
                      <span className='font-medium text-gray-900 dark:text-gray-100'>{newsData.security_name}</span>
                    </div>
                  )}
                  {newsData.published_date && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-400'>Published:</span>
                      <span className='font-medium text-gray-900 dark:text-gray-100'>{formatDate(newsData.published_date)}</span>
                    </div>
                  )}
                  {newsData.board_meeting_date && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600 dark:text-gray-400'>Board Meeting:</span>
                      <span className='font-medium text-gray-900 dark:text-gray-100'>{formatDate(newsData.board_meeting_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Document Download Card */}
            {hasFile && (
              <div className='bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-6 border-2 border-emerald-200 dark:border-emerald-700'>
                <div className='flex items-start gap-4'>
                  <div className='bg-emerald-500 p-3 rounded-lg flex-shrink-0'>
                    <FileText className='w-6 h-6 text-white' />
                  </div>
                  <div className='flex-1'>
                    <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                      {isPDF(fileUrl) ? 'PDF Document Available' : 'Full Document Available'}
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      {isPDF(fileUrl) 
                        ? 'View or download the PDF document for complete details.'
                        : 'View or download the document for more information.'}
                    </p>
                    <button
                      onClick={handleDownload}
                      className='w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors'
                    >
                      <Download className='w-5 h-5' />
                      <span>Download Document</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default page