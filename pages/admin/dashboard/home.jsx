import Layout from "@/components/admin/layout"
import { Card } from "@/components/admin/card" 
import axios from "axios"
import { useEffect, useState } from "react"
import useStoreDetails from "@/context/store"
import Loader from "@/components/animation/loader"
import Link from "next/link"
import StatCard from "@/components/admin/stat-card"
import QuickActionCard from "@/components/admin/quick-action-card"
import { useRouter } from "next/router"
import { 
  PackageCheck, 
  ShoppingCart, 
  BanknoteArrowDown,
  Clock, 
  ChevronRight,
  Banknote
} from "lucide-react"

export default function SellerDashboardHome() {
const {products,setProducts, storeData, setStoreData} = useStoreDetails()
  const [loading,setLoading]= useState(true)
  const [LoadingError,setLoadingError] = useState(false)
 // fetch from DB
  const router = useRouter()
  
  async function fetchData (){
   try {
      const res = await axios.get('/api/fetchData')
      setStoreData(res.data.storeData)
       setProducts (res.data.products)
      setLoading(false)
   } catch (error) {
    console.log(error.message)
    setLoading(false)
     setLoadingError(true)
   }
  }

  useEffect( ()=>{
    // first check if user is logged in
    const checkstate = localStorage.getItem('loggedIn')
    if (checkstate == null){
       router.push('/admin')
    }
      setTimeout(() => {
        fetchData()
      }, 2000);
  },[])

if(LoadingError == true ){
  return(
    <div className="flex justify-between min-h-screen items-center">
            <p className="text-gray-500 text-center -mt-[4rem] w-full">Something went wrong please refresh.</p>
        </div>
  )
}


const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning "
  if (hour < 17) return "Good Afternoon "
  return "Good Evening"
}

  return (
   <div>
      {
        loading === true ? (<Loader/>) 
        : 
      (
        
        <Layout>
        <div className="p-6 lg:p-8 space-y-8 pt-20 lg:pt-6 max-w-7xl mx-auto ">
          {/* Welcome Section with Time-based Greeting */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-3xl font-helvetica-nue text-gray-800">
                {getGreeting()}, Greatness 👋
              </h2>
              <p className="text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Link href={'/admin/dashboard/add-product'} className="orange-gradient-btn hover:bg-gray-700 text-white px-4 cursor-pointer py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                <span>Add New Product</span>
                <PackageCheck className="h-4 w-4" />
              </Link>
            </div>
          </div>
     
          
          {/* Stats grid with visual improvements */}
          <div className="relative">
            <h3 className="text-xl font-optima-medium mb-4 text-gray-800">Performance Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard 
                title="Orders" 
                icon={<ShoppingCart className="text-orange" />} 
                value={storeData.orders.length } 
                // trend="+12%" 
                // trendUp={true}
              />
               <StatCard 
                title="Balance" 
                icon={<Banknote className="text-green-600" />} 
                value={`$${storeData.balance.toLocaleString()}` || '₦0'} 
                // trend="+2"
                // trendUp={true} 
              />
              <StatCard 
                title="Products" 
                icon={<PackageCheck className="text-green-600" />} 
                value={products.length  || 0} 
                // trend="+2"
                // trendUp={true} 
              />
              <StatCard 
                title="Earnings" 
                icon={<BanknoteArrowDown className="text-amber-600" />} 
                value={`$${ storeData.totalRevenue.toLocaleString()}`} 
                // trend="+8%" 
                // trendUp={true}
              />
         
            </div>
          </div>
          
          {/* Recent Orders section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl  text-gray-800 font-optima-medium">Recent Orders</h3>
              <Link href="/admin/dashboard/orders" className="text-orange-600 hover:text-gray-800 flex items-center text-sm font-semibold">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <Card className="rounded-xl border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-left">
                      <th className="p-4 font-satoshi-regular">Order ID</th>
                      <th className="p-4 font-satoshi-regular">Customer</th>
                      <th className="p-4 font-satoshi-regular">Date</th>
                      <th className="p-4 font-satoshi-regular">Price</th>
                      <th className="p-4 font-satoshi-regular">Quantity</th>
                      <th className="p-4 font-satoshi-regular">Total</th>
                      <th className="p-4 font-satoshi-regular">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    { storeData.orders.length > 0 &&
                    // sorting orders by date and limiting to 7 for better UI
                      storeData.orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) // sorting for date
                    .slice(0,7) // get just 7 items for  better ui
                    .map((order,i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-orange">{order.orderId}</td>
                        <td className="p-4 capitalize">{order.username}</td>
                        <td className="p-4 text-gray-500"><Clock className="h-3 w-3 inline mr-1" />{new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                        <td className="p-4 font-medium">₦{order.price}</td>
                        <td className="p-4 font-medium">{order.quantity}</td>
                        <td className="p-4 font-medium">₦{order.orderTotal}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 mb-12">
            <h3 className="text-xl font-optima-medium mb-4 text-gray-800">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickActionCard 
                title="Manage Inventory" 
                description="Update your products and stock levels" 
                icon={<PackageCheck className="h-5 w-5 text-orange" />}
                link="/admin/dashboard/products"
              />
              {/* <QuickActionCard 
                title="View Analytics" 
                description="See detailed statistics about your store" 
                icon={<TrendingUp className="h-5 w-5 text-green-600" />}
                link="/sellers/dashboard/analytics"
              /> */}
              {/* <QuickActionCard 
                title="Process Orders" 
                description="Manage pending and recent orders" 
                icon={<ShoppingCart className="h-5 w-5 text-amber-600" />}
                link="/sellers/dashboard/orders"
              /> */}
            </div>
          </div>
        </div>
      </Layout>
          
      )
      }
   </div>
  )
}

