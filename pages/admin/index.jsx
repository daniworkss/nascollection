import { useState,useEffect } from "react"
import Header from "@/components/user/header"
import { Eye,EyeOff } from "lucide-react"
import { BeatLoader } from "react-spinners"
import { useRouter } from "next/router"
export default function Login(){
const [showPassword,setShowPassword] = useState(false)
const [loading,setLoading]= useState(false)
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [errorText, setErrorText] = useState('')
const [checking,setChecking] = useState(true)
const router = useRouter()
const key = 'greatness'
const mail= 'testmail@gmail.com'
useEffect(()=>{
    const checkstate = localStorage.getItem('loggedIn')
    if (checkstate == 'true'){
        router.push('/admin/dashboard/home')
    }else{
        setChecking(false)
    }
},[])
async function SignIn(){
    if(email === '' || password === ''){
        setErrorText('Please enter email and password')
    }else{
        setErrorText('')
        setLoading(true)
        try {
           if (email != mail && password != key ){ // if they get their email or password wrong.
            setErrorText('incorrect email or password')
            setLoading(false)
           }else{
             const loginState = localStorage.setItem('loggedIn', 'true')
             setTimeout(() => {
                setLoading(false) 
            }, 3000);
            router.push('/admin/dashboard/home')
           }
            
        } catch (error) {
            setLoading(false)
            setErrorText('Something went wrong please try again')
            console.log(error.message,'it failed')
        }
    }
}
  return (
    <div className={`bg-white pb-[40px] ${checking == true ? 'hidden':'block'}`}>
       <Header />
        <div className="pt-[7rem] px-[24px] md:w-[60%] md:mx-auto lg:w-[40%] lg:mx-auto ">
              <h1 className=" text-[26px] text-center font-optima-medium lg:text-[32px]" >LOG INTO YOUR STORE ACCOUNT</h1>

              <div className="space-y-1 mt-4 ">
                <p className="text-red-500 text-center mb-2 text-[14px]">{errorText}</p>
                        <p className="text-[14px] font-optima-medium text-blue">EMAIL</p>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full h-[50px] placeholder:text-gray-500 outline-0 border border-gray-300 text-[16px] rounded-[5px] pl-3 focus:border-orange-500"
                            placeholder="Email Address"
                            required
                        />

               </div>
        {/* password */}
               <div className="relative w-full space-y-1 mt-6">
                        <p className="text-[14px] font-optima-medium text-blue">PASSWORD</p>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full h-[50px] placeholder:text-gray-500 outline-0 border border-gray-300 text-[16px] rounded-[5px] pl-3 pr-10 focus:border-orange-500"
                            placeholder="Password"
                            required
                        />

                        <div
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-[3rem] -translate-y-1/2 text-sm text-gray-600 focus:outline-none cursor-pointer"
                        >
                            {!showPassword ? <Eye size={18} className="text-gray-600"/> : <EyeOff size={18} className="text-gray-600"/>}
                        </div>


                 </div>

                  {/* login button */}
                 <div className="flex items-center flex-col gap-2 mt-[20px]">
                    <button onClick={SignIn} className="w-[80%] h-[50px] cursor-pointer text-[14px] font-optima-bold rounded-[7px] hover:bg-gray-500 transition-all duration-200  bg-orange-600 text-white">
                       {
                        loading === true ? <BeatLoader color="white" size={14} /> : 'LOGIN'
                       }
                       
                    </button>
                 </div>
        </div>

        
      
    </div>
  )
};
