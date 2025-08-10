import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./product-card";
export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.post('/api/fetch-products'); // Your API endpoint
       const data = response.data;
        setProducts(data.products || data); // Adjust based on your API response structure
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 text-xl font-semibold mb-2">Error Loading Products</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className=" min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-500 text-xl font-semibold mb-2">No Products Found</div>
            <p className="text-gray-400">Check back later for new products.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
          .slice(0, 6) // take only 6 latest
          .map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}