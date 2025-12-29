// src/app/tools/ghg-calculator/layout.jsx
import Image from 'next/image';

export default function GHGCalculatorLayout({ children }) {
  return (
    <div>
      {/* Optional: Add logo header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Image
            src="/images/ploxi earth logo.jpeg"
            alt="Ploxi Earth"
            width={50}
            height={50}
            priority
          />
        </div>
      </header>
      {children}
    </div>
  );
}
