const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables from .env.local
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

// Use environment variables directly
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function clearLocationImports() {
  console.log("🗑️  Clearing location import records...");
  
  try {
    // Get all import records first
    const { data: imports, error: selectError } = await supabase
      .from("data_imports")
      .select("*");

    if (selectError) {
      console.error("Error fetching import records:", selectError);
      return;
    }

    if (!imports || imports.length === 0) {
      console.log("📭 No import records found to clear");
      return;
    }

    console.log(`📋 Found ${imports.length} import records:`);
    imports.forEach(record => {
      console.log(`   - ${record.file_name} (${record.status}) - ${record.created_at}`);
    });

    // Confirm deletion
    const shouldDelete = process.argv.includes("--confirm");
    if (!shouldDelete) {
      console.log("\n⚠️  Add --confirm flag to actually delete these records");
      console.log("Example: npm run clear-location-imports -- --confirm");
      return;
    }

    // Delete all import records
    const { error: deleteError } = await supabase
      .from("data_imports")
      .delete()
      .neq("id", 0); // Delete all records

    if (deleteError) {
      console.error("Error deleting import records:", deleteError);
      return;
    }

    console.log("✅ All location import records cleared successfully!");
    
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  clearLocationImports()
    .then(() => {
      console.log("\n🎉 Clear operation completed!");
      process.exit(0);
    })
    .catch(error => {
      console.error("\n💥 Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { clearLocationImports }; 