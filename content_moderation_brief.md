# Hybrid Content Moderation System - Implementation Brief

## Overview
Build a hybrid content moderation scoring system that combines rule-based CSV keyword matching (30% weight) with vector-based semantic analysis (70% weight) to classify and flag inappropriate content across 37+ categories.

## Input Files
- `Models_Masterdoc_Test.csv`: Contains 37+ content moderation categories, tokenized keywords, age restrictions, subcategories, and JSON schemas
- **Existing System**: Vector-based URL ranking system (already in production - needs integration)

## Core Requirements

### 1. CSV Processing Module
```python
# Load and structure the CSV data
# Columns expected:
# - Category (primary classification)
# - Subcategory (nested classification)
# - Keywords (tokenized, comma-separated)
# - Age_Restriction (integer or range)
# - Confidence_Threshold (default 0.9)
# - Additional metadata fields
```

### 2. Confidence-Based Cascading Logic
Implement a multi-stage matching system:

**Stage 1: Primary Category Match**
- Tokenize input content
- Match against CSV keywords for each category
- Calculate confidence score using TF-IDF or keyword density
- **Threshold**: confidence > 0.9 → proceed to Stage 2
- **Fallback**: if < 0.9 → try next best category match

**Stage 2: Subcategory Match**
- Within the matched primary category, search subcategory keywords
- Calculate subcategory confidence score
- **Threshold**: confidence > 0.9 → lock subcategory
- **Fallback**: if < 0.9 → assign "General" or return to Stage 1 with next category

**Stage 3: Vector Semantic Validation**
- Pass content through existing vector search system
- Get semantic similarity scores across category embeddings
- Weight: 70% of final score

### 3. Scoring Algorithm
```python
final_score = (csv_confidence * 0.30) + (vector_confidence * 0.70)

# Decision Logic:
if final_score >= 0.9:
    decision = "FLAG"
    action = "Block/Review Required"
elif 0.7 <= final_score < 0.9:
    decision = "REVIEW_QUEUE"
    action = "Manual verification needed"
else:
    decision = "PASS"
    action = "Allow with monitoring"
```

### 4. Age Rule Enforcement
- Hard block for content marked with age restrictions
- Override confidence scores if age restriction applies
- Flag for immediate review if age-gated content detected

### 5. Output Schema
```json
{
  "content_id": "string",
  "analysis_results": {
    "csv_analysis": {
      "primary_category": "string",
      "subcategory": "string",
      "confidence": "float (0-1)",
      "matched_keywords": ["array"],
      "age_restriction": "integer or null"
    },
    "vector_analysis": {
      "semantic_category": "string",
      "confidence": "float (0-1)",
      "embedding_similarity": "float"
    },
    "final_decision": {
      "weighted_score": "float (0-1)",
      "decision": "FLAG | REVIEW_QUEUE | PASS",
      "action_required": "string",
      "reasoning": "string"
    },
    "metadata": {
      "processing_time_ms": "integer",
      "csv_weight": 0.3,
      "vector_weight": 0.7,
      "timestamp": "ISO 8601"
    }
  }
}
```

## Technical Implementation

### Required Functionality:
1. **CSV Parser**: Load and index the masterdoc for fast keyword lookups
2. **Tokenizer**: Clean and tokenize input text (remove stop words, handle special characters)
3. **Keyword Matcher**: Fuzzy matching with confidence scoring (consider Levenshtein distance for typos)
4. **Vector Integration**: Interface with existing vector search API/system
5. **Confidence Calculator**: Implement scoring based on:
   - Keyword frequency
   - Keyword position (title vs body)
   - Exact vs partial matches
   - Category-specific weighting
6. **Decision Engine**: Apply cascading logic and thresholds
7. **Logging**: Track all decisions for audit and model improvement

### Performance Considerations:
- Cache frequently accessed categories/keywords
- Batch processing for multiple URLs
- Response time target: < 500ms per URL

### Edge Cases to Handle:
- Multiple category matches (resolve by highest confidence)
- CSV and vector disagreement (escalate to review queue)
- Content with no keyword matches but high vector similarity
- Multilingual content (specify if needed)
- Null/empty content handling

## Integration Points
- **Input**: Content text/URL from existing moderation pipeline
- **Output**: JSON response with classification and decision
- **Existing System**: Vector search API (provide endpoint/method to integrate)

## Success Metrics
- Accuracy: >95% on known test cases
- False positive rate: <5%
- Processing speed: <500ms per item
- Agreement rate between CSV and vector: document for tuning

## Deliverables
1. Python module/class implementing the hybrid system
2. Configuration file for threshold tuning
3. Unit tests covering edge cases
4. Integration script with existing vector system
5. Sample analysis report showing CSV vs Vector contributions
6. Documentation for future category additions to CSV

## Implementation Steps
1. Analyze CSV structure and create data models
2. Build keyword matching engine with confidence scoring
3. Implement cascading category→subcategory logic
4. Create vector search integration layer
5. Develop weighted scoring algorithm
6. Add age restriction enforcement
7. Build output formatter and logger
8. Write comprehensive tests
9. Create sample demonstrations

## Questions to Address in Implementation:
- What format is the existing vector search system? (API, library, embeddings model)
- What's the expected input format? (raw text, URLs, HTML?)
- Should the system learn from manual review feedback?
- Are there category-specific confidence thresholds in the CSV?