import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * GSAP + ScrollTrigger live here so plugins register once.
 * Motion (`motion/react`) is used separately for UI enter/hover/parallax —
 * do not import `framer-motion`; it is the same library under the old name.
 */
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
