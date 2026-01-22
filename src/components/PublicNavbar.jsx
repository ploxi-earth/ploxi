import Link from 'next/link';
import Image from 'next/image';

export default function PublicNavbar() {
    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Ploxi Logo */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-12 h-12 relative">
                            <Image
                                src="/images/ploxi earth logo.jpeg"
                                alt="Ploxi Earth Logo"
                                width={48}
                                height={48}
                                className="object-contain rounded-lg"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-black">
                                Ploxi Earth
                            </h1>
                            <p className="text-xs text-gray-500">Sustainability Platform</p>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/vendors"
                            className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                        >
                            All Vendors
                        </Link>
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/contact"
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
                        >
                            Contact Us
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
