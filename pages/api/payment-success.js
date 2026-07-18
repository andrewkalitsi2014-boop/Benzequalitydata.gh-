import crypto from 'crypto';

// Generate permanent access code
const generateAccessCode = () => {
  return crypto.randomBytes(8).toString('hex').toUpperCase();
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { reference, bundle, customerEmail } = req.body;

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

    // Prepare email message
    const bundleName = `${bundle.size}GB Data Bundle`;
    const bundlePrice = `GHS ${bundle.price}`;

    const emailMessage = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <h1 style="color: #2563eb; text-align: center;">✅ Payment Successful!</h1>
            <p style="color: #666; font-size: 16px;">Thank you for your purchase at <strong>Benzequalitydata.gh</strong>!</p>
            
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
              <p style="color: #666; margin: 0 0 10px 0;"><strong>Your Permanent Access Code:</strong></p>
              <p style="color: #2563eb; font-size: 32px; font-weight: bold; margin: 10px 0; word-break: break-all;">${accessCode}</p>
            </div>

            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2563eb; margin-top: 0;">📦 Order Details:</h3>
              <p style="color: #666; margin: 8px 0;"><strong>Data Bundle:</strong> ${bundleName}</p>
              <p style="color: #666; margin: 8px 0;"><strong>Price:</strong> ${bundlePrice}</p>
              <p style="color: #666; margin: 8px 0;"><strong>Validity:</strong> ♾️ Forever (Permanent)</p>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin-top: 0;">📝 How to Download:</h3>
              <ol style="color: #666; margin: 10px 0;">
                <li>Copy your access code above</li>
                <li><a href="https://share.google/39idfozhXJh9GrMYA" style="color: #2563eb; text-decoration: none;"><strong>Go to DataMart Ghana</strong></a></li>
                <li>Enter your access code</li>
                <li>Download your data immediately</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://share.google/39idfozhXJh9GrMYA" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">📥 Go to DataMart Ghana</a>
            </div>

            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #999; font-size: 14px; margin: 5px 0;"><strong>Need Help?</strong></p>
              <p style="color: #999; font-size: 14px; margin: 5px 0;">📞 Phone: 0599158167</p>
              <p style="color: #999; font-size: 14px; margin: 5px 0;">💬 WhatsApp: 0599158167</p>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © 2024 Benzequalitydata.gh. All rights reserved.<br>
              This is an automated email. Please do not reply.
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email
    const emailSent = await sendEmail(customerEmail, '✅ Your Access Code - Benzequalitydata.gh', emailMessage);

    if (!emailSent) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({
      success: true,
      accessCode,
      message: 'Access code sent to your email!',
      datamart: 'https://share.google/39idfozhXJh9GrMYA',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
