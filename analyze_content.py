
import sys
import json
import argparse
import logging
from hybrid_moderation.core import ContentModerationSystem
from hybrid_moderation.models import ModerationResult

# Configure logging to stderr so it doesn't pollute stdout (which is used for JSON output)
logging.basicConfig(level=logging.ERROR, stream=sys.stderr)

def main():
    parser = argparse.ArgumentParser(description='Analyze content using Hybrid Moderation System')
    parser.add_argument('--text', type=str, help='Text content (optional, defaults to stdin)', required=False)
    parser.add_argument('--age', type=str, default='13-16', help='Age group')
    parser.add_argument('--id', type=str, default='api-request', help='Content ID')
    
    args = parser.parse_args()

    # Read text from argument or stdin
    text_content = args.text
    if not text_content:
        # Read from stdin
        text_content = sys.stdin.read()

    if not text_content:
        # Fail silently or output error JSON? 
        # Outputting empty result is safer to avoid breaking the caller
        print(json.dumps({"error": "No text provided"}))
        return

    try:
        cms = ContentModerationSystem()
        cms.initialize()
        
        result = cms.analyze(args.id, text_content, args.age)
        
        # Manually construct dict since we aren't using a serialization library
        # and simple __dict__ might miss nested dataclasses if not careful, 
        # but `asdict` from dataclasses is safer.
        from dataclasses import asdict
        output = asdict(result)
        
        # Print JSON to stdout for Node.js to capture
        print(json.dumps(output))
        
    except Exception as e:
        logging.error(f"Error in analysis: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
