import { createRoot } from 'react-dom/client';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DoctorsPage from './pages/DoctorsPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import ServiceCategoryPage from './pages/ServiceCategoryPage';
import TreatmentDetailPage from './pages/TreatmentDetailPage';
import './site.css';
import './integrations.css';

const pages = {
  '/': HomePage,
  '/about': AboutPage,
  '/doctors': DoctorsPage,
  '/services': ServicesPage,
  '/gallery': GalleryPage,
  '/contact': ContactPage,
  '/booking': BookingPage,
};

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const isCategoryPage = path.startsWith('/services/');
  const isTreatmentPage = path.startsWith('/treatments/');
  const Page = isCategoryPage ? ServiceCategoryPage : isTreatmentPage ? TreatmentDetailPage : pages[path] || HomePage;
  return <Page/>;
}

createRoot(document.getElementById('root')).render(<App/>);
