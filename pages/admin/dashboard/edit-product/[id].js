"use client";
import React, { useState } from 'react';
import axios from 'axios';
import {Firebase_storage } from '@/config/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { 
  ArrowLeft, 
  Save, 
  X, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Camera
} from 'lucide-react';
import Layout from '@/components/seller/layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loader from '@/components/animation/loader';
import Image from 'next/image';
export default function EditProductPage() {
    const router = useRouter()
    const {id} = router.query
  // Mock product data
//   fetc product data
const [formData, setFormData] = useState();
const [pageLoader, setPageLoader] = useState(true)
const [pageLoadingError, setPageLoadingError] = useState(false)
const [loading, setLoading] = useState(false);
const [saveSuccess, setSaveSuccess] = useState(false);
const [errors, setErrors] = useState({});
const [previewImages, setPreviewImages] = useState([]);
const [images,setImages] = useState([])
const [updateError, setUpdateError] = useState(false)

useEffect(()=>{
    async function fetchProduct(productId){
        try {
            const res = await axios.get(`/api/sellers/edit-product/${productId}`)
            const product = res.data
            setImages(product.images || [])
            setPreviewImages(product.images || [])
            setFormData(product)
        } catch (error) {
            setPageLoadingError(true)
            console.log(error.message,'error something went wrong.')
        }finally{
            setPageLoader(false)
        }
    }

    if(id !== undefined){
        fetchProduct(id)
    }

},[id,])


  const categories = [
    { value: "", label: "Select Category" },
    { value: "fashion", label: "Fashion" },
    { value: "phones", label: "Phones" },
    { value: "laptops", label: "Laptops" },
    { value: "electronics", label: "Electronics" },
    { value: "vehicles", label: "Vehicles" },
    { value: "beauty", label: "Beauty" },
    { value: "food_seller", label: "Food & Drinks" },
    { value: "groceries", label: "Groceries" },
    { value: "perfume", label: "Perfume " },
    { value: "books", label: "Books" },
    { value: "pets", label: "Pets" },
    { value: "furnitures", label: "Furnitures" },
    { value: "houses&hostels", label: "Houses & Hostels" },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle image upload;
  const uploadImage = async (files) => {
     const uploadPromises = files.map(async (file) => {
       const fileName = `products/${Date.now()}-${file.name}`;
       const storageRef = ref(Firebase_storage, fileName);
       const uploadTask = uploadBytesResumable(storageRef, file);
      
       return new Promise((resolve, reject) =>        {
         uploadTask.on(
           'state_changed',
           null,
           (error) => reject(error),
           async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    });

    return await Promise.all(uploadPromises);

  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...urls].slice(0, 5));
    setImages (prev =>[...prev,...files].slice(0,5))
  };
  
  // Remove image
  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    if (previewImages.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setLoading(true);

    try {
        const imageUrls = images.length > 0 ? await uploadImage(images) : formData.images
        const updatedproduct = {
            name: formData.name,
            description: formData.description,
            price: Number(formData.price),
            stock: Number(formData.stock),
            category: formData.category,
            images: imageUrls
        }
        console.log(updatedproduct.images,'this is the og of the updated product')
        await axios.put(`/api/sellers/update-product/${id}`, {updatedproduct})
        setTimeout(() => {
            setLoading(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }, 1500);
        } catch (error) {
            setLoading(false)
            console.log(error.message, 'it failed')
            setUpdateError(true)
            setTimeout(() => {
              setUpdateError(false)
            }, 3000);
         }
       
    
    
  };


  const handleCancel = () => {
    // Cancel logic
    router.back()
  };
  

  return (
   <div>
        {
            pageLoader == true ? (<Loader/>)
            : pageLoadingError === true ? (
            
            <div className="flex justify-between min-h-screen items-center">
                <p className="text-gray-500 text-center -mt-[4rem] w-full">Something went wrong please refresh.</p>
            </div>
            
            )
            : (
                <Layout>
                        <div className="min-h-screen bg-gray-50 pt-[3.3rem] lg:pt-0">
                        {/* Header */}
                        <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
                            <div className="max-w-7xl mx-auto flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button 
                                onClick={handleCancel}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </button>
                                <div>
                                <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                                <p className="text-gray-500 text-sm">Update your product information</p>
                                </div>
                            </div>
                            
                            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                                <Eye className="h-5 w-5 text-gray-600" />
                            </button>
                            </div>
                        </div>
                
                        {/* Success Alert */}
                        {saveSuccess && (
                            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-green-800 font-medium">Product updated successfully!</span>
                            </div>
                            </div>
                        )}
                        {/* error */}
                         {updateError === true && (
                            <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5 text-red-600" />
                                <span className="text-red-800 font-medium">Something went wrong. Try again.</span>
                            </div>
                            </div>
                        )}
                
                        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${
                                        errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter product name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                        {errors.name}
                                        </p>
                                    )}
                                    </div>
                
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange resize-none ${
                                        errors.description ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Describe your product..."
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                        {errors.description}
                                        </p>
                                    )}
                                    </div>
                
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (₦) *
                                        </label>
                                        <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${
                                            errors.price ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        />
                                        {errors.price && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-1" />
                                            {errors.price}
                                        </p>
                                        )}
                                    </div>
                
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Quantity *
                                        </label>
                                        <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange ${
                                            errors.stock ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="0"
                                        min="0"
                                        />
                                        {errors.stock && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-1" />
                                            {errors.stock}
                                        </p>
                                        )}
                                    </div>
                                    </div>
                                </div>
                                </div>
                
                                {/* Product Images */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h2>
                                
                                <div className="space-y-4">
                                    {/* Upload Area */}
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium">Click to upload images</p>
                                        <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 5MB each (Max 5 images)</p>
                                    </label>
                                    </div>
                
                                    {/* Image Preview Grid */}
                                    {previewImages?.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {previewImages.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                            src={image}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-42  object-contain rounded-lg border border-gray-200"
                                            />
                                            <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                            <X className="h-3 w-3" />
                                            </button>
                                            {index === 0 && (
                                            <div className="absolute bottom-1 left-1 bg-orange text-white text-xs px-2 py-1 rounded">
                                                Main
                                            </div>
                                            )}
                                        </div>
                                        ))}
                                    </div>
                                    )}
                
                                    {errors.images && (
                                    <p className="text-red-600 text-sm flex items-center">
                                        <AlertTriangle className="h-4 w-4 mr-1" />
                                        {errors.images}
                                    </p>
                                    )}
                                </div>
                                </div>
                            </div>
                
                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Product Settings */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                                    >
                                        {categories.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.label}
                                        </option>
                                        ))}
                                    </select>
                                    </div>
                
                                    <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange"
                                    >
                                        {statusOptions.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                        ))}
                                    </select>
                                    </div>
                
                                    <div className="pt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300 text-green-600 focus:ring-orange"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Featured Product</span>
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">Featured products appear first in search results</p>
                                    </div>
                                </div>
                                </div>
                
                                {/* Action Buttons */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="space-y-3">
                                    <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full bg-orange hover:bg-orange-500 text-white cursor-pointer font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                                    >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                        <>
                                        <Save className="h-4 w-4 " />
                                        <span>Save Changes</span>
                                        </>
                                    )}
                                    </button>
                
                                    <button
                                    onClick={handleCancel}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                                    >
                                    Cancel
                                    </button>
                                </div>
                                </div>
                
                                {/* Product Preview */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
                                
                                <div className="border border-gray-200 rounded-lg overflow-hidden pt-2">
                                    {previewImages?.length > 0 && (
                                    <img
                                        src={previewImages[0]}
                                        alt="Product preview"
                                        className="w-full h-42 object-contain"
                                    />
                                    )}
                                    <div className="p-3">
                                    <h4 className="font-medium text-gray-800 text-sm">
                                        {formData.name || 'Product Name'}
                                    </h4>
                                    <p className="text-orange font-bold text-lg mt-1">
                                        ₦{formData.price?.toLocaleString() || '0'}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {formData.stock} in stock
                                    </p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                </Layout>
            )
        }
   </div>
  );
}