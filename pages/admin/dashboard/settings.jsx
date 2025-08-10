import Layout from "@/components/seller/layout"
import { Card, CardContent } from "@/components/card" 
import { useState, useEffect } from "react"
import useFormStore from "@/context/formstate"
import axios from "axios"
import { 
  User, 
  Shield,
  CreditCard,
  Settings as SettingsIcon
} from "lucide-react"

import AccountTab from "@/components/seller/settings/accounts"
import SecurityTab from "@/components/seller/settings/security"
import PaymentTab from "@/components/seller/settings/payment"

export default function Settings() {
  // Get store data from Zustand
  const { firstName, lastName, storeName, email, phone, description,bankDetails,setBankDetails, setFirstName, setLastName, setStoreName, setEmail, setPhone, setDescription,setAutoRenewal,autoRenewal } = useFormStore()
  
  const [loading, setLoading] = useState(false)
  const [loadingError, setLoadingError] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  const [plan,setPlan] = useState({})

  async function fetchData (){
    try {
     const userid = localStorage.getItem('sellerId')
     if (userid){
       const res = await axios.post('/api/fetchsellerdata',{id:userid})
       const data = res.data.sellerData
       console.log(data, 'ths is is the data')
       setStoreName(data.storeName || '')
       setDescription(data.description|| '')
       setEmail(data.email|| '')
       setFirstName(data.firstName|| '')
       setLastName(data.lastName || '')
       setPhone(data.phone)
       setBankDetails(data.bankDetails || {})
       setAutoRenewal(data.subscriptionDetails.autoRenew || false) // Set auto-renewal status 
       setPlan(data.subscriptionDetails.plan || {}) // Set plan details
 
     }
     setLoading(false)
    } catch (error) {
     console.log(error.message)
     setLoading(false)
      setLoadingError(true)
    }
   }
 
  useEffect(()=>{
    // to check login  state first and formosst
    const checkstate = localStorage.getItem('sellerisloggedIn')
    if (checkstate == null){
      router.push('/sellers')
   } else {
    // if the user is logged in, we will check if they have products in the state manager
    if (firstName !== ''){ //to check if the seller has products in the state manager
      return // if there are products in the state manager, we will not use the api
    }else{
      // if there are no products in the state manager, we will use the api to fetch products
      fetchData()
    }
  
   }
  },[])


  // Setting menu items
  const settingsTabs = [
    { id: "account", label: "Account Information", icon: <User className="h-5 w-5" /> },
    { id: "security", label: "Security", icon: <Shield className="h-5 w-5" /> },
    { id: "payment", label: "Payment & Withdrawals", icon: <CreditCard className="h-5 w-5" /> },
  ]

  // Render the appropriate tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "account": 
        return (
          <AccountTab 
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            storeName={storeName}
            description={description}
          
          />
        );
      case "security": 
        return (
          <SecurityTab />
        );
      case "payment": 
        return (
          <PaymentTab
          bankDetails={bankDetails} 
          autoRenewal={autoRenewal}
          setAutoRenewal={setAutoRenewal}
          plan={plan}
          email={email}
          />
        );
     
      
      default: 
        return (
          <AccountTab 
            firstName={firstName}
            lastName={lastName}
            email={email}
            phone={phone}
            storeName={storeName}
            description={description}
           
          />
        );
    }
  }
  
  return (
    <Layout>
      <div className="p-6 lg:p-8 space-y-8 pt-20 lg:pt-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
            <p className="text-gray-500 mt-1">Manage your account and preferences</p>
          </div>
        </div>
        
        {/* Mobile Tab Navigation */}
        <div className="block lg:hidden mb-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
            <div className="flex">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-b-2 border-orange text-orange font-medium"
                      : "text-gray-700"
                  }`}
                >
                  <span className="mr-1">
                    {tab.icon}
                  </span>
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="h-fit sticky top-24 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-orange text-white font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className={`mr-3 ${activeTab === tab.id ? "text-white" : "text-orange"}`}>
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Content Area */}
          <Card className="col-span-1 lg:col-span-3 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <CardContent className="p-4 md:p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}