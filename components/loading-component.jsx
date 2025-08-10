import {BeatLoader} from 'react-spinners'


export default function LoadingComponent(){
  return (
    <div className=' absolute top-0 w-full h-[92vh]'>
        <div className='absolute z-10 w-full h-[92vh]'>
            <div className='flex items-center justify-center h-screen'>
                <BeatLoader color="#c5237a" size={20} />
            </div>
        </div>
       <div className=' bg-black w-full h-screen opacity-[30%] fixed'>

       </div>
    </div>
  )
};
