import {motion} from 'framer-motion'
import { useInView } from 'react-intersection-observer'
export default function Slideup({children, className, delay,percent}){
  const [ref, inView] = useInView({triggerOnce:true})
  const slideVariants = {
    hidden: {opacity: 0 , y: percent},
    visible: {opacity: 1, y: 0, transition:{duration: 0.5, delay: delay}}
  }
  return (
    <motion.div ref={ref} className={`${className}`} initial='hidden' animate ={inView? 'visible': 'hidden'} variants={slideVariants}>
      {children}
    </motion.div>
  )
};
