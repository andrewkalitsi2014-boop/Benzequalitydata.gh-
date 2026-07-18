import crypto from 'crypto';

// Generate permanent access code
const generateAccessCode = () => {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
};

// Send SMS via Twilio
const sendSMS = async (phoneNumber, message) => {
  try {
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + process.env.TWILIO_ACCOUNT_SID + '/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.TWILIO_ACCOUNT_SID + ':' + process.env.TWILIO_AUTH_TOKEN).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: process.env.TWILIO_PHONE_NUMBER,
        To: phoneNumber,
        Body: message,
      }).toString(),
    });
    return response.ok;
  } catch (error) {
    console.error('SMS Error:', error);
    return false;
  }
};

// Send Email via SendGrid
const sendEmail = async (email, subject, message) => {
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.SENDGRID_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: 'support@benzequalitydata.gh' },
        subject,
        content: [{ type: 'text/html', value: message }],
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('Email Error:', error);
    return false;
  }
};

// Send WhatsApp message
const sendWhatsApp = async (phoneNumber, message) => {
  try {
    const response = await fetch(`https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.WHATSAPP_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message },
      }),
    });
    return response.ok;
  } catch (error) {
    console.error('WhatsApp Error:', error);
    return false;
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reference, bundle, customerEmail, customerPhone } = req.body;

    // Verify payment with Paystack
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Generate permanent access code
    const accessCode = generateAccessCode();

    // Prepare messages
    const bundleName = `${bundle.size}GB Data Bundle`;
    const bundlePrice = `GHS ${bundle.price}`;

    const accessCodeMessage = `Your permanent access code: ${accessCode}\nData: ${bundleName}\nPrice: ${bundlePrice}\n\nVisit: https://share.google/39idfozhXJh9GrMYA\nEnter code to download!`;

    const emailMessage = `
      <h2>✅ Payment Successful!</h2>
      <p>Thank you for your purchase!</p>
      <h3>Your Access Code: <strong>${accessCode}</strong></h3>
      <p><strong>Data:</strong> ${bundleName}</p>
      <p><strong>Price:</strong> ${bundlePrice}</p>
      <p><strong>Validity:</strong> Forever (Permanent)</p>
      <hr>
      <p>Visit DataMart Ghana: <a href="https://share.google/39idfozhXJh9GrMYA">https://share.google/39idfozhXJh9GrMYA</a></p>
      <p>Enter your access code to download!</p>
      <p>Questions? Contact us: 0599158167</p>
    `;

    // Send notifications
    await sendSMS(customerPhone, accessCodeMessage);
    await sendEmail(customerEmail, '✅ Your Access Code - Benzequalitydata.gh', emailMessage);
    await sendWhatsApp('233599158167', `New order!\nCustomer: ${customerEmail}\nData: ${bundleName}\nCode: ${accessCode}`);

    // Save to database (optional)
    // await saveAccessCode({ accessCode, bundle, customerEmail, customerPhone, createdAt: new Date() });

    return res.status(200).json({
      success: true,
      accessCode,
      message: 'Access code sent via SMS, Email, and WhatsApp!',
      datamart: 'https://share.google/39idfozhXJh9GrMYA',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
