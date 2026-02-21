# GCP Child Safety Engine Implementation Guide

This guide captures the end-to-end implementation plan for a GCP-hosted moderation engine based on the Models_Masterdoc schema, plus client integration steps for iOS, Android, Chrome extension, and the web app.

## 1) Build the ML models (Models_Masterdoc-driven pipeline)

### 1.1 Data and taxonomy
- Use `Models_Masterdoc.csv` as the authoritative taxonomy for categories, subcategories, and age-band rules.
- Tokenize category/subcategory keyword sets for **candidate discovery**, not direct blocking.
- Keep thresholds configurable; scores should be derived from **density** and confidence, not exact keyword matches.

### 1.2 On-device pipeline (first-pass)
1. **NLP**: Classify major categories and subcategories using the schema; use keyword lists only for recall boosts.
2. **Vision**: Run NSFW, violence/weapons, gambling UI, and other high-risk detectors on thumbnails/frames.
3. **Audio**: Transcribe to text, re-run NLP, and optionally add tone analysis (screams, coercive speech).
4. **Merge**: Apply “most restrictive” rule across NLP/Vision/Audio/Links.
5. **Cloud fallback**: Call GCP only when local models are low-confidence or conflicting.

### 1.3 GCP cloud pipeline (fallback and enrichment)
Use GCP services for high-confidence resolution and logging:
- **Vision AI** for image/thumbnail analysis.
- **Natural Language** for text classification.
- **Video Intelligence** for keyframes (where available).
- **Cloud Logging/Monitoring** for audit and performance.
- **Cloud Run / App Engine** to host the moderation API.

### 1.4 Neutral identity term policy
- Neutral identity terms (woman, man, girl, boy, child, person) are **always safe** when standalone.
- Only reduce scores for explicit harm (pornography, exploitation, self-harm, violence).
- Return **ALLOW** for all age bands when the input is only neutral identity terms.

## 2) GCP setup guide (engine hosting)

### 2.1 Project and service account
1. Create a GCP project for the moderation engine.
2. Create a service account with least-privilege access to:
   - Cloud Vision API
   - Cloud Natural Language API
   - Video Intelligence API
3. Store service account credentials in Secret Manager or mount as a runtime secret.

### 2.2 Enable APIs
Enable the APIs required by the engine and already approved:
- Cloud Vision API
- Cloud Natural Language API
- Video Intelligence API
- Cloud Logging API
- Cloud Monitoring API
- Cloud Run Admin API (if using Cloud Run)
- Artifact Registry API (if deploying containers)

### 2.3 Deploy the moderation service
1. Containerize the Python service (FastAPI recommended).
2. Deploy to **Cloud Run** with environment variables for thresholds and policy flags.
3. Configure autoscaling and request timeouts to keep latency low (< 3s preferred).
4. Configure VPC egress if you must restrict outbound access.

### 2.4 Observability
- Log moderation decisions, inputs (redacted), and confidence scores to Cloud Logging.
- Track latency and error rates in Cloud Monitoring dashboards.

## 3) Client integration guide

### 3.1 Website
- Call the moderation API from the web app for fallback decisions.
- Cache per-URL decisions in Redis/Firestore to reduce repeat latency.

### 3.2 iOS app
- Run the on-device pipeline first (CoreML models).
- Call GCP fallback only when confidence is low.
- Store user consent and telemetry settings for compliance.

### 3.3 Android app
- Use TensorFlow Lite for on-device classification.
- Mirror iOS flow: local first, cloud fallback.

### 3.4 Chrome extension
- Intercept navigation and thumbnails.
- Run lightweight on-device NLP; use GCP for ambiguous cases.
- Enforce the “most restrictive” rule in the UI.

## 4) Required moderation output schema (JSON)
Use a unified JSON object per URL with age-band actions:
```json
{
  "url": "https://example.com",
  "overallSafetyScore": 1.0,
  "languageSafetyScore": 1.0,
  "visualSafetyScore": 1.0,
  "audioSafetyScore": 1.0,
  "ageActions": {
    "below10": { "action": "ALLOW", "score": 1.0 },
    "10_13": { "action": "ALLOW", "score": 1.0 },
    "13_16": { "action": "ALLOW", "score": 1.0 },
    "16_18": { "action": "ALLOW", "score": 1.0 }
  }
}
```

## 5) System prompt (cloud moderation)
Use the system prompt in `docs/moderation-system-prompt.txt` for the cloud service to enforce the neutral identity policy and explicit-harm-only penalties.
