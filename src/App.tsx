import { useState } from 'react';
import { type ContactIntent, type OpenContact } from './data/content';
import { Route, Routes, useLocation } from 'react-router-dom';
import PilotHeader from './components/PilotHeader';
import { ContactDialog, Footer, ScrollAndTitle } from './components/Layout';
import Home from './pages/Home';
import { About, Contacts, Customers, Furniture, NotFound, ProjectDetail, Projects, PromotionDetail, Promotions } from './pages/Sections';
import { Kitchens, ModelDetail } from './pages/Kitchens';
import Materials from './pages/Materials';
import PilotCustomers from './pages/PilotCustomers';
import AboutCompact from './pages/AboutCompact';
import QuickContact from './components/QuickContact';

export default function App() {
  const location = useLocation();
  const compactAbout = location.pathname === '/about';
  const planePage = !compactAbout && new URLSearchParams(location.search).get('design') === 'planes'
    ? location.pathname === '/' ? 'home' : location.pathname === '/customers/pocket' ? 'customers' : location.pathname === '/about' ? 'about' : undefined
    : undefined;
  const [contactIntent, setContactIntent] = useState<ContactIntent | null>(null);
  const onContact: OpenContact = (intent = { kind: 'request' }) => setContactIntent(intent);
  return <div className={`pilot-shell journal-shell${planePage ? ' interior-plane-study' : ''}`} data-plane-page={planePage}><ScrollAndTitle /><PilotHeader onContact={onContact} /><main id="main" tabIndex={-1}><Routes>
    <Route path="/" element={<Home onContact={onContact} />} />
    <Route path="/kitchens" element={<Kitchens onContact={onContact} />} />
    <Route path="/kitchens/models/:id" element={<ModelDetail onContact={onContact} />} />
    <Route path="/furniture" element={<Furniture onContact={onContact} />} />
    <Route path="/materials" element={<Materials onContact={onContact} />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:id" element={<ProjectDetail onContact={onContact} />} />
    <Route path="/customers" element={<PilotCustomers pocket onContact={onContact} />} />
    <Route path="/customers/pocket" element={<PilotCustomers pocket onContact={onContact} />} />
    <Route path="/promotions" element={<Promotions />} />
    <Route path="/promotions/:id" element={<PromotionDetail />} />
    <Route path="/about" element={compactAbout ? <AboutCompact onContact={onContact} /> : <About />} />
    <Route path="/contacts" element={<Contacts onContact={onContact} />} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><Footer /><QuickContact /><ContactDialog intent={contactIntent} onContact={onContact} onClose={() => setContactIntent(null)} /></div>;
}
