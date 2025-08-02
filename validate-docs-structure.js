#!/usr/bin/env node

/**
 * Documentation Structure Validator for Jito Omnidocs
 * 
 * This script validates the documentation structure according to the following rules:
 * 1. Terminal directories should have only one index.md with section_type: 'page'
 * 2. Parent directories should have one index.md with section_type: 'header' or 'expandable'
 * 3. No folder should end with the parent collection name
 * 4. Sibling directories should have different order numbers
 */

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { Command } = require('commander');

class DocumentInfo {
    constructor(filePath, title, sectionType, order, subtitle = null) {
        this.path = filePath;
        this.title = title;
        this.sectionType = sectionType;
        this.order = order;
        this.subtitle = subtitle;
    }
}

class DocStructureValidator {
    constructor(rootPath = '.') {
        this.rootPath = path.resolve(rootPath);
        this.parentCollections = this._getParentCollections();
        this.errors = [];
        this.warnings = [];
    }

    _getParentCollections() {
        /**
         * Get list of parent collection directories (excluding 'shared' and other system directories)
         */
        const excludedDirs = ['shared', 'node_modules', '.git', '.github', 'dist', 'build', '.next', '.nuxt'];
        const collections = [];
        try {
            const items = fs.readdirSync(this.rootPath, { withFileTypes: true });
            for (const item of items) {
                if (item.isDirectory() && 
                    !excludedDirs.includes(item.name) && 
                    !item.name.startsWith('.') &&
                    !item.name.endsWith('.log')) {
                    collections.push(item.name);
                }
            }
        } catch (error) {
            console.error(`Error reading root directory: ${error.message}`);
        }
        return collections;
    }

    _parseFrontmatter(filePath) {
        /**
         * Parse frontmatter from a markdown file
         */
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check if file starts with frontmatter
            if (!content.startsWith('---')) {
                return null;
            }
            
            // Extract frontmatter
            const parts = content.split('---');
            if (parts.length < 3) {
                return null;
            }
            
            const frontmatterStr = parts[1];
            const frontmatter = yaml.parse(frontmatterStr);
            
            if (typeof frontmatter !== 'object' || frontmatter === null) {
                return null;
            }
            
            return new DocumentInfo(
                filePath,
                frontmatter.title || '',
                (frontmatter.section_type || '').replace(/['"]/g, ''),
                frontmatter.order,
                frontmatter.subtitle || ''
            );
        } catch (error) {
            this.errors.push(`Error parsing ${filePath}: ${error.message}`);
            return null;
        }
    }

    _isTerminalDirectory(dirPath) {
        /**
         * Check if directory is terminal (has no subdirectories with index.md)
         */
        try {
            const items = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const item of items) {
                if (item.isDirectory()) {
                    const indexPath = path.join(dirPath, item.name, 'index.md');
                    if (fs.existsSync(indexPath)) {
                        return false;
                    }
                }
            }
            return true;
        } catch (error) {
            return true; // If we can't read the directory, treat it as terminal
        }
    }

    _getAllMarkdownFiles(dirPath) {
        /**
         * Get all markdown files in a directory (non-recursive)
         */
        const markdownFiles = [];
        try {
            const items = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const item of items) {
                if (item.isFile() && path.extname(item.name) === '.md') {
                    markdownFiles.push(path.join(dirPath, item.name));
                }
            }
        } catch (error) {
            // Directory doesn't exist or can't be read
        }
        return markdownFiles;
    }

    _getSubdirectoriesWithIndex(dirPath) {
        /**
         * Get all subdirectories that contain an index.md file
         */
        const subdirs = [];
        try {
            const items = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const item of items) {
                if (item.isDirectory()) {
                    const subDirPath = path.join(dirPath, item.name);
                    const indexPath = path.join(subDirPath, 'index.md');
                    if (fs.existsSync(indexPath)) {
                        subdirs.push(subDirPath);
                    }
                }
            }
        } catch (error) {
            // Directory doesn't exist or can't be read
        }
        return subdirs;
    }

    _walkDirectory(startPath, callback) {
        /**
         * Recursively walk through directories
         */
        const walk = (currentPath) => {
            try {
                const items = fs.readdirSync(currentPath, { withFileTypes: true });
                const dirs = items.filter(item => item.isDirectory()).map(item => item.name);
                const files = items.filter(item => item.isFile()).map(item => item.name);
                
                callback(currentPath, dirs, files);
                
                for (const dir of dirs) {
                    walk(path.join(currentPath, dir));
                }
            } catch (error) {
                // Skip directories that can't be read
            }
        };
        
        walk(startPath);
    }

    checkTerminalDirectories() {
        /**
         * Check that terminal directories have only one index.md with section_type: 'page'
         */
        let success = true;
        
        for (const collection of this.parentCollections) {
            const collectionPath = path.join(this.rootPath, collection);
            if (!fs.existsSync(collectionPath)) {
                continue;
            }
            
            this._walkDirectory(collectionPath, (currentDir, dirs, files) => {
                // Skip if not a terminal directory
                if (!this._isTerminalDirectory(currentDir)) {
                    return;
                }
                
                // Get all markdown files
                const markdownFiles = this._getAllMarkdownFiles(currentDir);
                
                // Should have exactly one index.md
                const indexFiles = markdownFiles.filter(f => path.basename(f) === 'index.md');
                
                const relativePath = path.relative(this.rootPath, currentDir);
                
                if (indexFiles.length === 0) {
                    this.errors.push(`Terminal directory ${relativePath} missing index.md`);
                    success = false;
                    return;
                } else if (indexFiles.length > 1) {
                    this.errors.push(`Terminal directory ${relativePath} has multiple index.md files`);
                    success = false;
                    return;
                }
                
                // Should have only index.md (no other markdown files)
                const nonIndexFiles = markdownFiles.filter(f => path.basename(f) !== 'index.md');
                if (nonIndexFiles.length > 0) {
                    const fileNames = nonIndexFiles.map(f => path.basename(f));
                    this.errors.push(`Terminal directory ${relativePath} has extra markdown files: ${fileNames.join(', ')}`);
                    success = false;
                }
                
                // Check section_type
                const docInfo = this._parseFrontmatter(indexFiles[0]);
                if (docInfo && docInfo.sectionType !== 'page') {
                    this.errors.push(`Terminal directory ${relativePath}/index.md should have section_type: 'page', found: '${docInfo.sectionType}'`);
                    success = false;
                } else if (!docInfo) {
                    this.errors.push(`Could not parse frontmatter in ${relativePath}/index.md`);
                    success = false;
                }
            });
        }
        
        return success;
    }

    checkParentDirectories() {
        /**
         * Check that parent directories have exactly one index.md with section_type: 'header' or 'expandable'
         * Note: Top-level collection directories (jitosol, governance, etc.) are excluded from this check
         */
        let success = true;
        
        for (const collection of this.parentCollections) {
            const collectionPath = path.join(this.rootPath, collection);
            if (!fs.existsSync(collectionPath)) {
                continue;
            }
            
            this._walkDirectory(collectionPath, (currentDir, dirs, files) => {
                // Skip if terminal directory
                if (this._isTerminalDirectory(currentDir)) {
                    return;
                }
                
                // Skip top-level collection directories - they shouldn't have index.md files
                const relativePath = path.relative(this.rootPath, currentDir);
                if (this.parentCollections.includes(relativePath)) {
                    return;
                }
                
                // Get all markdown files
                const markdownFiles = this._getAllMarkdownFiles(currentDir);
                
                // Should have exactly one index.md
                const indexFiles = markdownFiles.filter(f => path.basename(f) === 'index.md');
                
                if (indexFiles.length === 0) {
                    this.errors.push(`Parent directory ${relativePath} missing index.md`);
                    success = false;
                    return;
                } else if (indexFiles.length > 1) {
                    this.errors.push(`Parent directory ${relativePath} has multiple index.md files`);
                    success = false;
                    return;
                }
                
                // Check section_type
                const docInfo = this._parseFrontmatter(indexFiles[0]);
                if (docInfo && !['header', 'expandable'].includes(docInfo.sectionType)) {
                    this.errors.push(`Parent directory ${relativePath}/index.md should have section_type: 'header' or 'expandable', found: '${docInfo.sectionType}'`);
                    success = false;
                } else if (!docInfo) {
                    this.errors.push(`Could not parse frontmatter in ${relativePath}/index.md`);
                    success = false;
                }
            });
        }
        
        return success;
    }

    checkFolderNaming() {
        /**
         * Check that no folder ends with the parent collection name
         */
        let success = true;
        
        for (const collection of this.parentCollections) {
            const collectionPath = path.join(this.rootPath, collection);
            if (!fs.existsSync(collectionPath)) {
                continue;
            }
            
            this._walkDirectory(collectionPath, (currentDir, dirs, files) => {
                // Check each subdirectory
                for (const subdir of dirs) {
                    if (subdir.endsWith(collection)) {
                        const relativePath = path.relative(this.rootPath, path.join(currentDir, subdir));
                        this.errors.push(`Folder name violation: '${relativePath}' ends with collection name '${collection}'`);
                        success = false;
                    }
                }
            });
        }
        
        return success;
    }

    checkSiblingOrderNumbers() {
        /**
         * Check that sibling directories have different order numbers
         */
        let success = true;
        
        for (const collection of this.parentCollections) {
            const collectionPath = path.join(this.rootPath, collection);
            if (!fs.existsSync(collectionPath)) {
                continue;
            }
            
            this._walkDirectory(collectionPath, (currentDir, dirs, files) => {
                // Get subdirectories with index.md
                const subdirs = this._getSubdirectoriesWithIndex(currentDir);
                
                if (subdirs.length <= 1) {
                    return;
                }
                
                // Parse order numbers from each subdirectory's index.md
                const orderInfo = {};
                for (const subdir of subdirs) {
                    const indexPath = path.join(subdir, 'index.md');
                    const docInfo = this._parseFrontmatter(indexPath);
                    if (docInfo && docInfo.order !== null && docInfo.order !== undefined) {
                        if (orderInfo.hasOwnProperty(docInfo.order)) {
                            // Duplicate order number found
                            const existingDir = orderInfo[docInfo.order];
                            const relativeCurrent = path.relative(this.rootPath, currentDir);
                            const existingName = path.basename(existingDir);
                            const currentName = path.basename(subdir);
                            this.errors.push(`Duplicate order number ${docInfo.order} in siblings: '${relativeCurrent}/${existingName}' and '${relativeCurrent}/${currentName}'`);
                            success = false;
                        } else {
                            orderInfo[docInfo.order] = subdir;
                        }
                    }
                }
            });
        }
        
        return success;
    }

    validate(options = {}) {
        /**
         * Run all enabled validation checks
         */
        const {
            checkTerminal = true,
            checkParent = true,
            checkNaming = true,
            checkOrder = true
        } = options;
        
        this.errors = [];
        this.warnings = [];
        
        let success = true;
        
        if (checkTerminal) {
            console.log('🔍 Checking terminal directories...');
            if (!this.checkTerminalDirectories()) {
                success = false;
            }
        }
        
        if (checkParent) {
            console.log('🔍 Checking parent directories...');
            if (!this.checkParentDirectories()) {
                success = false;
            }
        }
        
        if (checkNaming) {
            console.log('🔍 Checking folder naming conventions...');
            if (!this.checkFolderNaming()) {
                success = false;
            }
        }
        
        if (checkOrder) {
            console.log('🔍 Checking sibling order numbers...');
            if (!this.checkSiblingOrderNumbers()) {
                success = false;
            }
        }
        
        return success;
    }

    reportResults() {
        /**
         * Print validation results
         */
        if (this.errors.length > 0) {
            console.log('\n❌ ERRORS FOUND:');
            for (const error of this.errors) {
                console.log(`  • ${error}`);
            }
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            for (const warning of this.warnings) {
                console.log(`  • ${warning}`);
            }
        }
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('\n✅ All checks passed! Documentation structure is valid.');
        }
        
        console.log(`\nSummary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
    }
}

function main() {
    const program = new Command();
    
    program
        .name('validate-docs-structure')
        .description('Validate Jito documentation structure')
        .option('--path <path>', 'Path to documentation root', '.')
        .option('--skip-terminal', 'Skip terminal directory checks')
        .option('--skip-parent', 'Skip parent directory checks')
        .option('--skip-naming', 'Skip folder naming checks')
        .option('--skip-order', 'Skip sibling order checks')
        .option('--only-critical', 'Run only critical checks (terminal and parent)')
        .parse();
    
    const options = program.opts();
    
    // Determine which checks to run
    let checkOptions;
    if (options.onlyCritical) {
        checkOptions = {
            checkTerminal: !options.skipTerminal,
            checkParent: !options.skipParent,
            checkNaming: false,
            checkOrder: false
        };
    } else {
        checkOptions = {
            checkTerminal: !options.skipTerminal,
            checkParent: !options.skipParent,
            checkNaming: !options.skipNaming,
            checkOrder: !options.skipOrder
        };
    }
    
    console.log('🔍 Jito Documentation Structure Validator');
    console.log('='.repeat(50));
    
    const validator = new DocStructureValidator(options.path);
    
    console.log(`📁 Scanning documentation at: ${path.resolve(options.path)}`);
    console.log(`📚 Found collections: ${validator.parentCollections.join(', ')}`);
    
    const success = validator.validate(checkOptions);
    
    validator.reportResults();
    
    // Exit with appropriate code
    process.exit(success ? 0 : 1);
}

if (require.main === module) {
    main();
}

module.exports = { DocStructureValidator, DocumentInfo }; 