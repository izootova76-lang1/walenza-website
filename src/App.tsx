import { useState } from 'react';
import { type ContactIntent, type OpenContact } from './data/content';
import { Route, Routes } from 'react-router-dom';
import { ContactDialog, Footer, Header, ScrollAndTitle } from './components/Layout';
import Home from './pages/Home';
import { About, Contacts, Customers, Furniture, NotFound, ProjectDetail, Projects, PromotionDetail, Promotions } from './pages/Sections';
import { Kitchens, ModelDetail } from './pages/Kitchens';
import Materials from './pages/Materials';

export default function App() {
  const [contactIntent, setContactIntent] = useState<ContactIntent | null>(null);
  const onContact: OpenContact = (intent = { kind: 'request' }) => setContactIntent(intent);
  return <><ScrollAndTitle /><Header onContact={onContact} /><div className="review-notice"><div className="container">Предварительная версия сайта. Структура и наполнение находятся на согласовании</div></div><main id="main" tabIndex={-1}><Routes>
    <Route path="/" element={<Home onContact={onContact} />} />
    <Route path="/kitchens" element={<Kitchens />} />
    <Route path="/kitchens/models/:id" element={<ModelDetail onContact={onContact} />} />
    <Route path="/furniture" element={<Furniture onContact={onContact} />} />
    <Route path="/materials" element={<Materials onContact={onContact} />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:id" element={<ProjectDetail onContact={onContact} />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/promotions" element={<Promotions />} />
    <Route path="/promotions/:id" element={<PromotionDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/contacts" element={<Contacts onContact={onContact} />} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><Footer /><ContactDialog intent={contactIntent} onContact={onContact} onClose={() => setContactIntent(null)} /></>;
}
