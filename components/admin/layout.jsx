import Image from "next/image"
import Link from "next/link"
import { Menu,X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/router"
import { House,Cog,Archive,Tag,ChartNoAxesColumn, LogOut } from "lucide-react"
import { Firebase_auth } from "@/config/firebase"
export default function Layout({children}){
    const [openMenu,setOpenmenu] = useState(false)
    const router = useRouter()
    const {pathname} =router
    // to sign out
    async function Signout() {
        await Firebase_auth.signOut()
        localStorage.clear()
        router.replace('/')
      }
    const handlemenu = ()=>{
        setOpenmenu(!openMenu);
         if (!openMenu) { 
        //    disablePageScroll()
         } else {
        //   enablePageScroll()
         }
        }

        const normalLink = 'w-full text-center py-2 font-satoshi  text-gray-700 flex justify-center lg:text-[18px] flex items-center gap-2'
        const activeLink = 'orange-gradient-btn  w-full text-center py-2 font-satoshi-bold  text-white flex justify-center lg:text-[18px] flex items-center gap-2 '
  return (
    <div className="lg:flex">
        {/* for mobile  header */}
        <div className=" lg:hidden flex items-center justify-between px-4 py-4 bg-white shadow-lg fixed w-full z-2">
            <div>
            <Link href={'/'}>
                <h1 className="text-orange-600 font-poppins-bold mt-2">Na&apos;sCollections</h1>
            </Link>
            </div>
      <div className="flex gap-4 items-center mt-2" >
            <button  className={` rounded-sm  transition-colors duration-150 ease-in ${openMenu == true ? 'bg-orange-200 text-orange-600': 'bg-white text-gray-800'}`} onClick={handlemenu}>
                {
                    !openMenu ? <Menu size={25}/> : <X size={25}/>
                }
            </button>
      </div>
{/* navigation   */}
      <div className={`${openMenu? 'flex': 'hidden'} absolute top-[4rem] w-full h-screen right-0 backdrop-blur-lg flex justify-end`}>
         <div className="w-[75%] bg-white shadow-sm h-screen pt-[3rem] ">
      
                <ul className="space-y-[20px]">
                    <Link  href={'/admin/dashboard/home'} className={pathname.includes('/admin/dashboard/home') ? activeLink : normalLink}><House size={18}/>Home</Link>
                    <Link href={'/admin/dashboard/orders'} className={pathname.includes('/admin/dashboard/orders') ? activeLink : normalLink}> <Archive size={18}/>Orders</Link>
                    <Link href={'/admin/dashboard/products'} className={pathname.includes('/admin/dashboard/products') || pathname.includes('admin/dashboard/add-product') || pathname.includes('admin/dashboard/edit-product/') ? activeLink : normalLink}>  <Tag size={18}/>Products</Link>
                    <Link href={'/admin/dashboard/transactions'} className={pathname.includes('/admin/dashboard/transactions') ? activeLink : normalLink}> <ChartNoAxesColumn size={18}/>Transactions</Link>
                    <Link href={'/admin/dashboard/settings'} className={pathname.includes('/admin/dashboard/settings') ? activeLink : normalLink}> <Cog size={18}/>Settings</Link>
                </ul>

                <div className="w-full flex justify-center mt-[3rem]">
                    <button onClick={Signout} className="bg-green font-satoshi-black w-[80%] flex gap-2 py-3 justify-center items-center rounded-[5px] text-[14px] text-white ">
                          Log Out
                         <LogOut size={16}/>
                    </button>
                </div>
         </div>
      </div>  

        </div>

        {/* for laptop layout */}
        
        <div className="w-[23%] hidden lg:block h-screen bg-white px-[20px] py-[2rem] fixed left-0 top-0 z-10 border-r">
          <div className=" flex w-full justify-between items-center">
            <Link href={'/'}>
                    <h1 className="text-orange-600   text-2xl font-poppins-bold mt-2">Na&apos;sCollections</h1>
                </Link>
            <div className="text-grey-2 font-satoshi-black  flex items-center gap-1 mt-2">
                <Tag className="text-[16px] " size={16}></Tag>
                <p className="text-[14px]">
                    Admin
                </p>
            </div>
          </div>

           <div className="w-[full] bg-white  h-screen pt-[4rem] ">
                <ul className="space-y-[40px]">
                    <Link href={'/admin/dashboard/home'} className={pathname.includes('/admin/dashboard/home') ? activeLink : normalLink}><House size={18}/>Home</Link>
                    <Link href={'/admin/dashboard/orders'} className={pathname.includes('/admin/dashboard/orders') ? activeLink : normalLink}> <Archive size={18}/>Orders</Link>
                    <Link href={'/admin/dashboard/products'} className={pathname.includes('/admin/dashboard/products') || pathname.includes('admin/dashboard/add-product') || pathname.includes('admin/dashboard/edit-product') ? activeLink : normalLink}>  <Tag size={18}/>Products</Link>
                    <Link href={'/admin/dashboard/transactions'} className={pathname.includes('/admin/dashboard/transactions') ? activeLink : normalLink}> <ChartNoAxesColumn size={18}/>Transactions</Link>
                    <Link href={'/admin/dashboard/settings'} className={pathname.includes('/admin/dashboard/settings') ? activeLink : normalLink}> <Cog size={18}/>Settings</Link>
                </ul>

                <div className="w-full flex justify-center mt-[3rem]">
                    <button onClick={Signout} className="bg-green font-satoshi-black w-[80%] flex gap-2 py-3 justify-center items-center rounded-[5px] text-[18px] text-white ">
                          Log Out
                         <LogOut size={18}/>
                    </button>
                </div>
         </div>
        </div>
        <div className="w-full lg:ml-[23%] h-screen bg-gray-50 pt-[1.5rem] lg:pt-0 overflow-y-auto">
      
        {
            children
        }
      </div>
    </div>
  )
};
