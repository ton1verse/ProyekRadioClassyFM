import Navbar from '@/components/frontend/Navbar';
import Footer from '@/components/frontend/Footer';

export default function FrontendLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <section className="w-full bg-white py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <img
                        src="/images/ads_semen.jpg"
                        alt="Advertisement"
                        className="w-full h-auto shadow-lg object-cover max-h-[250px]"
                    />
                </div>
            </section>
            <Footer />
        </div>
    );
}
