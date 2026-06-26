import About from '../sections/About'
import Certificates from '../sections/Certificates'
import Contact from '../sections/Contact'
import Footer from '../sections/Footer'
import Hero from '../sections/Hero'
import HeroAboutMarquee from '../components/hero/HeroAboutMarquee'
import Experience from '../sections/Experience'
import Projects from '../sections/Projects'
import Skills from '../sections/Skills'

export default function Home() {
  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-clip bg-cyber-black">
      <div className="pointer-events-none fixed inset-0 cyber-grid-bg opacity-40" aria-hidden />
      <main className="overflow-x-clip">
        <Hero />
        <HeroAboutMarquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
