import { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
export default function ProductCard({ product }) {
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

  const formatSubcategory = (subcategory) => {
    return subcategory?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  };


    const [isHovered, setIsHovered] = useState(false);
    // Calculate discount percentage
    const discount = product.prevprice && product.prevprice > product.price 
      ? Math.round(((product.prevprice - product.price) / product.prevprice) * 100)
      : 0;

    // Handle add to cart
    const handleAddToCart = async () => {
      try {
        const response = await fetch('/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product._id || product.id,
            quantity: 1
          })
        });

        if (response.ok) {
          // Handle success (show toast, update cart count, etc.)
          console.log('Product added to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    };

    // Handle wishlist toggle
  

    return (
      <div 
        className="bg-white rounded-sm shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images?.[0] || 'https://placehold.co/600x400'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400'; // Fallback image
            }}
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{discount}%
            </div>
          )}

          {/* Quick Actions */}
          <div className={`absolute top-3 right-3 flex flex-col space-y-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <button className="w-8 h-8 bg-white text-gray-600 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all duration-200">
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart - Shows on Hover */}
          <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Link
              href={`/product/${product.id}`}
              className="w-full bg-black text-white py-2 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-2">
          {/* Category */}
          <div>
            <span className="text-xs bg-orange-500 text-white font-optima-medium py-[6px] px-2 rounded-sm text-[10px] capitalize ">
              {
                product.subcategory ? formatSubcategory(product.subcategory) : product.category
              }
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-optima-medium text-gray-800 text-[16px] leading-tight line-clamp-2 h-10 capitalize">
            {product.name}
          </h3>

          {/* Available Colors for Dresses and Bags */}
          {(product.category === 'dresses' || product.category === 'bags') && product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500 mr-1">Colors:</span>
              <div className="flex space-x-1">
                {product.colors.slice(0, 4).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 4}</span>
                )}
              </div>
            </div>
          )}

          {/* Available Sizes for Dresses */}
          {product.category === 'dresses' && product.sizes && product.sizes.length > 0 && (
            <div className="flex space-x-1">
              <span className="text-xs text-gray-500 mr-1">Sizes:</span>
              {product.sizes.slice(0, 4).map((size) => (
                <span key={size} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase">
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}

          {/* Available Inches for Wigs */}
          {product.category === 'wigs' && product.inches && product.inches.length > 0 && (
            <div className="flex space-x-1">
              <span className="text-xs text-gray-500 mr-1">Length:</span>
              {product.inches.slice(0, 3).map((inch) => (
                <span key={inch} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {inch}"
                </span>
              ))}
              {product.inches.length > 3 && (
                <span className="text-xs text-gray-500">+{product.inches.length - 3}</span>
              )}
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">${product.price}</span>
            {product.prevprice && product.prevprice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.prevprice}</span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock && product.stock < 10 && (
            <div className="text-xs text-orange-600 font-medium">
              Only {product.stock} left in stock
            </div>
          )}
        </div>
      </div>
    );
  };