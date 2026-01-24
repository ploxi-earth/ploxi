// src/app/tools/ghg-calculator/page.jsx
import GHGCalculatorPage from '@/components/calculator/GHGCalculatorPage';

export const metadata = {
  title: 'Ploxi Earth - Comprehensive Sustainability Tools | GHG Calculator',
  description: 'Calculate your organization\'s greenhouse gas emissions across Scope 1, 2, and 3. Free carbon footprint calculator with India-specific emission factors.',
};

export default function GHGCalculatorRoute() {
  return <GHGCalculatorPage />;
}
