
import os

file_path = r'c:\Users\ravir\komalweb\app\dashboard\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip().startswith('//'):
        # Only remove the first '// ' or '//'
        uncommented = line.replace('// ', '', 1)
        if uncommented == line:
            uncommented = line.replace('//', '', 1)
        new_lines.append(uncommented)
    else:
        new_lines.append(line)

# Add mocks after imports (around line 5-10)
mock_code = """
// Mock Clerk components and hooks for build
const useUser = () => ({ 
  isLoaded: true, 
  user: { 
    firstName: "Guest", 
    emailAddresses: [{ emailAddress: "guest@example.com" }] 
  } 
});
const UserButton = ({ afterSignOutUrl }: { afterSignOutUrl: string }) => (
  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-[10px]">User</div>
);
"""

# Find where to insert mocks (after the first few imports)
insert_idx = 0
for i, line in enumerate(new_lines):
    if 'import' in line and 'clerk' in line:
        insert_idx = i + 1
        break

if insert_idx > 0:
    new_lines.insert(insert_idx, mock_code)
else:
    # Fallback to after the first few lines
    new_lines.insert(5, mock_code)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Successfully uncommented and mocked dashboard/page.tsx")
