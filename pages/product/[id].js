import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import Header from "@/components/user/header";
import { useCartStore } from "@/context/cart";
import Link from "next/link";
export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [buttonText, setbuttonText] = useState("Add to Cart");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  
  // Category-specific selections
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedInch, setSelectedInch] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

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

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);
  
  // For handling escape key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isModalOpen]);

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.inches && product.inches.length > 0) {
        setSelectedInch(product.inches[0]);
      }
    }
  }, [product]);

  const fetchProduct = async (id) => {
    try {
      const res = await axios.get(`/api/product-page/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setError("");
    
    // Validate category-specific selections
    if (product.category === 'dresses' || product.category === 'bags') {
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setError("Please select a color");
        return;
      }
    }
    
    if (product.category === 'dresses') {
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setError("Please select a size");
        return;
      }
    }
    
    if (product.category === 'wigs') {
      if (product.inches && product.inches.length > 0 && !selectedInch) {
        setError("Please select a length");
        return;
      }
    }

    // Add product with selected attributes
    const productWithSelections = {
      ...product,
      selectedColor,
      selectedSize,
      selectedInch
    };

    addToCart(productWithSelections, quantity, id);
    setbuttonText("Product Added");
    setQuantity(1);
  };

  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < product?.stock) {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US").format(price);
  };

  // Function to open modal with selected image
  const openImageModal = (imageUrl) => {
    console.log("Opening modal with image:", imageUrl);
    setModalImage(imageUrl);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  // Function to close modal
  const closeModal = (e) => {
    // Prevent event bubbling
    if (e) e.stopPropagation();
    console.log("Closing modal");
    setIsModalOpen(false);
    // Re-enable body scrolling
    document.body.style.overflow = "auto";
  };

  // Calculate discount percentage
  const discount = product?.prevprice && product.prevprice > product.price 
    ? Math.round(((product.prevprice - product.price) / product.prevprice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 ">
        <Header />
        <div className="flex justify-center items-center pt-32 min-h-screen">
          <div className="text-center">
            <BeatLoader color="#ea580c" size={15} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Header />
        <div className="flex justify-center items-center min-h-screen pt-32">
          <div className="text-center bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
            <p className="text-gray-500">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="inline-flex items-center mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <div className="max-w-8xl mx-auto px-4 py-12 sm:px-6 lg:px-8 pt-28">
        {/* Enhanced Breadcrumb */}
        <nav className="flex mb-12" aria-label="Breadcrumb">
          <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-gray-100">
            <ol className="flex items-center space-x-3 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li>
                <Link
                  href={`/products/${product?.category}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors font-medium capitalize"
                >
                  {product.category}
                </Link>
              </li>
              <li className="text-gray-300">/</li>
              <li>
                <span className="text-gray-900 font-semibold capitalize truncate max-w-48">
                  {product?.name}
                </span>
              </li>
            </ol>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-20">
          {/* Left Column - Product Images */}
          <div className="space-y-8">
            {/* Main Image with Enhanced Gallery View */}
            <div className="sticky top-8">
              <div 
                className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl border border-gray-100 cursor-zoom-in group"
                onClick={() => {
                  if (product.images && product.images.length > 0) {
                    openImageModal(product.images[selectedImage]);
                  }
                }}
              >
                {product.images && product.images.length > 0 && (
                  <Image
                    src={product.images[selectedImage]}
                    alt={`${product.name} image`}
                    layout="fill"
                    objectFit="contain"
                    quality={100}
                    priority
                    className="transition duration-700 ease-out group-hover:scale-105 p-6"
                  />
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-6 left-6 bg-orange-500 text-white text-sm font-bold px-3 py-2 rounded-xl shadow-lg z-10">
                    -{discount}% OFF
                  </div>
                )}

                {/* Enhanced Image Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((prev) =>
                          prev === 0 ? product.images.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl border border-gray-200/50 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((prev) =>
                          prev === product.images.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl border border-gray-200/50 hover:bg-white hover:scale-110 transition-all duration-200 z-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}

                {/* Zoom Indicator */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Enhanced Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                        selectedImage === index
                          ? "ring-3 ring-gray-900 ring-offset-2 scale-105 shadow-xl"
                          : "ring-2 ring-gray-200 hover:ring-gray-400 hover:scale-102 shadow-lg"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`thumbnail ${index + 1}`}
                        layout="fill"
                        objectFit="contain"
                        quality={90}
                        className="hover:opacity-80 transition-opacity p-2 bg-white"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Enhanced Product Details */}
          <div className="space-y-10">
            {/* Store Name & Product Title */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors underline underline-offset-4 decoration-2 decoration-gray-300 hover:decoration-gray-900 capitalize">
                    Nascollections
                  </p>
                </div>
                
                {/* Category Badge */}
                <span className="bg-orange-500 text-white font-medium py-2 px-4 rounded-xl text-sm capitalize">
                  {product.subcategory ? formatSubcategory(product.subcategory) : product.category}
                </span>
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-optima-medium text-gray-900 tracking-tight leading-tight capitalize">
                {product.name}
              </h1>
              
              {/* Enhanced Price Display */}
              <div className="flex items-baseline space-x-4 pt-2">
                <div className="flex items-baseline space-x-2">
                  <span className="text-sm font-medium text-gray-600">$</span>
                  <p className="text-4xl font-black text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>
                {product.prevprice && product.prevprice > product.price && (
                  <div className="flex items-center space-x-3">
                    <p className="text-xl text-gray-400 line-through font-medium">
                      ${formatPrice(product.prevprice)}
                    </p>
                    <span className="bg-red-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                      -{discount}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Category-Specific Attribute Selections */}
            <div className="space-y-6">
              {/* Color Selection for Dresses and Bags */}
              {(product.category === 'dresses' || product.category === 'bags') && product.colors && product.colors.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Available Colors</h3>
                  <div className="grid grid-cols-6 gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedColor(color);
                          setError("");
                        }}
                        className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                          selectedColor === color
                            ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2 scale-110"
                            : "border-gray-300 hover:border-gray-500 hover:scale-105"
                        }`}
                        style={{ backgroundColor: getColorHex(color) }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedColor && (
                    <p className="mt-3 text-sm text-gray-600 font-medium">
                      Selected: <span className="capitalize font-bold text-gray-900">{selectedColor}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Size Selection for Dresses */}
              {product.category === 'dresses' && product.sizes && product.sizes.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Available Sizes</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedSize(size);
                          setError("");
                        }}
                        className={`px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                          selectedSize === size
                            ? "bg-gray-900 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                        }`}
                      >
                        {size.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p className="mt-3 text-sm text-gray-600 font-medium">
                      Selected: <span className="uppercase font-bold text-gray-900">{selectedSize}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Inch Selection for Wigs */}
              {product.category === 'wigs' && product.inches && product.inches.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                  <h3 className="text-lg font-optima-medium text-gray-900 mb-4">Available Lengths</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {product.inches.map((inch, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedInch(inch);
                          setError("");
                        }}
                        className={`px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                          selectedInch === inch
                            ? "bg-gray-900 text-white shadow-lg scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                        }`}
                      >
                        {inch}"
                      </button>
                    ))}
                  </div>
                  {selectedInch && (
                    <p className="mt-3 text-sm text-gray-600 font-medium">
                      Selected: <span className="font-bold text-gray-900">{selectedInch} inches</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced Stock Status */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
              {product.stock > 0 ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="w-4 h-4 bg-green-500 rounded-full absolute top-0 left-0 animate-ping opacity-30"></div>
                    </div>
                    <div>
                      <span className="text-lg font-optima-medium text-green-700">In Stock</span>
                      <p className="text-sm text-green-600 font-medium">{product.stock} units available</p>
                    </div>
                  </div>
                  {product.stock <= 5 && (
                    <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-xl text-sm font-bold">
                      Low Stock!
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-lg font-bold text-red-700">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Enhanced Product Description */}
            {product?.description && (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
                <h3 className="text-xl font-optima-medium text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-800 font-semibold">{error}</p>
                </div>
              </div>
            )}

            {/* Enhanced Quantity and Add to Cart */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl space-y-8">
              {product.stock > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-xl font-optima-medium text-gray-900">
                      Quantity
                    </label>
                    <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full font-medium">
                      {product.stock} available
                    </span>
                  </div>
                  
                  {/* Premium Quantity Selector */}
                  <div className="relative">
                    <div className="flex items-center bg-gray-50 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
                      <button
                        onClick={() => handleQuantityChange("decrease")}
                        disabled={quantity <= 1}
                        className="flex items-center justify-center w-16 h-16 rounded-l-2xl bg-white border-r-2 border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <div className="flex-1 h-16 flex items-center justify-center text-2xl font-optima-medium text-gray-900 bg-white">
                        {quantity}
                      </div>
                      
                      <button
                        onClick={() => handleQuantityChange("increase")}
                        disabled={quantity >= product.stock}
                        className="flex items-center justify-center w-16 h-16 rounded-r-2xl bg-white border-l-2 border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Quick Select Pills */}
                    <div className="flex gap-3 mt-4">
                      {[1, 2, 3, 5].filter(num => num <= product.stock).map(num => (
                        <button
                          key={num}
                          onClick={() => setQuantity(num)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                            quantity === num
                              ? 'bg-gray-900 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    
                    {/* Stock Warning */}
                    {quantity > product.stock * 0.8 && (
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl mt-4">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-amber-800 font-optima-medium">
                          Only {product.stock - quantity} left in stock
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Premium Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || buttonText === "Product Added"}
                className={`relative w-full py-5 px-8 flex items-center justify-center text-white rounded-2xl text-lg font-black shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 active:scale-98 overflow-hidden ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : buttonText === "Product Added"
                    ? "orange-gradient-btn"
                    : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900"
                }`}
              >
                {/* Button Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <span className="flex items-center space-x-3 relative z-10">
                  <span>
                    {product.stock === 0 ? "Out of Stock" : buttonText}
                  </span>
                  
                  {buttonText === "Add to Cart" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  )}
                  
                  {buttonText === "Product Added" && (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                
                {quantity > 1 && buttonText === "Add to Cart" && (
                  <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
                    {quantity}
                  </span>
                )}
              </button>

              {/* Selected Attributes Summary */}
              {(selectedColor || selectedSize || selectedInch) && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">Your Selection</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedColor && (
                      <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-lg border">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: getColorHex(selectedColor) }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">{selectedColor}</span>
                      </div>
                    )}
                    {selectedSize && (
                      <div className="bg-white px-3 py-1 rounded-lg border">
                        <span className="text-sm font-medium text-gray-700 uppercase">{selectedSize}</span>
                      </div>
                    )}
                    {selectedInch && (
                      <div className="bg-white px-3 py-1 rounded-lg border">
                        <span className="text-sm font-medium text-gray-700">{selectedInch} inches</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Product Details */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg">
              <h3 className="text-xl font-optima-medium text-gray-900 mb-6">Product Information</h3>
              <dl className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <dt className="text-sm font-bold text-gray-600 uppercase tracking-wide">Category</dt>
                  <dd className="mt-2 text-lg font-semibold text-gray-900 capitalize">
                    {product.subcategory ? formatSubcategory(product.subcategory) : product.category}
                  </dd>
                </div>
               
                <div className="bg-gray-50 p-4 rounded-xl">
                  <dt className="text-sm font-bold text-gray-600 uppercase tracking-wide">Stock</dt>
                  <dd className="mt-2 text-lg font-semibold text-gray-900">{product.stock} units</dd>
                </div>
                {id && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <dt className="text-sm font-bold text-gray-600 uppercase tracking-wide">SKU</dt>
                    <dd className="mt-2 text-lg font-semibold text-gray-900 font-mono">{id}</dd>
                  </div>
                )}

                {/* Category-specific additional info */}
                {(product.category === 'dresses' || product.category === 'bags') && product.colors && product.colors.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-xl sm:col-span-2">
                    <dt className="text-sm font-bold text-gray-600 uppercase tracking-wide">Available Colors</dt>
                    <dd className="mt-2 flex flex-wrap gap-1">
                      {product.colors.map((color, index) => (
                        <span key={index} className="text-sm bg-white text-gray-700 px-2 py-1 rounded capitalize">
                          {color}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                {product.category === 'dresses' && product.sizes && product.sizes.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-xl sm:col-span-2">
                    <dt className="text-sm font-bold text-gray-600 uppercase tracking-wide">Available Sizes</dt>
                    <dd className="mt-2 flex flex-wrap gap-1">
                      {product.sizes.map((size, index) => (
                        <span key={index} className="text-sm bg-white text-gray-700 px-2 py-1 rounded uppercase">
                          {size}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                {product.category === 'wigs' && product.inches && product.inches.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-xl sm:col-span-2">
                    <dt className="text-sm font-bold text-gray-600 uppercase tracking-wide">Available Lengths</dt>
                    <dd className="mt-2 flex flex-wrap gap-1">
                      {product.inches.map((inch, index) => (
                        <span key={index} className="text-sm bg-white text-gray-700 px-2 py-1 rounded">
                          {inch} inches
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Enhanced Shipping & Returns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-3 rounded-xl">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">Free Shipping</h4>
                    <p className="mt-1 text-blue-700 font-medium">Delivery within 1 hour</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 p-3 rounded-xl">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">24hr Refund Policy</h4>
                    <p className="mt-1 text-green-700 font-medium">If items are damaged or defective</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Modal */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white rounded-full p-3 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Image */}
              <div className="relative w-full h-[80vh] bg-white">
                <Image
                  src={modalImage}
                  alt="Enlarged product view"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}