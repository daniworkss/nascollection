"use client"
import Image from "next/image"
import { X, Plus, Minus } from 'lucide-react'
import { useCartStore } from "@/context/cart"
import { useRouter } from "next/router"


export default function Cart({ cart, total }) {
  const { removeFromCart, updateQuantity } = useCartStore()
  // const { userLoggedIn } = useUserData()
  const router = useRouter()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  }

  // Helper function to get color hex values
  const getColorHex = (colorName) => {
    const colorMap = {
      'red': '#EF4444',
      'blue': '#3B82F6',
      'green': '#10B981',
      'yellow': '#F59E0B',
      'orange': '#F97316',
      'purple': '#8B5CF6',
      'pink': '#EC4899',
      'grey': '#6B7280',
      'black': '#111827',
      'white': '#F9FAFB',
      'lilac': '#C084FC',
      'skyblue': '#0EA5E9',
      'gold': '#F59E0B',
      'silver': '#9CA3AF'
    };
    return colorMap[colorName?.toLowerCase()] || '#9CA3AF';
  };

  const handleQuantityUpdate = (cartItemId, currentQuantity, action) => {
    const newQuantity = action === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity > 0) {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleLoginCheck = () => {
    // Your login check logic here
    console.log('Proceeding to checkout');
  };

  return (
    <div className="max-w-4xl mx-auto p-3 bg-gray-50 pt-5">
      <h2 className="text-2xl font-optima-medium mb-2">Shopping Cart</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 overflow-y-auto h-[280px] laptop:h-[200px] py-2">
        {cart?.map((item) => (
          <div 
            key={item.cartItemId} 
            className="flex items-start gap-4 p-4 bg-white rounded-sm shadow laptop:w-full min-h-[80px] transition-all duration-200 hover:shadow-md"
          >
            {/* Product Image */}
            <div className="w-20 h-20 laptop:w-[50px] laptop:h-[50px] flex-shrink-0">
              <Image
                src={item.images?.[0] || 'https://placehold.co/400x400'} 
                alt={item.name || 'product image'}
                width={80}
                height={80}
                objectFit="cover"
                objectPosition="top"
                quality={100}
                className="w-full h-full object-contain rounded-md bg-gray-50"
              />
            </div>
            
            {/* Product Details */}
            <div className="flex-grow min-w-0">
              {/* Product Name */}
              <h3 className="font-medium text-[14px] laptop:text-[16px] font-satoshi capitalize text-gray-900 leading-tight">
                {item.name}
              </h3>

              {/* Product Variations */}
              {item.variations && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {/* Color */}
                  {item.variations.selectedColor && (
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                        style={{ backgroundColor: getColorHex(item.variations.selectedColor) }}
                        title={item.variations.selectedColor}
                      />
                      <span className="text-xs text-gray-600 capitalize">
                        {item.variations.selectedColor}
                      </span>
                    </div>
                  )}

                  {/* Size */}
                  {item.variations.selectedSize && item.category === 'dresses' && (
                    <div className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700 uppercase font-medium">
                      {item.variations.selectedSize}
                    </div>
                  )}

                  {/* Length for Wigs */}
                  {item.variations.selectedInch && item.category === 'wigs' && (
                    <div className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-700 font-medium">
                      {item.variations.selectedInch}"
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-3">
                  {/* Quantity Adjuster */}
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => handleQuantityUpdate(item.cartItemId, item.quantity, 'decrease')}
                      className="p-1 hover:bg-gray-100 transition-colors rounded-l-lg"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} className={item.quantity <= 1 ? 'text-gray-400' : 'text-gray-600'} />
                    </button>
                    
                    <span className="px-3 py-1 text-sm font-medium min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityUpdate(item.cartItemId, item.quantity, 'increase')}
                      className="p-1 hover:bg-gray-100 transition-colors rounded-r-lg"
                    >
                      <Plus size={14} className="text-gray-600" />
                    </button>
                  </div>

                  {/* Unit Price */}
                  <div className="text-sm text-gray-600">
                   ${formatPrice(item.price)} each
                  </div>
                </div>

                {/* Total Price for this item */}
                <div className="text-right">
                  <div className="font-black text-orange-500 text-sm laptop:text-base">
                   ${formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.cartItemId)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0"
              aria-label="Remove item"
            >
              <X size={18} />
            </button>
          </div>
        ))}

        {/* Empty Cart Message */}
        {(!cart || cart.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
            <p className="text-gray-500 text-sm">Add some products to get started</p>
          </div>
        )}
      </div>
      
      {/* Order Summary */}
      {cart && cart.length > 0 && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="space-y-3">
            {/* Cart Summary */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Items ({cart.length})</span>
              <span>${formatPrice(total)}</span>
            </div>
            
            {/* Total */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between text-xl font-satoshi-bold">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
              </div>
            </div>
          </div>
          
          {/* Checkout Button */}
            <button 
              onClick={handleLoginCheck} 
              className="w-full mt-6 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Proceed to Checkout
            </button>
          
          
          {/* Continue Shopping */}
          <button 
            onClick={() => router.push('/')}
            className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  )
}