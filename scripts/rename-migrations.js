#!/usr/bin/env node

/**
 * Migration File Renaming Script
 *
 * This script renames SQL migration files to include sequential prefixes (001-, 002-, etc.)
 * based on their chronological order determined by date suffixes in filenames.
 *
 * Usage: node scripts/rename-migrations.js [--dry-run] [--confirm]
 *
 * Options:
 *   --dry-run    Show what would be renamed without actually renaming files
 *   --confirm    Skip confirmation prompt and proceed with renaming
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Configuration
const MIGRATIONS_DIR = path.join(__dirname, "..", "src", "migrations");
const DRY_RUN = process.argv.includes("--dry-run");
const AUTO_CONFIRM = process.argv.includes("--confirm");

/**
 * Extract date from filename in format YYYY-MM-DD
 * @param {string} filename - The filename to extract date from
 * @returns {Date|null} - Parsed date or null if no date found
 */
function extractDateFromFilename(filename) {
  // Match pattern: YYYY-MM-DD
  const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
  if (dateMatch) {
    return new Date(dateMatch[1]);
  }
  return null;
}

/**
 * Determine sort order for migration files
 * Priority: date (if present) > alphabetical order
 * @param {string} a - First filename
 * @param {string} b - Second filename
 * @returns {number} - Sort comparison result
 */
function sortMigrationFiles(a, b) {
  const dateA = extractDateFromFilename(a);
  const dateB = extractDateFromFilename(b);

  // If both have dates, sort by date
  if (dateA && dateB) {
    return dateA.getTime() - dateB.getTime();
  }

  // If only one has a date, prioritize the one with date
  if (dateA && !dateB) return 1; // A comes after B (files with dates are newer)
  if (!dateA && dateB) return -1; // A comes before B

  // If neither has a date, sort alphabetically
  return a.localeCompare(b);
}

/**
 * Check if filename already has a sequential prefix
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if already has prefix
 */
function hasSequentialPrefix(filename) {
  return /^\d{3}-/.test(filename);
}

/**
 * Generate new filename with sequential prefix
 * @param {string} originalFilename - Original filename
 * @param {number} index - Sequential index (0-based)
 * @returns {string} - New filename with prefix
 */
function generateNewFilename(originalFilename, index) {
  // Generate three-digit prefix (001, 002, etc.)
  const prefix = String(index + 1).padStart(3, "0");

  // If file already has a prefix, remove it first
  const cleanFilename = originalFilename.replace(/^\d{3}-/, "");

  return `${prefix}-${cleanFilename}`;
}

/**
 * Prompt user for confirmation
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>} - True if user confirms
 */
function askConfirmation(message) {
  if (AUTO_CONFIRM) return Promise.resolve(true);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(`${message} (y/N): `, answer => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Main function to rename migration files
 */
async function renameMigrationFiles() {
  console.log("🔍 Migration File Renaming Script");
  console.log("==================================\n");

  // Step 1: Read all SQL files from migrations directory
  console.log("📂 Reading migration files from:", MIGRATIONS_DIR);

  let files;
  try {
    files = fs.readdirSync(MIGRATIONS_DIR);
  } catch (error) {
    console.error("❌ Error reading migrations directory:", error.message);
    process.exit(1);
  }

  // Step 2: Filter SQL files and exclude README
  const sqlFiles = files.filter(file => file.endsWith(".sql") && file !== "README.md");

  if (sqlFiles.length === 0) {
    console.log("ℹ️  No SQL migration files found.");
    return;
  }

  console.log(`📋 Found ${sqlFiles.length} migration files:\n`);
  sqlFiles.forEach((file, index) => {
    const date = extractDateFromFilename(file);
    const dateStr = date ? ` (${date.toISOString().split("T")[0]})` : " (no date)";
    console.log(`   ${index + 1}. ${file}${dateStr}`);
  });

  // Step 3: Sort files by date/alphabetical order
  console.log("\n🔄 Sorting files by chronological order...");

  const sortedFiles = [...sqlFiles].sort(sortMigrationFiles);

  console.log("\n📋 Proposed execution order:\n");

  // Step 4: Generate rename plan
  const renameOperations = [];
  let hasChanges = false;

  sortedFiles.forEach((file, index) => {
    const newFilename = generateNewFilename(file, index);
    const isRenamed = file !== newFilename;

    if (isRenamed) {
      hasChanges = true;
    }

    renameOperations.push({
      original: file,
      new: newFilename,
      needsRename: isRenamed,
    });

    const status = isRenamed ? "🔄 RENAME" : "✅ OK";
    console.log(`   ${String(index + 1).padStart(3, "0")}. ${status} ${file}`);
    if (isRenamed) {
      console.log(`        → ${newFilename}`);
    }
  });

  // Step 5: Check if any changes are needed
  if (!hasChanges) {
    console.log("\n✅ All migration files already have correct sequential prefixes!");
    return;
  }

  // Step 6: Show summary and ask for confirmation
  const filesToRename = renameOperations.filter(op => op.needsRename);
  console.log(`\n📊 Summary:`);
  console.log(`   • Total files: ${renameOperations.length}`);
  console.log(`   • Files to rename: ${filesToRename.length}`);
  console.log(`   • Files already correct: ${renameOperations.length - filesToRename.length}`);

  if (DRY_RUN) {
    console.log("\n🔍 DRY RUN: No files will be renamed (use without --dry-run to execute)");
    return;
  }

  console.log("\n⚠️  WARNING: This will rename migration files in your project!");
  console.log("   Make sure you have committed your changes or have a backup.");

  const confirmed = await askConfirmation("\nProceed with renaming files?");

  if (!confirmed) {
    console.log("❌ Operation cancelled by user.");
    return;
  }

  // Step 7: Execute rename operations
  console.log("\n🚀 Renaming files...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const operation of renameOperations) {
    if (!operation.needsRename) continue;

    const oldPath = path.join(MIGRATIONS_DIR, operation.original);
    const newPath = path.join(MIGRATIONS_DIR, operation.new);

    try {
      fs.renameSync(oldPath, newPath);
      console.log(`✅ ${operation.original} → ${operation.new}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to rename ${operation.original}: ${error.message}`);
      errorCount++;
    }
  }

  // Step 8: Show final results
  console.log("\n🎉 Renaming completed!");
  console.log(`   • Successfully renamed: ${successCount} files`);
  if (errorCount > 0) {
    console.log(`   • Errors: ${errorCount} files`);
  }

  console.log("\n💡 Next steps:");
  console.log("   1. Update your migration documentation");
  console.log("   2. Update any scripts that reference specific migration files");
  console.log("   3. Consider updating the migrations README.md with the new naming convention");
}

// Execute the script
if (require.main === module) {
  renameMigrationFiles().catch(error => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });
}

module.exports = { renameMigrationFiles, extractDateFromFilename, sortMigrationFiles };
