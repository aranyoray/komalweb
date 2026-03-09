import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

// Escape HTML special characters to prevent injection
const escapeHtml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Strip ALL line-break characters (including unicode) to prevent email header injection
const sanitizeSubject = (str: string): string =>
  str.replace(/[\r\n\u000b\u000c\u0085\u2028\u2029]/g, '');

// Generate HTML email template for demo request
const generateDemoRequestHTML = (name: string, email: string, organization?: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Demo Request - KomalAI Digital Guardian</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a5f 0%, #6b4e71 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">KomalAI</h1>
      <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">New Demo Request</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="background: #22c55e15; border: 2px solid #22c55e40; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0; color: #22c55e; font-weight: 600; font-size: 16px;">New Demo Request Received!</p>
      </div>

      <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #1e3a5f;">Contact Details</h2>

      <div style="background: #f5f5f7; border-radius: 12px; padding: 20px;">
        <div style="margin-bottom: 16px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
          <p style="margin: 0; font-size: 16px; color: #1e3a5f; font-weight: 600;">${name}</p>
        </div>

        <div style="margin-bottom: 16px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
          <p style="margin: 0; font-size: 16px; color: #1e3a5f;">
            <a href="mailto:${email}" style="color: #6b4e71; text-decoration: none;">${email}</a>
          </p>
        </div>

        ${organization ? `
        <div>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Organization</p>
          <p style="margin: 0; font-size: 16px; color: #1e3a5f; font-weight: 500;">${organization}</p>
        </div>
        ` : `
        <div>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Organization</p>
          <p style="margin: 0; font-size: 14px; color: #999; font-style: italic;">Not provided</p>
        </div>
        `}
      </div>

      <div style="margin-top: 24px; padding: 16px; background: #6b4e7110; border-radius: 12px;">
        <p style="margin: 0; font-size: 14px; color: #666;">
          <strong style="color: #1e3a5f;">Source:</strong> URL Safety Demo Page
        </p>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #999;">
          Request received on ${new Date().toLocaleString()}
        </p>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #6b4e71 100%); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Reply to ${name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px;">
      <p style="margin: 0; font-size: 12px; color: #999;">
        This is an automated notification from the Komal URL / keyword Safety Demo
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Generate confirmation email for the user
const generateConfirmationHTML = (name: string): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demo Request Confirmed - KomalAI Digital Guardian</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a5f 0%, #6b4e71 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">KOMAL</h1>
      <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Digital Guardian for Kids</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h2 style="margin: 0 0 16px 0; font-size: 24px; color: #1e3a5f;">Hi ${name}!</h2>

      <p style="margin: 0 0 16px 0; font-size: 16px; color: #444; line-height: 1.6;">
        Thank you for your interest in KOMAL! We've received your demo request and our team will be in touch with you shortly.
      </p>

      <div style="background: #22c55e15; border: 2px solid #22c55e40; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0; color: #22c55e; font-weight: 600; font-size: 16px; text-align: center;">
          Your demo request has been confirmed!
        </p>
      </div>

      <p style="margin: 0 0 16px 0; font-size: 14px; color: #666; line-height: 1.6;">
        In the meantime, here's what KOMAL can do for you:
      </p>

      <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #444; line-height: 1.8;">
        <li>AI-powered content safety analysis</li>
        <li>Age-appropriate content filtering</li>
        <li>Real-time behavioral insights</li>
        <li>Privacy-first design</li>
        <li>Parent-controlled access</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://komalkids.com" style="display: inline-block; background: linear-gradient(135deg, #1e3a5f 0%, #6b4e71 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Learn More About KOMAL
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
        Questions? Reach out to us at
        <a href="mailto:play@komalkids.com" style="color: #6b4e71; text-decoration: none;">play@komalkids.com</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #999;">
        <a href="https://komalkids.com" style="color: #6b4e71; text-decoration: none;">komalkids.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 demo requests per minute per IP
    const ip = getClientIp(request.headers);
    if (isRateLimited(`book-demo:${ip}`, 3, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { name, email, organization } = body;

    if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Input length limits to prevent abuse
    if (name.length > 200 || email.length > 254 || (organization && String(organization).length > 300)) {
      return NextResponse.json(
        { error: 'Input too long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const port = parseInt(process.env.SMTP_PORT || '587');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.titan.email',
      port: port,
      secure: port === 465,
      auth: {
        type: 'login',
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2',
      },
      requireTLS: true,
    } as nodemailer.TransportOptions);

    // Escape user inputs for HTML embedding
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeOrg = organization ? escapeHtml(organization) : undefined;

    // Send notification to sales team
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"KomalAI Demo" <noreply@komalkids.com>',
      to: 'play@komalkids.com',
      subject: sanitizeSubject(`New Demo Request from ${safeName}${safeOrg ? ` (${safeOrg})` : ''}`),
      html: generateDemoRequestHTML(safeName, safeEmail, safeOrg),
      replyTo: email,
    });

    // Send confirmation to the user
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"KOMAL" <noreply@komalkids.com>',
      to: email,
      subject: 'Demo Request Confirmed - KOMAL',
      html: generateConfirmationHTML(safeName),
    });

    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully! Check your email for confirmation.'
    });
  } catch (error) {
    console.error('Error processing demo request:', error);
    return NextResponse.json(
      { error: 'Failed to submit demo request. Please try again.' },
      { status: 500 }
    );
  }
}
