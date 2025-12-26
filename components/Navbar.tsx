"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { HeartHandshakeIcon, User2Icon, CreditCard, LogOutIcon , ChevronDown, LayoutDashboard,  LogIn, TrendingUp , X, Menu, Divide} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { ModeToggle } from './ui/ModeToggle'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authstore'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdowm-menu"
import { Button } from './ui/button'

const Navbar = () => {
   const { user, isAuthenticated, checkAuth, logout } = useAuthStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setisOpen] = useState(false)
  const [isToolsOpen, setisToolsOpen] = useState(false)
  const [isnepseToolOpen, setisnepseToolOpen] = useState(false)
   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false) 
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname(); 
  
  const isHomePage = pathname === '/home'; 

  
  const handlelogout = () => {
      logout();
      router.push("/home");
   };
 const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHomePage) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
      setisOpen(false)
    }
  } 



const isActive  = (href: string)  => {
  const currentPath = pathname.replace(/\/$/, "")
  const linkHref = href.replace(/\/$/, '');

  if (linkHref === '/home') {
          return currentPath === '/home' || currentPath === '/home';
      }
      return currentPath === linkHref;
}

const toolsItems = [
  { name: "Bonus Share Adj. Calculator", href: "/bonus" },
  { name: "Right Share Adj. Calculator", href: "/rightshare" },
  { name: "SIP Calculator", href: "/sip" },
]

const nepseItems = [
  { name: "Live-market", href: "/live" },
  { name: "Nepse classification list", href: "/classificationlist" },
  { name: "Company-news", href: "/companylist" },
  { name: "Company-list", href: "/companylist" },
  { name: "Debenture & bond", href: "/debentureandbond" },
  { name: "Holiday-list", href: "/holidaylist" },
  { name: "Press-release", href: "/press-release" },
  { name: "Securitylist", href: "/securitylist" },
  { name: "Securitypromoterlist", href: "/securityprmoterlist" },
  { name: "Supply-demand", href: "/supply-demand" },
]

const handleMouseEnter = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  setisnepseToolOpen(false)
  setisToolsOpen(true)
}

const handleMouseLeave = () => {
  const id = setTimeout(() => {
    setisToolsOpen(false)
  }, 100)
  setTimeoutId(id)
}


const handlenepseMouseEnter = () => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  setisToolsOpen(false) 
  setisnepseToolOpen(true)
}

const handlenepseMouseLeave = () => {
  const id = setTimeout(() => {
    setisnepseToolOpen(false)
  }, 100)
  setTimeoutId(id)
}

const renderLinkText = (name: string, href: string) => {
      const active = isActive(href);
      const baseClasses = 'text-md font-medium transition-colors';
      const activeClasses = 'text-emerald-600 dark:text-emerald-400'; 
      const inactiveClasses = 'text-gray-700 dark:text-white hover:text-green-500 dark:hover:text-green-400';
      
      const className = `${baseClasses} ${active ? activeClasses : inactiveClasses}`;

      return (
          <span className={className}>
              {active ? `⦚ ${name} ⦚` : name}
          </span>
      );
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    <nav className={`top-0 left-0 right-0 z-50 fixed border-b-4 transition-all duration-300 
    ${
      isScrolled 
        ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl border-gray-300 dark:border-gray-700 shadow-sm' 
        : 'bg-white dark:bg-zinc-900 border-gray-300 dark:border-gray-600'
        }`
      }
    >
      <div className='flex items-center justify-between h-20  lg:px-6 max-w-[1400px] mx-auto'>
        <Link href={"/home"} onClick={handleHomeClick} className='flex gap-2 pb-2'>
          <TrendingUp className='w-8 h-8 text-emerald-500'/>
          <span className='cursor-pointer text-3xl font-semibold text-gray-900 dark:text-white'>Paiso</span>
        </Link>

        <div className='hidden md:flex items-center  md:space-x-5 lg:space-x-16 mx-4'>
          <Link
            href={"/home"}
            onClick={handleHomeClick}
          >
            {renderLinkText("Home", "/home")}
          </Link>
          <Link href={"/charts"}>
            {renderLinkText("Charts", "/charts")}
          </Link>
          <Link href={"/news"}>
            {renderLinkText("News", "/news")}
          </Link>


          <div 
            className='relative'
            onMouseEnter={handlenepseMouseEnter}
            onMouseLeave={handlenepseMouseLeave}
          >
            <div className='cursor-pointer flex items-center gap-1 text-md font-medium text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400'>
              NEPSE
              <ChevronDown className={`w-4 h-4 transition-transform ${isnepseToolOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isnepseToolOpen && (
              <div className='absolute top-full left-0 pt-2 
              '>
                <div className='w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden'>
                  {nepseItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setisnepseToolOpen(false)}
                      className='block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Desktop Tools Dropdown */}
          <div 
            className='relative'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className='cursor-pointer flex items-center gap-1 text-md font-medium text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400'>
              Tools
              <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {isToolsOpen && (
              <div className='absolute top-full left-0 pt-2'>
                <div className='w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden'>
                  {toolsItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setisToolsOpen(false)}
                      className='block px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='hidden md:flex items-center sm:gap-1 lg:gap-6'>
          <div className='cursor-pointer bg-gray-300/40 dark:bg-gray-700/40 rounded-full '>

          <ModeToggle  />
          </div>
 { isAuthenticated? (<>
 <Link  className=' flex items-center text-md font-medium px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200' href={"/dashboard"}>
<LayoutDashboard/>
 Dashboard
 </Link>
 </>):(

   <>
   <button  onClick={() =>router.push("/login")} className='cursor-pointer flex items-center gap-2 text-lg font-medium px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200'>
   <LogIn className='w-4 h-4'/>
   Login
   </button>
   </>
  )
          }
          {isAuthenticated? (
            <DropdownMenu onOpenChange={setIsUserDropdownOpen}>
      <DropdownMenuTrigger asChild>
  <button   className='cursor-pointer flex items-center gap-2 hover:bg-emerald-400 text-lg font-medium px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600  transition-colors text-gray-700 dark:text-gray-200'>
      {user?.first_name}  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="dark:bg-zinc-900 dark:text-white bg-white  ">
       <DropdownMenuItem className='flex items-center justify-center'>
        {user?.first_name}
        </DropdownMenuItem>
        
       <DropdownMenuItem className=''>
        {user?.email}
        </DropdownMenuItem>
      
       <DropdownMenuItem  onClick={() => router.push("/profile")}   className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'> <User2Icon/>View Profile</DropdownMenuItem>
       <DropdownMenuItem  onClick={() => router.push("/dashboard")}  className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'><LayoutDashboard/>Dashboard</DropdownMenuItem>
       <DropdownMenuItem  onClick={() => router.push("/subscription")}  className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'><CreditCard/>Subscription</DropdownMenuItem>
       <DropdownMenuItem  onClick={() => router.push("/support")}  className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'><HeartHandshakeIcon/>Support</DropdownMenuItem>
       <DropdownMenuItem  onClick={() => handlelogout()}  className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-600 transition-colors'> <LogOutIcon/>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
          ):(
            <button  onClick={() =>router.push("/login")} className='p-2 cursor-pointer lg:text-md font-medium lg:px-2 lg:py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors'>
            Get Started
            </button>
          ) }
        </div>
  <div className='md:hidden flex items-center gap-2'>
  {/* Show ModeToggle only when menu is closed */}
  {!isOpen && (
    <div onClick={(e) => e.stopPropagation()}>
      <ModeToggle />
    </div>
  )}
  
  {/* Menu toggle button */}
  <button 
    className='p-2 text-gray-700 dark:text-gray-200' 
    onClick={() => setisOpen(!isOpen)}
  > 
    {isOpen ? <X className='w-7 h-7'/> : <Menu className='w-7 h-7'/>}
  </button>
</div>
</div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 space-y-6 shadow-md">
          <Link
            href="/home"
            onClick={() => setisOpen(false)}
            className="block"
          >
            {renderLinkText("Home", "/home")}
          </Link>
          <Link
            href="/charts"
            onClick={() => setisOpen(false)}
            className="block"
          >
            {renderLinkText("Charts", "/charts")}
          </Link>

          <Link
            href="/news"
            onClick={() => setisOpen(false)}
            className="block"
          >
            {renderLinkText("News", "/news")}
          </Link>

          <Link
            href="/blogs"
            onClick={() => setisOpen(false)}
            className="block"
          >
            {renderLinkText("Blogs", "/blogs")}
          </Link>

          {/* Mobile Tools Section */}
          <div>
            <div 
              className="flex items-center gap-1 text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 cursor-pointer"
              onClick={() => setisToolsOpen(!isToolsOpen)}
            >
              Tools <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {isToolsOpen && (
              <div className="mt-3 ml-4 space-y-3">
                {toolsItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => {
                      setisOpen(false)
                      setisToolsOpen(false)
                    }}
                    className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4 pb-8 ">

 { isAuthenticated? (<>
 <Link  className='justify-center flex items-center text-md font-medium px-2 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200' href={"/dashboard"}>
<LayoutDashboard/>
 Dashboard
 </Link>
 </>):(

   <>
   <button  onClick={() =>router.push("/login")} className='cursor-pointer flex justify-center items-center gap-2 text-lg font-medium px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200'>
   <LogIn className='w-4 h-4'/>
   Login
   </button>
   </>
  )
          }

             {isAuthenticated? (
            <DropdownMenu onOpenChange={setIsUserDropdownOpen}>
      <DropdownMenuTrigger asChild>
  <button   className='cursor-pointer w-full items-center justify-center flex items-center gap-2 hover:bg-emerald-400 text-lg font-medium px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600  transition-colors text-gray-700 dark:text-gray-200'>
      {user?.first_name}  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dark:bg-zinc-900 dark:text-white items-center justify-center  bg-white w-[60vw]  ">
       <DropdownMenuItem className='flex items-center justify-center '>
        {user?.first_name}
        </DropdownMenuItem>
        
       <DropdownMenuItem className=''>
        {user?.email}
        </DropdownMenuItem>
      
       <DropdownMenuItem  onClick={() => router.push("/profile")}   className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'> <User2Icon/>View Profile</DropdownMenuItem>
       <DropdownMenuItem  onClick={() => router.push("/dashboard")}  className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'><LayoutDashboard/>Dashboard</DropdownMenuItem>
       <DropdownMenuItem  onClick={() => router.push("/subscription")}  className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'><CreditCard/>Subscription</DropdownMenuItem>
       <DropdownMenuItem  onClick={() => router.push("/support")}  className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors'><HeartHandshakeIcon/>Support</DropdownMenuItem>
       <DropdownMenuItem  onClick={() => handlelogout()}  className='cursor-pointer  text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800 hover:text-red-600 dark:hover:text-red-600 transition-colors'> <LogOutIcon/>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
          ):(
            <button  onClick={() =>router.push("/login")} className='p-2 cursor-pointer lg:text-md font-medium lg:px-2 lg:py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors'>
            Get Started
            </button>
          ) }
          </div>
        </div>
      )}
    </nav>
    <div className="h-20"></div>
    </>
  )
}
export default Navbar