
# Managing Content Moderation Categories

This system is driven by the `Models_Masterdoc_Test.csv` file. To add or modify categories, you don't need to change the code.

## CSV Structure

The CSV expects the following key columns:

1.  **Category**: The primary classification (e.g., "Violence & Disturbing Content"). (Required)
2.  **Subcategory**: A more specific classification (e.g., "Graphic violence"). (Required)
3.  **Tokenized_category_keywords_total**: Comma-separated list of keywords for the primary category.
4.  **Tokenized_subcategory_keywords_total**: Comma-separated list of keywords for the subcategory.
5.  **rules_below_10**: Action for users < 10 years old (`Block`, `Gate`, `Allow`).
6.  **rules_10_13**: Action for users 10-13.
7.  **rules_13_16**: Action for users 13-16.
8.  **rules_16_18**: Action for users 16+.

## Adding a New Category

1.  Open `Models_Masterdoc_Test.csv` in Excel or a text editor.
2.  Add a new row.
3.  Fill in the **Category** and **Subcategory** names.
4.  Add unique keywords in the tokenized columns.
    *   *Tip*: Use phrases for higher accuracy (e.g., "buy drugs" is better than just "buy").
5.  Define the age rules. Use `Block` for strictly prohibited content, `Gate` for warning labels, and `Allow` for safe content.

## Reloading

The system loads the CSV at startup. If you modify the file, you must restart the application `ContentModerationSystem` to pick up changes.
