import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Menu from './components/Menu';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Stats from './components/Stats';
import Reservation from './components/Reservation';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans selection:bg-brand-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Menu />
        <Testimonials />
        <Gallery />
        <Stats />
        <Reservation />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
