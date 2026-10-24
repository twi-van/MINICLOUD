import { motion, useScroll, useSpring } from 'motion/react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 35 })
  return <motion.div aria-hidden="true" className="scroll-progress" style={{ scaleX }} />
}
