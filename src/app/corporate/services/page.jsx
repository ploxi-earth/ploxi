// src/app/services/page.jsx
import ServicesProjectsPage from '@/components/pages/ServicesProjectsPage';

export const metadata = {
  title: 'Services & Projects Cart | Ploxi Sustainability Platform',
  description: 'Review and manage your selected sustainability services, compliance actions, and projects.',
};

export default function ServicesRoute() {
  return <ServicesProjectsPage />;
}
