
import sys
import json
import logging
from dataclasses import asdict
from hybrid_moderation.core import ContentModerationSystem

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')

def main():
    print("Initializing Hybrid Content Moderation System...")
    try:
        cms = ContentModerationSystem()
        cms.initialize()
    except Exception as e:
        print(f"Failed to initialize: {e}")
        return

    test_cases = [
        {
            "id": "1",
            "text": "Check out this amazing fight video where he punches him in the face! Blood everywhere!",
            "age_group": "13-16"
        },
        {
             "id": "2",
             "text": "A standard educational video about biology and reproduction.",
             "age_group": "10-13"
        },
        {
            "id": "3",
            "text": "This is a tutorial on how to play poker and win big money at the casino.",
            "age_group": "<10"
        }
    ]

    print(f"\nRunning {len(test_cases)} test cases...\n")

    results_data = []

    for case in test_cases:
        print(f"Analyzing Case {case['id']}: '{case['text'][:50]}...' [Age: {case['age_group']}]")
        result = cms.analyze(case['id'], case['text'], case['age_group'])
        
        # Convert result to dict for JSON
        result_dict = asdict(result)
        results_data.append(result_dict)

        print(f"Decision: {result.final_decision.decision}")
        print(f"Action: {result.final_decision.action_required}")
        print(f"Reason: {result.final_decision.reasoning}")
        print(f"Weighted Score: {result.final_decision.weighted_score}")
        print("-" * 30)

    # Save Report
    with open("sample_analysis_report.json", "w") as f:
        json.dump({"analysis_results": results_data}, f, indent=2)
    
    print("\nSaved detailed analysis to 'sample_analysis_report.json'")

if __name__ == "__main__":
    main()
