import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ContactDialog, Footer, Header, ScrollAndTitle } from './components/Layout';
import Home from './pages/Home';
import { About, Contacts, Customers, Furniture, Kitchens, ModelDetail, NotFound, ProjectDetail, Projects, PromotionDetail, Promotions } from './pages/Sections';

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const onContact = () => setContactOpen(true);
  return <><ScrollAndTitle /><Header onContact={onContact} /><div className="review-notice"><div className="container">Предварительная версия сайта. Структура и наполнение находятся на согласовании</div></div><main id="main" tabIndex={-1}><Routes>
    <Route path="/" element={<Home onContact={onContact} />} />
    <Route path="/kitchens" element={<Kitchens />} />
    <Route path="/kitchens/models/:id" element={<ModelDetail onContact={onContact} />} />
    <Route path="/furniture" element={<Furniture onContact={onContact} />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:id" element={<ProjectDetail onContact={onContact} />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/promotions" element={<Promotions />} />
    <Route path="/promotions/:id" element={<PromotionDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/contacts" element={<Contacts onContact={onContact} />} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><Footer /><ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} /></>;
}
