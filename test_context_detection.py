import sys
import json
from hybrid_moderation.core import ContentModerationSystem

def test_context():
    cms = ContentModerationSystem()
    cms.initialize()
    
    print("--- Test 1: Educational Context (Should be safe/downgraded) ---")
    # 'sex' is a keyword in Row 7 (Explicit) and Row 8 (Sex Ed).
    # If the system matches 'Explicit', the context 'education'/'doctor' should downgrade it.
    text_edu = "The doctor provided a lesson on sex education and reproductive health."
    
    result_edu = cms.analyze("test-edu-1", text_edu)
    print(f"Edu Result Decision: {result_edu.final_decision.decision}")
    print(f"Edu Result Score: {result_edu.final_decision.weighted_score}")
    
    print("\n--- Test 2: Unsafe Context ---")
    text_unsafe = "Watch distinct explicit sex video online free."
    result_unsafe = cms.analyze("test-unsafe-1", text_unsafe)
    print(f"Unsafe Result Decision: {result_unsafe.final_decision.decision}")
    print(f"Unsafe Result Score: {result_unsafe.final_decision.weighted_score}")

    # Verify Logic
    if result_edu.final_decision.weighted_score < result_unsafe.final_decision.weighted_score:
        print("\n✅ PASS: Educational context scored lower than unsafe context.")
    else:
        print("\n❌ FAIL: Educational context score was not lower.")
        print(f"Edu: {result_edu.final_decision.weighted_score}, Unsafe: {result_unsafe.final_decision.weighted_score}")

if __name__ == "__main__":
    test_context()
