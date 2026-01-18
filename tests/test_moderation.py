
import unittest
from hybrid_moderation.core import ContentModerationSystem
from hybrid_moderation.models import ModerationResult

class TestContentModeration(unittest.TestCase):
    def setUp(self):
        self.cms = ContentModerationSystem()
        self.cms.initialize()

    def test_violence_blocking(self):
        # Case: High violence content for a young child (<10)
        # Should be BLOCKED by both score and age rule potentially
        text = "Graphic video of a brutal stabbing and murder with blood."
        result = self.cms.analyze("test_1", text, age_group="<10")
        
        self.assertEqual(result.final_decision.decision, "FLAG")
        # Depending on CSV rule for Violence <10, it's likely Block
        self.assertIn("Block", result.final_decision.action_required)

    def test_safe_content(self):
        # Case: Educational content
        text = "This is a science lesson about photosynthesis and plants."
        result = self.cms.analyze("test_2", text, age_group="10-13")
        
        self.assertNotEqual(result.final_decision.decision, "FLAG")
        # Final score should be low
        self.assertLess(result.final_decision.weighted_score, 0.7)

    def test_age_gating_gambling(self):
        # Case: Gambling content for <10 (Strict Block) vs 18+ (Allow/Warn)
        text = "Best online casino sites to play poker and slots."
        
        # Child
        result_child = self.cms.analyze("test_3a", text, age_group="<10")
        self.assertEqual(result_child.final_decision.decision, "FLAG")
        self.assertIn("Block", result_child.csv_analysis.age_restriction)
        
        # Adult (16+) -> checking logic, CSV says 16-18 is Allow or Gate for some
        # Let's check logic flow
        result_adult = self.cms.analyze("test_3b", text, age_group="16+")
        # Even if allowed by age rule, high confidence might still flag it for Review
        # But specifically checking that age_restriction didn't force-block it
        self.assertNotEqual(result_adult.final_decision.action_required, "Blocked by Age Rule")

    def test_mixed_confidence(self):
        # Content with some keywords but low semantic relevance (mock)
        text = "I saw a fight in a movie scene." # "fight" matches, but maybe semantic is lower
        result = self.cms.analyze("test_4", text, age_group="13-16")
        
        # Should likely result in REVIEW_QUEUE or PASS depending on exact math
        # match "fight" -> maybe 0.3 * 0.35 = 0.1 confidence from CSV
        # vector mock for "fight" might fail to trigger high "violent" exact match if code is strict
        # Just ensuring it runs without error and produces valid score
        self.assertTrue(0.0 <= result.final_decision.weighted_score <= 1.0)

if __name__ == '__main__':
    unittest.main()
