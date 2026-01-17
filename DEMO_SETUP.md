# URL Safety Demo Setup Guide

This document explains how to set up and configure the URL Safety Demo page with live content analysis using Google Cloud Platform APIs.

## Table of Contents

- [Overview](#overview)
- [Required Environment Variables](#required-environment-variables)
- [Google Cloud Platform Setup](#google-cloud-platform-setup)
- [Installation](#installation)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Fallback Mode](#fallback-mode)

## Overview

The URL Safety Demo (`/demo`) provides real-time content safety analysis for any URL using:

- **Google Cloud Vision API**: Image and screenshot analysis
- **Google Cloud Natural Language API**: Text sentiment and entity analysis
- **Puppeteer**: Webpage screenshot capture
- **Cheerio**: HTML parsing and metadata extraction

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Option 1: API Key Authentication (Easiest)

```bash
GOOGLE_CLOUD_API_KEY=your-google-cloud-api-key-here
```

### Option 2: Service Account Authentication (Production)

```bash
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
```

### Email Configuration (For Reports & Demo Requests)

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="KOMAL" <noreply@komalkids.com>
```

### Environment Variable Details

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_CLOUD_API_KEY` | No* | API key for Google Cloud services |
| `GOOGLE_APPLICATION_CREDENTIALS` | No* | Path to service account JSON file |
| `GOOGLE_CLOUD_PROJECT_ID` | No | Your Google Cloud project ID |
| `SMTP_HOST` | No** | SMTP server hostname |
| `SMTP_PORT` | No** | SMTP server port (587 or 465) |
| `SMTP_SECURE` | No** | Set to "true" for SSL (port 465) |
| `SMTP_USER` | No** | SMTP authentication username |
| `SMTP_PASS` | No** | SMTP authentication password |
| `SMTP_FROM` | No** | From address for sent emails |

\* **At least one** authentication method (API Key or Service Account) is required for live analysis. If neither is provided, the system runs in **demo mode** with pattern-based analysis.

\*\* SMTP configuration is required for email features (Send Report, Book Demo). PDF export works without SMTP.

## Google Cloud Platform Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your **Project ID**

### Step 2: Enable Required APIs

Enable the following APIs in your project:

1. **Cloud Vision API**
   - Go to: https://console.cloud.google.com/apis/library/vision.googleapis.com
   - Click "Enable"

2. **Cloud Natural Language API**
   - Go to: https://console.cloud.google.com/apis/library/language.googleapis.com
   - Click "Enable"

### Step 3: Create Credentials

#### For API Key (Testing/Development):

1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. (Optional) Restrict the key to Vision API and Natural Language API
5. Add to `.env.local`:
   ```bash
   GOOGLE_CLOUD_API_KEY=AIza...your-key-here
   ```

#### For Service Account (Production):

1. Go to [Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
2. Click "Create Service Account"
3. Grant roles:
   - Cloud Vision AI Service Agent
   - Cloud Natural Language Service Agent
4. Create a JSON key
5. Download the key file
6. Add to `.env.local`:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

### Step 4: Set Up Billing

⚠️ **Important**: Google Cloud Vision API and Natural Language API require billing to be enabled.

- Vision API: ~$1.50 per 1,000 images
- Natural Language API: ~$1.00 per 1,000 text records

See [Google Cloud Pricing](https://cloud.google.com/pricing) for details.

## Installation

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

The following packages are required:

- `@google-cloud/vision` - Google Cloud Vision API client
- `@google-cloud/language` - Google Cloud Natural Language API client
- `cheerio` - HTML parsing
- `puppeteer` - Headless browser for screenshots

### 2. Configure Environment Variables

Copy the example file and add your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Google Cloud credentials.

### 3. Run the Application

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3001/demo` to test the URL scanner.

## Features

### Live Content Analysis

When Google Cloud APIs are configured, the system performs:

1. **Webpage Fetching**
   - Fetches actual HTML content from the URL
   - 10-second timeout for responsiveness

2. **HTML Parsing & Metadata Extraction**
   - Page title, description, keywords
   - Image and link counts
   - Main text content extraction
   - Image URL collection

3. **Screenshot Capture**
   - Full-page screenshot using Puppeteer
   - 1280x720 viewport
   - 15-second timeout

4. **Natural Language Processing (NLP)**
   - Sentiment analysis
   - Entity extraction (people, places, organizations)
   - Content classification/categorization

5. **Vision AI Analysis**
   - Screenshot label detection
   - Safe search detection (adult, violence, racy content)
   - Object localization
   - Analysis of page images (up to 3)

6. **Content Safety Categorization**
   - Violence detection (graphic/non-graphic)
   - Horror/scary content
   - Crime-related content
   - Explicit/adult content
   - Language/profanity detection
   - Substance use detection
   - Educational content identification

7. **Age-Appropriate Recommendations**
   - 4 age groups: <10, 10-13, 13-18, 18+
   - Actions: BLOCK, GATE, ALLOW
   - Individual scores and reasoning for each group

### Export & Sharing Features

1. **Export PDF**
   - Generate PDF reports with full analysis results
   - Uses html2canvas and jsPDF for client-side PDF generation
   - KOMAL branded report with safety scores, age actions, and analysis summary

2. **Send via Email**
   - Email safety reports directly from the demo page
   - Beautiful HTML email template with KOMAL branding
   - Requires SMTP configuration in environment variables

3. **Book a Demo**
   - Contact form for requesting personalized demos
   - Sends notification to sales@komalkids.com
   - Sends confirmation email to the requester
   - Fields: Name (required), Email (required), Organization (optional)

### Analysis Result Structure

```typescript
{
  url: string;
  overallScore: number; // 0-100, higher is safer
  analysisMethod: 'live' | 'demo';
  contentAnalysis: {
    textAnalysis: {
      sentiment: string;
      keyTopics: string[];
      languageScore: number;
      entities: string[];
    };
    visualAnalysis: {
      detectedObjects: string[];
      safetyScore: number;
      concerns: string[];
      labels: string[];
    };
    metadata: {
      title: string;
      description: string;
      keywords: string[];
      imageCount: number;
      linkCount: number;
    };
  };
  categoryScores: {
    [category: string]: {
      detected: boolean;
      confidence: number;
    };
  };
  ageGroupActions: {
    [ageGroup: string]: {
      action: 'BLOCK' | 'GATE' | 'ALLOW';
      reason: string;
      score: number;
    };
  };
  timestamp: string;
}
```

## API Endpoints

### POST `/api/scan-url`

Analyzes a URL for content safety.

**Request Body:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "url": "https://example.com",
  "overallScore": 85,
  "analysisMethod": "live",
  "contentAnalysis": { ... },
  "categoryScores": { ... },
  "ageGroupActions": { ... },
  "timestamp": "2025-01-16T..."
}
```

**Error Responses:**

- `400`: Invalid or missing URL
- `500`: Analysis failed

### POST `/api/send-report`

Sends a safety report via email.

**Request Body:**

```json
{
  "email": "user@example.com",
  "report": { /* ScanResult object */ }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Report sent successfully"
}
```

### POST `/api/book-demo`

Submits a demo request.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "organization": "Optional Company Name"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Demo request submitted successfully! Check your email for confirmation."
}
```

## Fallback Mode

### Demo Mode (No Google Cloud APIs)

If environment variables are not configured, the system automatically falls back to **demo mode**:

- Pattern-based analysis using URL keywords
- No actual webpage fetching
- No Vision AI or NLP analysis
- Simulated results based on URL patterns
- `analysisMethod: 'demo'` in response

### When Fallback Occurs

1. No Google Cloud credentials configured
2. API quota exceeded
3. Network errors
4. Invalid credentials
5. Webpage fetch failures

### Demo Mode Keywords

The demo mode detects these URL patterns:

- **News**: `news`, `cnn`, `bbc` → Crime Footage + Mild Language
- **Gaming**: `game`, `steam`, `xbox` → Non-Graphic Violence
- **Educational**: `edu`, `learn`, `wiki` → Educational Content
- **Social**: `facebook`, `instagram`, `tiktok` → Language detection
- **Video**: `youtube`, `video`, `vimeo` → Mixed content

## Content Safety Rules

All analysis is based on rules from [komalkids.com/content-safety](https://komalkids.com/content-safety):

- **Age Groups**: <10, 10-13, 13-16, 16+
- **Actions**: BLOCK, GATE (parent approval), ALLOW
- **Categories**: Violence, Language, Explicit Content, Educational Content, Horror, Crime, Substance Use, etc.

## Troubleshooting

### "Demo Mode" Always Shows

**Problem**: Analysis always returns `analysisMethod: 'demo'`

**Solutions**:
1. Check `.env.local` exists and has correct credentials
2. Verify environment variables are loaded:
   ```bash
   echo $GOOGLE_CLOUD_API_KEY
   ```
3. Restart the development server after adding env vars
4. Check Google Cloud APIs are enabled
5. Verify API key is valid and not restricted

### Puppeteer Errors

**Problem**: Screenshot capture fails

**Solutions**:
1. Install Chromium dependencies:
   ```bash
   # Linux
   sudo apt-get install -y chromium-browser

   # macOS
   brew install chromium
   ```
2. Check sufficient memory available
3. Verify no-sandbox flags in puppeteer.launch()

### API Quota Errors

**Problem**: "Quota exceeded" errors

**Solutions**:
1. Check [Google Cloud quotas](https://console.cloud.google.com/iam-admin/quotas)
2. Enable billing on your project
3. Request quota increase if needed
4. Implement rate limiting for production use

### Vision API Errors on Images

**Problem**: Some images fail to analyze

**Solutions**:
1. Check image URLs are publicly accessible
2. Verify images are in supported formats (PNG, JPEG, etc.)
3. Check image file sizes (Vision API has limits)
4. Review error logs for specific image URLs

## Cost Optimization

To minimize Google Cloud costs:

1. **Limit screenshot analysis**: Already limited to 1 per URL
2. **Limit image analysis**: Currently set to first 3 images
3. **Cache results**: Implement caching for repeated URLs
4. **Text length limits**: Set to 5,000 characters
5. **Use demo mode**: For testing without API calls
6. **Monitor usage**: Check [Cloud Console billing](https://console.cloud.google.com/billing)

## Security Considerations

1. **Never commit** `.env.local` or service account keys to git
2. **Restrict API keys** to specific APIs and domains in production
3. **Use service accounts** in production environments
4. **Implement rate limiting** to prevent abuse
5. **Sanitize URLs** before processing
6. **Set timeouts** on all external requests

## Support

For issues or questions:
- Check environment variable configuration
- Review server logs for detailed errors
- Verify Google Cloud setup and billing
- Test with demo mode first to isolate issues

## License

See main project license.
