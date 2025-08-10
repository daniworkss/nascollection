import { Card, CardContent, CardHeader, CardTitle } from "./card" 
import Link from "next/link"
import { 
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    ShoppingBag,
    TagIcon,
  } from "lucide-react"
export default function ProductCard({ product, onDelete }) {
    // Status badge component
    const StatusBadge = ({ status, stock }) => {
      if (status === 'out_of_stock') {
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Out of Stock
          </span>
        )
      } else if (stock < 5 && stock > 0) {
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Low Stock: {stock}
          </span>
        )
      } else {
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            In Stock: {stock}
          </span>
        )
      }
    }
  
    return (
      <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="relative">
          <img 
            src={product?.images?.[0] || product?.images} 
            alt={product?.name}
            className="w-full h-48 object-contain"
          />
      
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
            <div className="relative group">
              <button className="p-1">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <div className="py-1">
                  <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                    <Eye className="h-4 w-4 mr-2" /> View Details
                  </button>
                  <Link href={`/admin/dashboard/edit-product/${product.id}`} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center">
                    <Edit className="h-4 w-4 mr-2" /> Edit Product
                  </Link>
                  <button 
                    onClick={onDelete}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
              <p className="text-gray-500 text-sm">{product?.id}</p>
            </div>
            <div className="font-bold text-gray-900">
              ${product?.price?.toLocaleString()}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm mb-2">
            <div className="text-gray-600">
              <span className="flex items-center">
                <TagIcon className="h-3 w-3 mr-1" /> {product?.category}
              </span>
            </div>
            <div className="text-gray-600">
              <span className="flex items-center">
                <ShoppingBag className="h-3 w-3 mr-1" /> {product?.sales} sold
              </span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <StatusBadge status={product?.status} stock={product?.stock} />
            <div className="flex items-center text-amber-500">
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </CardContent>
        
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <span className="text-xs text-gray-500">Added {product?.date_added}</span>
          <div className="flex space-x-2">
            <Link href={`/sellers/dashboard/edit-product/${product?.id}`} className="p-1 hover:text-orange transition-colors">
              <Edit className="h-4 w-4" />
            </Link>
            <button 
              className="p-1 hover:text-red-600 transition-colors cursor-pointer"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    )
  }