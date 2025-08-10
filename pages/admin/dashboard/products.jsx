import Layout from "@/components/admin/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/card" 
import { Alert, AlertDescription, AlertTitle } from "@/components/admin/alert"
import { useState, useEffect } from "react"
import useStoreDetails from "@/context/store"
import axios from "axios"
import Link from "next/link"
import React from "react"
import { useRouter } from "next/router"
import { BarLoader } from "react-spinners"
import ProductCard from "@/components/admin/product-card"
import { 
  Filter,
  Search,
  Plus,
  AlertTriangle,
  BriefcaseBusiness,
  Package,
  ShoppingBag,
  CheckCircle,
  XCircle
} from "lucide-react"

export default function SellerDashboardProducts() {
  const router = useRouter()
  // Get store data from Zustand
  const { products,setProducts,storeData,setStoreData} = useStoreDetails()
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [error, setError] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const productsPerPage = 6
  

  // Extracted unique categories from products
   const categories = [
    {value:'all', label:"All Products"},
    {value:'fashion', label:"Fashion"},
    {value:'electronics', label:'Electronics'},
    {value:'beauty', label:'Beauty'},
    {value:'Furnitures', label:'Furnitures'},
    {value:'groceries', label:'Groceries'},
    {value:'houses&hostels', label:'Houses & Hostels'}
   ]

  // Availability options for filtering
  const availabilityOptions = [
    { value: "all", label: "All Products" },
    { value: "active", label: "In Stock" },
    { value: "out_of_stock", label: "Out of Stock" },
    // { value: "featured", label: "Featured" }
  ]

  // Product summary stats
  const productStats = {
    total: products.length,
    inStock: products.reduce((acc, product) => acc + (product.stock || 0), 0),// looping all products to add stock value
    outOfStock: products.filter(product => product.stock === 0).length,
    totalSales: storeData.totalOrders
  }

  useEffect(() => {
    // Check login state first
    const checkstate = localStorage.getItem('loggedIn')
    if (checkstate == null) {
      router.push('/admin')
      return
    }
  
    // If products already exist in state, use them
    if (products.length > 0) {
      setFilteredProducts(products)
      setLoading(false)
      return
    }
  
    // Otherwise, fetch from API
    fetchData()
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      setFilteredProducts(products)
      setLoading(false)
    }
  }, [products])


     async function fetchData() {
      try {
        const res = await axios.get('/api/fetchData')
        setStoreData(res.data.storeData)
        setProducts(res.data.products)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error.message)
        setError(true)
      }
    }

    useEffect(() => {
      // Safety check 
      if (products.length === 0) {
        setFilteredProducts([])
        return
      }
    
      let result = [...products]
      
      if (searchTerm) {
        result = result.filter(product => 
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (selectedCategory !== "all") {
        const categoryFilter = selectedCategory.toLowerCase().replace(/\s+/g, '_')
        result = result.filter(product => 
          product.category?.toLowerCase().replace(/\s+/g, '_') === categoryFilter
        )
      }
      
      if (selectedAvailability !== "all") {
        if (selectedAvailability === "featured") {
          result = result.filter(product => product.featured)
        } else {
          result = result.filter(product => product.status === selectedAvailability)
        }
      }
      
      setFilteredProducts(result)
      setCurrentPage(1)
    }, [searchTerm, selectedCategory, selectedAvailability, products])

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  // Handle availability filter change
  const handleAvailabilityChange = (e) => {
    setSelectedAvailability(e.target.value)
  }

  // Handle delete product
  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    // Filter out the product to delete
    await axios.post('/api/sellers/delete-product', {productId:productToDelete.id})
    const updatedProducts = products.filter(product => product.id !== productToDelete.id)
    setProducts(updatedProducts)
    setShowDeleteModal(false)
    setProductToDelete(null)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setProductToDelete(null)
  }
  
  if (error == true ){
    return(
      <Layout>
        <div className="w-full h-screen flex justify-center pt-[20rem] text-[14px] text-gray-600" > Something Went Wrong. Please Refresh</div>
      </Layout>
    )
  }
  return (
   
        <Layout>
            {
                 loading == true ? 
            (<div className=" flex justify-center min-h-screen pt-[6rem] lg:items-center">
                <BarLoader color="#1f763b"/>
            </div>):(
             
                <div className="p-6 lg:p-8 space-y-8 pt-20 lg:pt-6 max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:pb-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-3xl font-optima-bold text-gray-800">Products</h2>
                    <p className="text-gray-500 mt-1">Manage your product inventory</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0">
                    <Link href={'/admin/dashboard/add-product'} className="orange-gradient-btn  w-[60%] lg:w-[100%] cursor-pointer hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium flex items-center font-poppins-medium space-x-2 transition-colors duration-100">
                      <Plus className="h-4 w-4" />
                      <span>Add New Product</span>
                    </Link>
                  </div>
                </div>
                
                {/* Product Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ProductStatCard 
                    title="Total Products" 
                    value={productStats.total} 
                    icon={<Package className="text-orange" />}
                  />
                  <ProductStatCard 
                    title="In Stock" 
                    value={productStats.inStock} 
                    icon={<CheckCircle className="text-green-600" />}
                  />
                  <ProductStatCard 
                    title="Out of Stock" 
                    value={productStats.outOfStock} 
                    icon={<XCircle className="text-red-600" />}
                  />
                  <ProductStatCard 
                    title="Total Sales" 
                    value={productStats.totalSales} 
                    icon={<ShoppingBag className="text-purple-600" />}
                  />
                </div>
                
                {/* Low Stock Alert */}
                {products.some(product => product.stock > 0 && product.stock < 5) && (
                  <Alert className="bg-amber-50 border-amber-300 text-amber-800 mb-6">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <AlertTitle className="font-bold text-amber-800">Low Stock Alert</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Some of your products are running low on inventory. Consider restocking soon.
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Products Section */}
              {
                products.length > 0 ? (
                  <div className="mt-8">
                  {/* Filters and Search */}
                  <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
                    <div className="flex items-center w-full md:w-auto bg-white border border-gray-300 rounded-lg px-3 py-2">
                      <Search className="h-5 w-5 text-gray-400 mr-2" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-1 bg-transparent outline-none text-sm"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-center w-full sm:w-auto bg-white border border-gray-300 rounded-lg px-3 py-2">
                        <BriefcaseBusiness className="h-5 w-5 text-gray-400 mr-2" />
                        <select 
                          className="flex-1 bg-transparent outline-none text-sm appearance-none cursor-pointer pr-8"
                          value={selectedCategory}
                          onChange={handleCategoryChange}
                        >
                          {categories.map(category => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex items-center w-full sm:w-auto bg-white border border-gray-300 rounded-lg px-3 py-2">
                        <Filter className="h-5 w-5 text-gray-400 mr-2" />
                        <select 
                          className="flex-1 bg-transparent outline-none text-sm appearance-none cursor-pointer pr-8"
                          value={selectedAvailability}
                          onChange={handleAvailabilityChange}
                        >
                          {availabilityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Products Grid */}
                  {currentProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentProducts.map(product => (
                        <ProductCard 
                          key={product.id}
                          product={product}
                          onDelete={() => handleDeleteClick(product)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No Products Found</h3>
                      <p className="text-gray-500 mb-6">We couldn't find any products matching your criteria</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('')
                          setSelectedCategory('all')
                          setSelectedAvailability('all')
                        }}
                        className="text-orange hover:text-orange-700 font-medium"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                  
                  {/* Pagination */}
                  {filteredProducts.length > productsPerPage && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center space-x-2" aria-label="Pagination">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === 1 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => (
                            page === 1 || 
                            page === totalPages || 
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ))
                          .map((page, i, array) => (
                            <React.Fragment key={page}>
                              {i > 0 && array[i - 1] !== page - 1 && (
                                <span className="text-gray-500">...</span>
                              )}
                              <button
                                onClick={() => paginate(page)}
                                className={`px-3 py-1 rounded-md ${
                                  currentPage === page
                                    ? 'bg-orange text-white'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          ))
                        }
                        
                        <button
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === totalPages 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
                ):(
                
                <div>
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-optima-medium text-gray-800 mb-2">No Products Found</h3>
                    <p className="text-gray-500 mb-6">You have not added any products yet.</p>
                    <Link 
                      href="/admin/dashboard/add-product"
                      className="bg-gray-800 py-3 rounded-md px-5  text-white font-medium"
                    >
                      Add your first product
                    </Link>
                    </div>
                  
                </div>
                
              )
              }
              </div>
              
            )


            }
         
          
          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 backdrop-blur-lg  bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete <span className="font-medium">{productToDelete?.name}</span>? 
                  This action cannot be undone.
                </p>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </Layout>
   
  )
}

function ProductStatCard({ title, value, icon }) {
  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm overflow-hidden ">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0 pt-5 px-5">
        <CardTitle className="text-sm font-optima-medium text-gray-500">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-gray-50">{icon}</div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="text-2xl font-poppins-medium mt-2">{value}</div>
      </CardContent>
    </Card>
  )
}

