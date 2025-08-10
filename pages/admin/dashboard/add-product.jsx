import { useState } from "react";
import { Upload, X, Plus, Check, Star, ShoppingBag, Shirt, Crown, Gem, Link, Package, DollarSign } from "lucide-react";
import Layout from "@/components/admin/layout";
import { ToastContainer,toast } from "react-toastify";
import Image from "next/image";
export default function ModernAddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [inches, setInches] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [youtubeLink, setYoutubeLink] = useState("");
  const [showloading, setShowloading] = useState(false);
  const [category, setCategory] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [hairSubcategory, setHairSubcategory] = useState("");
  const [dressSubcategory, setDressSubcategory] = useState("");
  const [jewelrySubcategory, setJewelrySubcategory] = useState("");
  const availableColors = [
    { name: 'Red', value: 'red', hex: '#EF4444' },
    { name: 'Blue', value: 'blue', hex: '#3B82F6' },
    { name: 'Green', value: 'green', hex: '#10B981' },
    { name: 'Yellow', value: 'yellow', hex: '#F59E0B' },
    { name: 'Orange', value: 'orange', hex: '#F97316' },
    { name: 'Purple', value: 'purple', hex: '#8B5CF6' },
    { name: 'Pink', value: 'pink', hex: '#EC4899' },
    { name: 'Grey', value: 'grey', hex: '#6B7280' },
    { name: 'Black', value: 'black', hex: '#111827' },
    { name: 'White', value: 'white', hex: '#F9FAFB' },
    { name: 'Lilac', value: 'lilac', hex: '#C084FC' },
    { name: 'Skyblue', value: 'skyblue', hex: '#0EA5E9' },
    { name: 'Gold', value: 'gold', hex: '#F59E0B' },
    { name: 'Silver', value: 'silver', hex: '#9CA3AF' },
  ];

  const availableSizes = [
    { name: 'SM', value: 'sm' },
    { name: 'MD', value: 'md' },
    { name: 'LG', value: 'lg' },
    { name: 'XL', value: 'xl' },
    { name: 'XXL', value: 'xxl' },
  ];

  const categories = [
    { name: 'Wigs', value: 'wigs', icon: Crown },
    { name: 'Bags', value: 'bags', icon: ShoppingBag },
    { name: 'Dresses', value: 'dresses', icon: Shirt },
    { name: 'Jewelries', value: 'jewelries', icon: Gem },
  ];

  const handleColorToggle = (colorValue) => {
    setSelectedColors(prevColors => {
      if (prevColors.includes(colorValue)) {
        return prevColors.filter(color => color !== colorValue);
      } else {
        return [...prevColors, colorValue];
      }
    });
  };

  const handleSizeToggle = (sizeValue) => {
    setSelectedSize(prevSize => {
      if (prevSize.includes(sizeValue)) {
        return prevSize.filter(size => size !== sizeValue);
      } else {
        return [...prevSize, sizeValue];
      }
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).slice(0, 6);
      setImages(fileArray);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };


  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please select at least one image', {
        style: { fontSize: 14 },
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("prevprice",oldPrice)
    formData.append("inches", inches);
    formData.append("stock", stock);
    formData.append("colors", JSON.stringify(selectedColors));
    formData.append("youtubeLink", youtubeLink);
    formData.append('sizes', JSON.stringify(selectedSize))
    formData.append("hairSubcategory", hairSubcategory);
    // Append subcategory based on category
    if (jewelrySubcategory !== "") {
      formData.append("subcategory", jewelrySubcategory);
    }else if (hairSubcategory !== "") {
      formData.append("subcategory", hairSubcategory);
    }
    // Append multiple images
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    setShowloading(true);

    try {
      const response = await fetch('/api/upload-product', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      console.log("Response from server:", data);
      
      if (!response.ok) {
        toast.error('Something went wrong. Please try again.', {
          style: { fontSize: 14 },
        });
      } else {
        toast.success('Product has been added successfully', {
          style: { fontSize: 14 },
        });
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      toast.error('Something went wrong. Please try again.', {
        style: { fontSize: 14 },
      });
    }finally{
      setShowloading(false);
      // Reset form
      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setInches("");
      setStock("");
      setImages([]);
      setSelectedColors([]);
      setYoutubeLink("");
      setSelectedSize([]);
      setOldPrice("");
      setHairSubcategory("");
    }
    // Simulate API call
 
  };

  return (
  <Layout>
    <ToastContainer/>
      <div className="min-h-screen bg-gradient-to-br pt-[4rem] from-indigo-50 via-white to-orange-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 orange-gradient-btn rounded-2xl mb-4 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-optima-medium text-gray-700  mb-1">
              Add New Product
            </h1>
            <p className="text-gray-600 text-[14px]">Create and customize your product listing</p>
          </div>

          <div className="space-y-8">
            {/* Basic Information Card */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-optima-medium text-gray-800 mb-6 flex items-center">
                <Package className="w-5 h-5 mr-2 text-gray-600" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl  border-[1px] border-gray-200 focus:ring-1 outline-0 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/50 "
                    placeholder="Enter product name..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl  border-[1px] border-gray-200 focus:ring-1 outline-0 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/50 "
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl  border-[1px] border-gray-200 focus:ring-1 outline-0 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/50  resize-none"
                  rows="4"
                  placeholder="Describe your product..."
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-optima-medium text-gray-800 mb-6">Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                        category === cat.value
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 hover:border-orange-300 bg-white/50'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Wig Subcategory */}
              {category === 'wigs' && (
                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Wig Type</label>
                  <select
                    value={hairSubcategory}
                    onChange={(e) => setHairSubcategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 outline-0  focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/50"
                    required
                  >
                    <option value="">Select Wig Type</option>
                    <option value="long_wigs">Long Wigs</option>
                    <option value="short_wigs">Short Wigs</option>
                    <option value="bouncy_wigs">Bouncy Wigs</option>
                    <option value="bob_wigs">Bob Wigs</option>
                    <option value="pixie_wigs">Pixie Wigs</option>
                    <option value="kinky_wigs">Kinky Wigs</option>
                  </select>
                </div>
              )}

           
              {/* Jewelry Subcategory */}
              {category === 'jewelries' && (
                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Wig Type</label>
                  <select
                    value={jewelrySubcategory}
                    onChange={(e) => setJewelrySubcategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 outline-0  focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/50"
                    required
                  >
                    <option value="">Select Jewelry Type</option>
                    <option value="rings">Rings</option>
                    <option value="necklace">Necklace</option>
                    <option value="bracelet">Bracelets</option>
                    <option value="earrings">Earrings</option>
                  </select>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-optima-medium text-gray-800 mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Current Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 outline-0  focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/50"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Old Price ($) 
                    <span className="text-gray-500 text-xs ml-1">(optional)</span>
                  </label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 outline-0  focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/50"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Colors (for bags and dresses) */}
            {(category === 'dresses' || category === 'bags') && (
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Available Colors</h3>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleColorToggle(color.value)}
                      className={`relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 group ${
                        selectedColors.includes(color.value)
                          ? 'border-orange-500 bg-orange-50 scale-105'
                          : 'border-gray-200 hover:border-orange-300 bg-white/50 hover:scale-102'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                        style={{ 
                          backgroundColor: color.hex,
                          border: color.value === 'white' ? '2px solid #e5e7eb' : '2px solid transparent'
                        }}
                      />
                      <span className="text-xs font-medium">{color.name}</span>
                      {selectedColors.includes(color.value) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes (for dresses) */}
            {category === 'dresses' && (
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Available Sizes</h3>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => handleSizeToggle(size.value)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        selectedSize.includes(size.value)
                          ? 'bg-orange-500 text-white shadow-lg scale-105'
                          : 'bg-white/50 border border-gray-200 hover:border-orange-300 hover:scale-102'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wig Inches */}
            {category === 'wigs' && (
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Wig Specifications</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Available Inches</label>
                  <input
                    type="text"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200 bg-white/50"
                    placeholder="e.g., 12, 14, 16, 18"
                  />
                </div>
              </div>
            )}

            {/* YouTube Link */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-optima-medium text-gray-800 mb-6 flex items-center">
                <Link className="w-5 h-5 mr-2 text-red-500" />
                YouTube Video 
                <span className="text-gray-500 text-sm ml-2">(optional)</span>
              </h3>
              <input
                type="text"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200 bg-white/50"
                placeholder="https://youtube.com/watch?v=example"
              />
            </div>

            {/* Image Upload */}
            <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-optima-medium text-gray-800 mb-6 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-500" />
                Product Images
              </h3>
              
              <div className="space-y-6">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300/50 rounded-xl cursor-pointer bg-gradient-to-br from-orange-50 to-orange-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-orange-500" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold text-orange-500">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 6 images</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {images.map((image, i) => (
                      <div key={i} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Product Image ${i + 1}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={showloading}
                className="px-12 py-4 orange-gradient-btn text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center space-x-2"
              >
                {showloading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    <span>Add Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

  </Layout>
  );
}