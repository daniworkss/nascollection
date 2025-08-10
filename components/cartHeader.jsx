import Image from "next/image"
import { useState } from "react"
import { ShoppingBag, ChevronLeft} from "lucide-react"
import Cart from "./cart"
import { useCartStore } from "@/context/cart"
import Link from "next/link"
import { useRouter } from "next/router"

export default function CartHeader(){  
    const context = useCartStore()
    const router = useRouter()
    if(!context) return null
    const {cart,total,count} = context

  return (
    <>
    <div className=" flex z-30 items-center justify-between px-4 py-4 bg-white shadow-md fixed w-full ">
    <div className="flex flex-row-reverse items-center">
             <Link href={'/'}>
                <h1 className="text-orange-600 font-poppins-bold mt-2">Na&apos;sCollections</h1>
            </Link>

     < button className=" mt-2" onClick={()=> router.back()}>
        <ChevronLeft color="black"/>
     </button>

    </div>
      <div className="flex gap-4 items-center mt-2" >
            <div  className="cursor-pointer relative text-[30px] tablet:text-[42px]  w-full flex  justify-end pr-1"> 
                                  {
                                      count > 0 && (
                                        <div className="bg-orange w-[12px] h-[12px] rounded-full absolute right-0 z-10 top-0 flex justify-center items-center ">
                                          <p className="text-white text-[6px] font-hbold">{count}</p>
                                        </div>
                                      )
                                    }
                                
                                <ShoppingBag className="" size={24}/>
                </div>

      </div>

     

    </div>
        {/* for cart */}
          <div className={`overflow-hidden z-20 pt-3 w-full  absolute bg-white min-h-screen top-[4.5rem] left-0 `}>
                              {
                                  cart.length === 0 ?
                                  (
                                      <div className="flex flex-col items-center justify-center p-8">
                                          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                                          <p className="text-gray-600">Add some items to get started!</p>
                                    </div>
                                  ) :
                                  (
                                   <Cart cart={cart} total={total}></Cart>
                                  )

                              }
              </div>


 </>
  )
};
