# Komal Web - Complete Deployment and Testing Guide

## 🎯 Executive Summary

This guide provides comprehensive instructions to deploy the Komal Web platform with full NLP and Vision AI integration. The system analyzes URLs and keywords for child safety using a hybrid approach combining:
- Google Cloud Vision API (image safety analysis)
- Google Cloud Natural Language API (text sentiment)
- Python Hybrid Moderation Service (custom NLP + vector analysis)
- Firestore database (data persistence)
- Next.js frontend (Vercel deployment)

## 📋 Current System Analysis

### ✅ What's Working
1. **Frontend (Next.js)**: Fully functional on Vercel
2. **Backend API**: `/api/scan-url` endpoint processing URLs/keywords
3. **Google Vision AI**: Configured and analyzing images
4. **Google NLP API**: Configured for sentiment analysis
5. **Pattern Matching**: Extensive keyword-based safety checks
6. **Social Media Detection**: Age-appropriate blocking for platforms
7. **Dangerous Sites Blocking**: Explicit content filtering

### ⚠️ What Needs Fixing
1. **Python Moderation Service**: Not deployed/accessible
2. **Firestore Integration**: Not storing analysis results
3. **Testing**: No automated test suite
4. **CI/CD**: No automated deployment pipeline
5. **Error Handling**: Needs improvement for production
6. **Monitoring**: No logging/analytics integration

## 🏗️ Architecture Overview

```
User Request → Next.js API Route → Parallel Processing:
                                   ├── Google Vision AI (images)
                                   ├── Google NLP API (text)
                                   ├── Python Hybrid Service (advanced)
                                   └── Pattern Matching (keywords)
                                   ↓
                                Results Aggregation
                                   ↓
                                Firestore Storage
                                   ↓
                                Response to User
```

## 🚀 Deployment Steps

### 1. Deploy Python Moderation Service

#### Option A: Google Cloud Run (Recommended)

**Create Dockerfile in `moderation-backend/`:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Deploy to Cloud Run:**
```bash
cd moderation-backend

# Build and push image
gcloud builds submit --tag gcr.io/the-sharing-project/komal-moderation

# Deploy to Cloud Run
gcloud run deploy komal-moderation \
  --image gcr.io/the-sharing-project/komal-moderation \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 60s

# Get the service URL
gcloud run services describe komal-moderation --region us-central1 --format='value(status.url)'
```

#### Option B: Railway.app (Alternative)

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repo
3. Select `moderation-backend` as root directory
4. Railway will auto-detect Python and deploy
5. Copy the deployment URL

### 2. Configure Environment Variables

**Vercel Environment Variables:**
Go to Vercel Dashboard → komalweb → Settings → Environment Variables

```env
# Google Cloud APIs
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
GOOGLE_CUSTOM_SEARCH_API_KEY=your_custom_search_key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id

# Python Moderation Service
MODERATION_SERVICE_URL=https://your-cloud-run-url.run.app

# Firestore (use service account)
FIREBASE_PROJECT_ID=the-sharing-project
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional: Additional APIs
SERPAPI_API_KEY=your_serpapi_key (optional)

# Moderation Thresholds (optional - has defaults)
MODERATION_CAUTION_DENSITY=0.004
MODERATION_UNSAFE_DENSITY=0.01
MODERATION_DANGEROUS_DENSITY=0.02
```

### 3. Add Firestore Integration

**Create `lib/firebase-admin.ts`:**
```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const db = getFirestore();
```

**Update `app/api/scan-url/route.ts` to save results:**
Add this after line 2730 (before returning result):

```typescript
import { db } from '@/lib/firebase-admin';

// Inside POST function, after generating result:
try {
  await db.collection('scans').add({
    input: input,
    type: isValidUrl(input) ? 'url' : 'keyword',
    result: result,
    timestamp: new Date().toISOString(),
    userId: 'anonymous', // Add user tracking later
  });
  console.log('✅ Scan saved to Firestore');
} catch (error) {
  console.error('❌ Failed to save to Firestore:', error);
  // Don't fail the request if Firestore save fails
}
```

### 4. Create Testing Infrastructure

**Install testing dependencies:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

**Create `__tests__/api/scan-url.test.ts`:**
```typescript
import { POST } from '@/app/api/scan-url/route';
import { NextRequest } from 'next/server';

describe('Scan URL API', () => {
  it('should analyze a safe educational URL', async () => {
    const request = new NextRequest('http://localhost:3000/api/scan-url', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://wikipedia.org' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.overallScore).toBeGreaterThan(70);
    expect(data.childSafetyAnalysis.overallRisk).toBe('safe');
  });
  
  it('should block dangerous keywords', async () => {
    const request = new NextRequest('http://localhost:3000/api/scan-url', {
      method: 'POST',
      body: JSON.stringify({ url: 'pornhub' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.overallScore).toBe(0);
    expect(data.ageGroupScores['<10'].action).toBe('BLOCK');
  });
});
```

### 5. Set Up CI/CD Pipeline

**Create `.github/workflows/test-and-deploy.yml`:**
```yaml
name: Test and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        service_account_key: ${{ secrets.GCP_SA_KEY }}
        project_id: the-sharing-project
    
    - name: Deploy to Cloud Run
      run: |
        cd moderation-backend
        gcloud builds submit --tag gcr.io/the-sharing-project/komal-moderation
        gcloud run deploy komal-moderation \
          --image gcr.io/the-sharing-project/komal-moderation \
          --platform managed \
          --region us-central1 \
          --allow-unauthenticated
```

### 6. Testing Checklist

**Manual Testing:**
- [ ] Test safe URL (e.g., wikipedia.org) → Should score 80+
- [ ] Test educational keyword (e.g., "math learning") → Should be ALLOW
- [ ] Test social media (e.g., facebook.com) → Should BLOCK <13, GATE 13+
- [ ] Test dangerous site (e.g., explicit domain) → Should BLOCK all ages
- [ ] Test dangerous keyword (e.g., "pornography") → Should BLOCK all ages
- [ ] Verify Firestore is storing results
- [ ] Check Python service is responding (look for "Python Result" in logs)
- [ ] Verify Vision API is analyzing images
- [ ] Verify NLP is providing sentiment

**Automated Testing:**
```bash
npm run test
```

## 📊 Monitoring and Debugging

### Check Logs

**Vercel Logs:**
```bash
vercel logs komalweb
```

**Cloud Run Logs:**
```bash
gcloud run services logs read komal-moderation --region us-central1
```

**Firestore Console:**
https://console.firebase.google.com/project/the-sharing-project/firestore

### Debug Checklist

1. **Python Service Not Responding:**
   - Check `MODERATION_SERVICE_URL` is set correctly
   - Verify Cloud Run service is running
   - Check Cloud Run logs for errors

2. **Vision API Failing:**
   - Verify `GOOGLE_CLOUD_API_KEY` is valid
   - Check quota limits in Google Cloud Console
   - Ensure Vision API is enabled

3. **Firestore Not Saving:**
   - Check Firebase credentials are correct
   - Verify Firestore database exists
   - Check IAM permissions for service account

## 🎓 Next Steps

1. **Add User Authentication:**
   - Integrate NextAuth.js
   - Track scans per user
   - Implement rate limiting

2. **Dashboard:**
   - Create admin panel to view all scans
   - Add analytics and reporting
   - Implement flagging/review queue

3. **Enhanced AI:**
   - Fine-tune Python model with more data
   - Add BERT/transformer-based classification
   - Implement image OCR for text-in-images

4. **Performance:**
   - Add Redis caching for repeated URLs
   - Implement batch processing
   - Optimize API response times

## 📝 Configuration Files

All configuration files are created above. Here's the complete structure:

```
komalweb/
├── .github/
│   └── workflows/
│       └── test-and-deploy.yml
├── app/
│   └── api/
│       └── scan-url/
│           └── route.ts (updated)
├── lib/
│   └── firebase-admin.ts (new)
├── moderation-backend/
│   ├── Dockerfile (new)
│   ├── main.py
│   ├── requirements.txt
│   └── hybrid_moderation/
├── __tests__/
│   └── api/
│       └── scan-url.test.ts (new)
└── package.json
```

## ✅ Deployment Verification

After deployment, run this test:

```bash
curl -X POST https://komalweb.vercel.app/api/scan-url \
  -H "Content-Type: application/json" \
  -d '{"url": "wikipedia.org"}'
```

Expected response should include:
- `overallScore`: 80-100
- `pythonDebug.status`: "success"
- All API integrations working

## 🆘 Support

If you encounter issues:
1. Check logs in Vercel and Cloud Run
2. Verify all environment variables are set
3. Test each component independently
4. Review error messages in browser console

---

**Status:** Ready for deployment
**Estimated Setup Time:** 2-3 hours
**Prerequisites:** Google Cloud account, Vercel account, GitHub access
