from hybrid_moderation.loader import CSVLoader
from hybrid_moderation.config import CSV_FILE_PATH

def debug():
    loader = CSVLoader(CSV_FILE_PATH)
    cats = loader.load_data()
    print(f"Loaded {len(cats)} categories")
    
    for c in cats:
        if "Explicit" in c.category or "Explicit" in c.subcategory:
            print(f"Category: {c.category}")
            print(f"Subcategory: {c.subcategory}")
            print(f"Keywords: {c.category_keywords}")
            print("---")

if __name__ == "__main__":
    debug()
