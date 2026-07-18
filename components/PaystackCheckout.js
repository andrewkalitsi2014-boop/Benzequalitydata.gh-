import { useState } from 'react';

const PaystackCheckout = ({ bundle, onClose, publicKey }) => {
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const handlePaystackSuccess = async (response) => {
    setLoading(true);
    setError('');

    try {
      // Call our payment success API
      const result = await fetch('/api/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: response.reference,
          bundle,
          customerEmail,
          customerPhone,
        }),
      }).then((res) => res.json());

      if (result.success) {
        setAccessCode(result.accessCode);
        setSuccess(true);
      } else {
        setError(result.error || 'Failed to process payment');
      }
    } catch (err) {
      setError('Error processing payment: ' + err.message);
    }

    setLoading(false);
  };

  const handlePaymentClick = () => {
    if (!customerEmail || !customerPhone) {
      setError('Please enter email and phone number');
      return;
    }

    // Initialize Paystack
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: customerEmail,
      amount: bundle.price * 100, // Convert to cents
      ref: 'BZ' + Date.now(),
      onClose: () => {
        setError('Payment window closed');
      },
      onSuccess: handlePaystackSuccess,
    });

    handler.openIframe();
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your order has been processed.</p>

          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Permanent Access Code:</p>
            <p className="text-3xl font-bold text-blue-600 break-all">{accessCode}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left text-sm">
            <p className="font-semibold mb-2">📦 Order Details:</p>
            <p>Data: {bundle.size}GB Bundle</p>
            <p>Price: GHS {bundle.price}</p>
            <p>Validity: ♾️ Forever</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-left text-sm">
            <p className="font-semibold mb-2">📝 Next Steps:</p>
            <ol className="list-decimal ml-5">
              <li>Copy your access code above</li>
              <li>Go to DataMart Ghana</li>
              <li>Enter the code to download</li>
            </ol>
          </div>

          <p className="text-sm text-gray-600 mb-4">Access code sent via:</p>
          <div className="flex justify-center gap-2 mb-6">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs">📧 Email</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs">💬 SMS</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs">📱 WhatsApp</span>
          </div>

          <a
            href="https://share.google/39idfozhXJh9GrMYA"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold mb-4 inline-block"
          >
            📥 Go to DataMart Ghana
          </a>

          <p className="text-xs text-gray-500 mb-4">Questions? Contact: 0599158167</p>

          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="mb-6">
          <p className="text-gray-600 mb-2">Bundle:</p>
          <p className="text-xl font-bold">{bundle.size}GB Data</p>
          <p className="text-gray-600">GHS {bundle.price}</p>
          <p className="text-sm text-green-600 mt-2">♾️ Valid Forever</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Email Address</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Phone Number</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="0599158167"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6 bg-blue-50 p-4 rounded-lg text-sm">
          <p className="font-semibold mb-2">After Payment:</p>
          <ul className="list-disc ml-5 text-gray-600">
            <li>Get instant access code</li>
            <li>Receive via SMS, Email & WhatsApp</li>
            <li>Download from DataMart Ghana</li>
          </ul>
        </div>

        <button
          onClick={handlePaymentClick}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold mb-4"
        >
          {loading ? 'Processing...' : `Pay GHS ${bundle.price}`}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>

        <script src="https://js.paystack.co/v1/inline.js"></script>
      </div>
    </div>
  );
};

export default PaystackCheckout;
