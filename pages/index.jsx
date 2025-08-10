import Header from "@/components/user/header"
import Herosection from "@/components/user/hero-section"
import { useEffect } from "react"
import Content from "@/components/user/content"
export default function Index(){
  
  return (
    <div>
      <Header/>
      <Herosection/>
      <div className="bg-red-500 w-full h-[35px]"></div>
      <Content/>
    </div>
  )
};
