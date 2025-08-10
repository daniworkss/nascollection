import Cart from "@/components/cart"
import { useCartStore } from "@/context/cart"
import CartHeader from "@/components/cartHeader"
export default function Overview(){
    const context = useCartStore()
    if(!context) return null
    const {cart,total} = context
  return (
    <div>
        <CartHeader/>
            <div className="pt-[4.5rem] ">
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
    </div>
  )
};
