import Link from "next/link"
import { ArrowRight , ShoppingCart} from "lucide-react"
import Image from "next/image"
export default function Herosection(){
  return (
    <div className=" relative h-[400px] mt-[4.2rem] w-full bg-black pt-[6rem] flex flex-col items-center ">
       {/* image  */}
       <Image
            src="https://res.cloudinary.com/dccph2plo/image/upload/v1754428286/portrait-happy-woman-holding-her-shopping-bags_1_swyetz.jpg"
            alt="Hero Background"
            fill
            style={{ objectFit: 'cover', zIndex: 0, objectPosition:'center' }}
            priority
        />
        <h1 className="text-white z-10  font-anton capitalize text-[42px] text-center">Elevate your <span className="text-orange-600">Style</span> </h1>
        <p className="text-white  z-10 font-satoshi text-[13px] text-center w-[80%] capitalize  mx-auto">Discover our stunning collection of premium wigs, elegant dresses, luxury bags, and exquisite accessories</p>

        <Link className=" z-10 animate-bounce bg-orange-600 mt-[1.5rem] text-[14px] px-6 py-2 rounded-lg text-white font-helvetica-bold" href={'/'}>
            Shop Categories Now
            <ArrowRight className="inline-block ml-1 -mt-1 text-white" size={16} />
        </Link>
    </div>
  )
};
