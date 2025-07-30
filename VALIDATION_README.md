# Documentation Structure Validator

A Node.js script to validate the Jito Omnidocs documentation structure according to project guidelines.

## Installation

```bash
npm install
```

## Usage

### Basic validation (all checks)
```bash
node validate-docs-structure.js
```

### Run only critical checks (for CI/CD)
```bash
node validate-docs-structure.js --only-critical
```

### Specify a different path
```bash
node validate-docs-structure.js --path /path/to/docs
```

### Skip specific checks
```bash
# Skip terminal directory checks
node validate-docs-structure.js --skip-terminal

# Skip parent directory checks
node validate-docs-structure.js --skip-parent

# Skip folder naming checks
node validate-docs-structure.js --skip-naming

# Skip sibling order checks
node validate-docs-structure.js --skip-order
```

### Using npm scripts
```bash
# Run all validations
npm run validate

# Run only critical validations
npm run validate:critical

# Test the validator
npm test
```

## Validation Rules

The script validates four main aspects of the documentation structure:

### 1. Terminal Directories (Critical)
- **Rule**: Terminal directories (those with no child directories containing `index.md`) must have exactly one `index.md` file with `section_type: 'page'`
- **Purpose**: Ensures content pages are properly structured
- **Example**: `jitosol/faqs/general-faqs/` should only contain `index.md` with `section_type: 'page'`

### 2. Parent Directories (Critical)
- **Rule**: Parent directories (those with child directories containing `index.md`) must have exactly one `index.md` file with `section_type: 'header'` or `section_type: 'expandable'`
- **Purpose**: Ensures section organization is consistent
- **Example**: `jitosol/faqs/` should have `index.md` with `section_type: 'header'` or `section_type: 'expandable'`

### 3. Folder Naming Convention
- **Rule**: No folder should end with the same name as its parent collection
- **Purpose**: Prevents Decap CMS navigation issues
- **Bad**: `jitosol/intro-to-jitosol/` (ends with "jitosol")
- **Good**: `jitosol/introduction/` or `jitosol/getting-started/`

### 4. Sibling Order Numbers
- **Rule**: Sibling directories should have different `order` numbers in their `index.md` frontmatter
- **Purpose**: Prevents navigation ordering conflicts
- **Example**: If `faqs/` has children `general-faqs/` (order: 1) and `technical-faqs/` (order: 2), both must have different order values

## Exit Codes

- **0**: All checks passed
- **1**: One or more validation errors found

## CI/CD Integration

For GitHub Actions or other CI/CD systems, use the `--only-critical` flag to run only the most important checks:

```yaml
# Example GitHub Action step
- name: Validate Documentation Structure
  run: |
    npm install
    node validate-docs-structure.js --only-critical
```

## Output Format

The script provides clear, actionable error messages:

```
🔍 Jito Documentation Structure Validator
==================================================
📁 Scanning documentation at: /path/to/docs
📚 Found collections: jitosol, governance, restaking, stakenet, tiprouter

🔍 Checking terminal directories...
🔍 Checking parent directories...

❌ ERRORS FOUND:
  • Terminal directory jitosol/faqs/general-faqs should have section_type: 'page', found: 'header'
  • Folder name violation: 'jitosol/intro-to-jitosol' ends with collection name 'jitosol'

Summary: 2 errors, 0 warnings
```

## Troubleshooting

### Common Issues

1. **"Could not parse frontmatter"**: Ensure your `index.md` files start with valid YAML frontmatter:
   ```yaml
   ---
   title: "Page Title"
   section_type: "page"
   order: 1
   ---
   ```

2. **Missing dependencies**: Run `npm install` to install required packages

3. **Permission errors**: Make sure the script has read permissions for all directories

### Development

To modify validation rules, edit the respective methods in `validate-docs-structure.js`:
- `checkTerminalDirectories()` - Terminal directory validation
- `checkParentDirectories()` - Parent directory validation  
- `checkFolderNaming()` - Folder naming validation
- `checkSiblingOrderNumbers()` - Order number validation 