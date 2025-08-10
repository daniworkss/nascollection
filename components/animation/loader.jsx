import { BeatLoader } from "react-spinners"
import Image from "next/image"
export default function Loader(){

  return (
    <div className="w-full fixed flex justify-center items-center min-h-screen flex-col top-0 ">
    <div className="-mt-[4rem] flex items-center flex-col gap-3">
     <h1 className="text-orange-600 font-poppins-bold mt-2">Na&apos;sCollections</h1>
    <BeatLoader color="#1f763b" size={16}/>
    </div>



</div>
  )
};
