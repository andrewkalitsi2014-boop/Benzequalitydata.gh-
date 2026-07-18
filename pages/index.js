import { useState } from 'react';
import BundleCard from '../components/BundleCard';
import PaystackCheckout from '../components/PaystackCheckout';

const Home = () => {
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const PHONE_NUMBER = '0599158167';
  const WHATSAPP_URL = `https://wa.me/233599158167`;

  // Custom bundles: 1, 2, 3, 4, 5, 7, 9, 10, 15, 18, 20, 30, 40, 50, 60, 70, 80, 90, 100 GB at GHS 4.90 per GB
  const bundleSizes = [1, 2, 3, 4, 5, 7, 9, 10, 15, 18, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  
  const bundles = bundleSizes.map((size, index) => ({
    id: index + 1,
    size: size,
    price: size * 4.90,
    name: `${size}GB Data Bundle`,
  }));

  const handleSelectBundle = (bundle) => {
    setSelectedBundle(bundle);
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
    setSelectedBundle(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Benzequalitydata.gh</h1>
            <p className="text-lg mt-2">Premium Data Bundles - MTN, Telecel & Tigo</p>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            💬 WhatsApp Support
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {showCheckout && selectedBundle ? (
          <PaystackCheckout
            bundle={selectedBundle}
            onClose={handleCloseCheckout}
            publicKey="pk_test_17ac3982d4f6f8de09e4cd423ff3f450b390ce6e"
          />
        ) : (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Data Bundles</h2>
              <p className="text-gray-600 mb-8">Choose your data bundle and get instant access code</p>
              <p className="text-lg font-semibold text-blue-600">💰 GHS 4.90 per GB</p>
            </div>

            {/* Bundles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bundles.map((bundle) => (
                <BundleCard
                  key={bundle.id}
                  bundle={bundle}
                  onSelect={handleSelectBundle}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Support Section */}
      <section className="bg-blue-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Need Help?</h2>
          <p className="text-gray-600 mb-6">Contact us for any issues or questions - Available 24/7</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              💬 WhatsApp: {PHONE_NUMBER}
            </a>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              📞 Call: {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Benzequalitydata.gh</h3>
              <p className="text-gray-400">Premium data bundles for MTN, Telecel & Tigo</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">📞 Contact Support</h3>
              <p className="text-gray-400 mb-2">Phone: {PHONE_NUMBER}</p>
              <p className="text-gray-400">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300">
                  💬 WhatsApp
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <p className="text-gray-400 mb-2">Available 24/7</p>
              <p className="text-gray-400">Quick response guaranteed</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Benzequalitydata.gh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
