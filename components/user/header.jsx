import { ShoppingBag,Menu,X ,ChevronRight} from "lucide-react"
import { useState } from "react"
import { useEffect } from "react"
import { disablePageScroll,enablePageScroll } from "scroll-lock";
import Link from "next/link";
import { useCartStore } from "@/context/cart";
export default function Header(){
    const [openMenu, setpOpenMenu] = useState(false);
    const [isClient, setIsClient] = useState(false)
    const context = useCartStore()
    const handleMenu =() =>{
        setpOpenMenu(!openMenu);
        if(!openMenu){
            disablePageScroll();
        }else{
            enablePageScroll();
        }
    }

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!context) return null
    const { count } = context
  return (
    <div>
        {/* mobile view */}
        <div className="lg:hidden z-30 w-full top-0 h-[70px] bg-white shadow-sm fixed justify-between flex items-center px-[20px]">
            <Link href={'/'}>
                <h1 className="text-orange-600 font-poppins-bold mt-2">Na&apos;sCollections</h1>
            </Link>

            <div className="flex items-center gap-4">
                     <Link href={'/cart/overview'} className="cursor-pointer relative lg:mr-0 text-[30px] tablet:text-[42px] lg:hidden">
                            {isClient && count > 0 && (
                                <div className="bg-orange w-[12px] h-[12px] rounded-full absolute right-0 z-10 top-0 flex justify-center items-center">
                                    <p className="text-white text-[6px] font-hbold">{count}</p>
                                </div>
                            )}
                            <ShoppingBag className="" size={24} />
                        </Link>

              <div className={` flex justify-center ${openMenu == true ? 'bg-orange-200' : 'bg-white'} transition-colors ease-in duration-150 rounded-md h-[30px] w-[30px] `}>
                <button onClick={handleMenu} className={`${openMenu  == true ? 'text-orange-500':'text-gray-600'} cursor-pointer`}>
                    {openMenu ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>

            {/* for nav */}

            <div className={` w-full  top-[4.2rem] absolute overflow-hidden  ${openMenu == true ? 'h-[250px]' : 'h-0'} transition-all ease duration-150 left-0 rounded-b-2xl  bg-gray-50 `}>
                <nav className={`${openMenu == true ? 'py-[20px] px-[16px] pb-4' : 'hidden'}`}>
                    <ul className="flex flex-col space-y-5 divide-y-[0.1px]  divide-gray-200 ">
                        <Link href={'/'} className="text-[16px] font-optima hover:text-orange-500 flex justify-between items-center  ">
                            New Arivals
                            <ChevronRight className="inline-block ml-1 text-orange-500" size={16} />
                        </Link>

                        <Link href={'/'} className="text-[16px] font-optima hover:text-orange-500 flex justify-between items-center ">
                            Wigs
                            <ChevronRight className="inline-block ml-1 text-orange-500" size={16} />
                        </Link>

                        <Link href={'/'} className="text-[16px] font-optima hover:text-orange-500 flex justify-between items-center ">
                            Dresses
                            <ChevronRight className="inline-block ml-1 text-orange-500" size={16} />    
                        </Link>
                        <Link href={'/'} className="text-[16px] font-optima hover:text-orange-500 flex justify-between items-center ">
                            Bags
                            <ChevronRight className="inline-block ml-1 text-orange-500" size={16} />
                        </Link>
                        <Link href={'/'} className="text-[16px] font-optima hover:text-orange-500 flex justify-between items-center ">
                            Accessories
                            <ChevronRight className="inline-block ml-1 text-orange-500" size={16} />
                        </Link>
                    </ul>
                </nav>
            </div>
        </div>  

        {/* desktop view */}

    </div>
  )
};
