import Layout from "@/components/admin/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/card" 
import { useState, useEffect, use } from "react"
import useStoreDetails from "@/context/store"
import { BarLoader } from "react-spinners"
import axios from "axios"
import { 
  Filter,
  Search,
  PackageCheck, 
  ShoppingCart, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  DollarSign,
  AlertTriangle
} from "lucide-react"
import OrderStatCard from "@/components/admin/order-stat-card"
import { useRouter } from "next/router"
export default function Orders() {
  //  store data from context
  const {
    products, setProducts, storeData, setStoreData
  } = useStoreDetails()

  const [loading, setLoading] = useState(true)
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [error, setError] = useState(false)
  const router = useRouter()
  const ordersPerPage = 10

  // Order status options for filtering
  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "completed", label: "Completed" },
  ]

  // Order summary stats with proper null checks
  const orderStats = {
    total: storeData?.totalOrders || 0,
    completed: storeData?.totalOrders || 0,
    totalRevenue: storeData?.totalRevenue || 0
  }

  useEffect(() => {
    // Check login state first and foremost
    const checkstate = localStorage.getItem('loggedIn')
    if (checkstate == null) {
      router.push('/admin')
    } else {
      // Check if storeData exists and has orders
      if (storeData && storeData.orders && storeData.orders.length > 0) {
        console.log('will not use api because data passed from the state @home')
        setFilteredOrders(storeData.orders)
        setLoading(false)
      } else {
        console.log('using the api. because there is nothing from the state manager')
        fetchData()
      }
    }
  }, [])

  async function fetchData() {
    try { 
      setLoading(true)
      const res = await axios.get('/api/fetchData')
      
      // Set store data
      setStoreData(res.data.storeData)
      setProducts(res.data.products)
      
      // Set filtered orders with proper fallback
      const orders = res.data.storeData?.orders || []
      setFilteredOrders(orders)
      setLoading(false)
      
    } catch (error) {
      setLoading(false)
      console.log(error.message)
      setError(true)
    }
  }

  // Handle search and filtering
  useEffect(() => { 
    // Only run if storeData and orders exist
    if (!storeData || !storeData.orders) {
      return
    }

    let result = [...storeData.orders]
    
    // Filter orders based on search term
    if (searchTerm) {
      result = result.filter(order => 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status if not "all"
    if (selectedStatus !== "all") {
      result = result.filter(order => order.status === selectedStatus);
    }
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedStatus, storeData])

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Handle status filter change
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value)
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      completed: "bg-orange-100 text-orange-800",
      processing: "bg-blue-100 text-blue-800",
      pending: "bg-amber-100 text-amber-800",
      cancelled: "bg-red-100 text-red-800"
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
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
       </div>):
       (
          <div className="p-6 lg:p-8 space-y-8 pt-20 lg:pt-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-3xl font-optima-bold text-gray-800">Orders</h2>
              <p className="text-gray-500 mt-1">Manage and process your customer orders</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-50 transition-colors">
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              <button className="orange-gradient-btn hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          {/* Order Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <OrderStatCard 
              title="Total Orders" 
              value={orderStats.total} 
              icon={<ShoppingCart className="text-orange" />}
            />
            {/* <OrderStatCard 
              title="Completed" 
              value={orderStats.completed} 
              icon={<PackageCheck className="text-green-600" />}
            />
            <OrderStatCard 
              title="Processing" 
              value={orderStats.processing} 
              icon={<Clock className="text-blue-600" />}
            />
            <OrderStatCard 
              title="Pending" 
              value={orderStats.pending} 
              icon={<AlertTriangle className="text-amber-600" />}
            /> */}
            <OrderStatCard 
              title="Revenue" 
              value={`$${orderStats.totalRevenue.toLocaleString()}`} 
              icon={<DollarSign className="text-purple-600" />}
            />
          </div>
          
          {/* Orders Table Section */}
          <div className="mt-8">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <div className="flex items-center w-full md:w-auto bg-white border lg:w-[30%] border-gray-300 rounded-lg px-3 py-2">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search order by number ..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="flex items-center w-full md:w-auto bg-white border border-gray-300 rounded-lg px-3 py-2">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select 
                  className="flex-1 bg-transparent outline-none text-sm appearance-none cursor-pointer pr-8"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Orders Table */}
            <Card className="rounded-xl border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-left">
                      <th className="p-4 font-medium">Order ID</th>
                      <th className="p-4 font-medium">Customer</th>
                      <th className="p-4 font-medium hidden md:table-cell">Date</th>
                      <th className="p-4 font-medium hidden lg:table-cell">Items</th>
                      <th className="p-4 font-medium">Total</th>
                      <th className="p-4 font-medium">Status</th>
                      {/* <th className="p-4 font-medium text-right">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentOrders.length > 0 ? (
                      currentOrders.sort((a,b) => new Date (b.createdAt) - new Date (a.createdAt))
                      .map((order,i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-orange">{order.orderId}</td>
                          <td className="p-4">
                            <div className="font-satoshi capitalize">{order.username}</div>
                            <div className="text-xs text-gray-500">{order?.email}</div>
                          </td>
                
                          <td className="p-4 text-gray-500 hidden md:table-cell">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          </td>
                          <td className="p-4 text-gray-700 hidden lg:table-cell">{order.quantity} item{order.quantity !== 1 ? 's' : ''}</td>
                          <td className="p-4 font-medium">₦{order.orderTotal.toLocaleString()}</td>
                          <td className="p-4">
                            <StatusBadge status={order.status} />
                          </td>
                          {/* <td className="p-4 text-right">
                            <button className="text-orange hover:text-orange-700 font-medium text-sm">
                              View Details
                            </button>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">
                          No orders found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {filteredOrders.length > 0 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                        <span className="font-medium">
                          {indexOfLastOrder > filteredOrders.length ? filteredOrders.length : indexOfLastOrder}
                        </span>{" "}
                        of <span className="font-medium">{filteredOrders.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => paginate(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        
                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === number
                                ? 'z-10 bg-orange text-white border-orange'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                            currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                  
                  {/* Mobile pagination */}
                  <div className="flex sm:hidden w-full justify-between items-center">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-500">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                        currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
         
       )
      }
   </Layout>
    )
   
}

