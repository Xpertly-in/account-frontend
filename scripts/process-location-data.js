const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

// Load environment variables from .env.local
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

// Use environment variables directly (same as in app.constants.ts)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
  console.error("Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Create service role client for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Configuration
const LOCATION_DATA_DIR = path.join(__dirname, "..", "location-data");
const BATCH_SIZE = 1000;
const PROCESSING_DELAY = 100; // ms between batches
const FORCE_REPROCESS = process.argv.includes("--force");

async function processLocationFiles() {
  console.log("🚀 Starting location data processing...");

  // Check if directory exists
  if (!fs.existsSync(LOCATION_DATA_DIR)) {
    console.error(`❌ Directory ${LOCATION_DATA_DIR} does not exist`);
    console.log("Please create the directory and add CSV files to it");
    process.exit(1);
  }

  // Get all CSV files
  const csvFiles = fs
    .readdirSync(LOCATION_DATA_DIR)
    .filter(file => file.endsWith(".csv"))
    .sort();

  if (csvFiles.length === 0) {
    console.log("📁 No CSV files found in location-data directory");
    return;
  }

  console.log(`📋 Found ${csvFiles.length} CSV files to process`);

  for (const fileName of csvFiles) {
    await processFile(fileName);
  }

  console.log("✅ All files processed successfully!");
}

async function processFile(fileName) {
  const filePath = path.join(LOCATION_DATA_DIR, fileName);
  console.log(`\n📄 Processing file: ${fileName}`);

  try {
    // Read and parse CSV
    const csvContent = fs.readFileSync(filePath, "utf8");
    const lines = csvContent.split("\n").filter(line => line.trim());

    if (lines.length <= 1) {
      console.log(`⚠️  Skipping ${fileName} - no data rows found`);
      return;
    }

    // Create file hash for duplicate detection
    const fileHash = crypto.createHash("sha256").update(csvContent.slice(0, 1000)).digest("hex");

    // Check if already processed by file name OR file hash
    const { data: existingImport } = await supabase
      .from("data_imports")
      .select("*")
      .or(`file_name.eq.${fileName},file_hash.eq.${fileHash}`)
      .single();

    if (existingImport && existingImport.status === 'completed') {
      console.log(`⏭️  Skipping ${fileName} - already processed successfully`);
      console.log(`   Original file: ${existingImport.file_name}`);
      console.log(`   Processed at: ${existingImport.created_at}`);
      console.log(`   Records processed: ${existingImport.records_processed}`);
      return;
    }

    if (existingImport && existingImport.status === 'failed' && !FORCE_REPROCESS) {
      console.log(`⚠️  ${fileName} previously failed - use --force to retry`);
      console.log(`   Error: ${existingImport.error_message}`);
      return;
    }

    if (FORCE_REPROCESS && existingImport) {
      console.log(`🔄 Force reprocessing ${fileName} (${existingImport.status})...`);
      // Update existing record instead of deleting
      await supabase
        .from("data_imports")
        .update({ status: 'processing' })
        .eq('id', existingImport.id);
    }

    // Create or update import record
    let importRecord;
    if (existingImport) {
      // Use existing record
      importRecord = existingImport;
    } else {
      // Create new record
      const { data: newRecord, error: importError } = await supabase
        .from("data_imports")
        .insert({
          file_name: fileName,
          file_hash: fileHash,
          status: "processing",
        })
        .select()
        .single();

      if (importError) {
        console.error(`❌ Failed to create import record for ${fileName}:`, importError);
        return;
      }
      importRecord = newRecord;
    }

    // Process the CSV data
    const result = await processLocationData(lines, fileName);

    // Update import record with results
    await supabase
      .from("data_imports")
      .update({
        status: result.success ? "completed" : "failed",
        records_processed: result.stats.statesProcessed + result.stats.districtsProcessed,
        records_skipped: result.stats.recordsSkipped,
        error_message: result.success ? null : result.message,
        completed_at: new Date().toISOString(),
        stats: result.stats,
      })
      .eq("id", importRecord.id);

    if (result.success) {
      console.log(`✅ Successfully processed ${fileName}`);
      console.log(`   States: ${result.stats.statesProcessed}`);
      console.log(`   Districts: ${result.stats.districtsProcessed}`);
      console.log(`   Skipped: ${result.stats.recordsSkipped}`);
    } else {
      console.error(`❌ Failed to process ${fileName}: ${result.message}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);

    // Update import record with error
    await supabase
      .from("data_imports")
      .update({
        status: "failed",
        error_message: error.message,
        completed_at: new Date().toISOString(),
      })
      .eq("file_name", fileName);
  }
}

async function processLocationData(lines, fileName) {
  const stats = {
    statesProcessed: 0,
    districtsProcessed: 0,
    recordsSkipped: 0,
    totalRows: lines.length - 1,
  };

  try {
    console.log(`📊 Processing ${stats.totalRows} rows from ${fileName}`);

    // Parse CSV headers
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    console.log("📋 Headers:", headers);

    // Parse location data
    const locations = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map(v => v.trim().replace(/"/g, ""));

      if (values.length >= 9) {
        const location = {
          circlename: values[0] || "",
          regionname: values[1] || "",
          divisionname: values[2] || "",
          officename: values[3] || "",
          pincode: values[4] || "",
          officetype: values[5] || "",
          delivery: values[6] || "",
          district: values[7] || "",
          statename: values[8] || "",
        };

        if (location.statename && location.district) {
          locations.push(location);
        } else {
          stats.recordsSkipped++;
        }
      } else {
        stats.recordsSkipped++;
      }
    }

    console.log(`📍 Parsed ${locations.length} valid locations`);

    // Process states first
    const uniqueStates = new Map();
    locations.forEach(loc => {
      const stateName = loc.statename.trim();
      if (stateName && !uniqueStates.has(stateName)) {
        // Create unique state code by using first 2 letters + number if needed
        let stateCode = stateName.substring(0, 2).toUpperCase();
        let counter = 1;
        let originalCode = stateCode;

        // Check if code already exists in our map
        const existingCodes = Array.from(uniqueStates.values()).map(s => s.code);
        while (existingCodes.includes(stateCode)) {
          stateCode = originalCode + counter;
          counter++;
        }

        uniqueStates.set(stateName, { name: stateName, code: stateCode });
      }
    });

    // Insert states in batches
    const stateEntries = Array.from(uniqueStates.values());
    console.log(`🏛️  Processing ${stateEntries.length} unique states`);

    for (let i = 0; i < stateEntries.length; i += BATCH_SIZE) {
      const batch = stateEntries.slice(i, i + BATCH_SIZE);

      // Insert states one by one to handle duplicates gracefully
      let batchProcessed = 0;
      for (const state of batch) {
        // Check if state already exists first
        const { data: existingState } = await supabase
          .from("states")
          .select("id")
          .eq("name", state.name)
          .single();

        if (existingState) {
          console.log(`   ✅ State '${state.name}' already exists`);
        } else {
          const { error: stateError } = await supabase
            .from("states")
            .insert([state]);

          if (stateError) {
            console.log(
              `   ⚠️  Failed to insert state '${state.name}': ${stateError.message}`
            );
          } else {
            batchProcessed++;
            console.log(`   ➕ Added new state: ${state.name}`);
          }
        }
      }

      stats.statesProcessed += batchProcessed;
      console.log(
        `   Processed ${Math.min(i + BATCH_SIZE, stateEntries.length)}/${
          stateEntries.length
        } states (${batchProcessed} new)`
      );

      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, PROCESSING_DELAY));
    }

    // Get state IDs for districts
    const { data: statesData } = await supabase.from("states").select("id, name");

    const stateMap = new Map();
    statesData?.forEach(state => {
      stateMap.set(state.name, state.id);
    });

    // Process districts
    const uniqueDistricts = new Map();
    const districtsByState = new Map();

    locations.forEach(loc => {
      const stateId = stateMap.get(loc.statename.trim());
      if (!stateId) return;

      const districtName = loc.district.trim();
      const stateName = loc.statename.trim();
      const districtKey = `${stateId}-${districtName}`;

      if (!uniqueDistricts.has(districtKey)) {
        uniqueDistricts.set(districtKey, {
          state_id: stateId,
          name: districtName,
        });

        // Track districts by state for debugging
        if (!districtsByState.has(stateName)) {
          districtsByState.set(stateName, new Set());
        }
        districtsByState.get(stateName).add(districtName);
      }
    });

    const districtEntries = Array.from(uniqueDistricts.values());
    console.log(`🏘️  Processing ${districtEntries.length} unique districts`);

    // Debug: Show districts per state
    console.log("\n📊 Districts per state:");
    Array.from(districtsByState.entries())
      .sort((a, b) => b[1].size - a[1].size) // Sort by district count descending
      .forEach(([state, districts]) => {
        console.log(`   ${state}: ${districts.size} districts`);
        if (districts.size > 50) {
          // Flag states with unusually high district counts
          console.log(`   ⚠️  ${state} has ${districts.size} districts - this seems high!`);
          // Show first 10 districts for debugging
          const districtList = Array.from(districts).slice(0, 10);
          console.log(`   Sample districts: ${districtList.join(", ")}...`);
        }
      });

    // Insert districts in batches
    for (let i = 0; i < districtEntries.length; i += BATCH_SIZE) {
      const batch = districtEntries.slice(i, i + BATCH_SIZE);

      // Insert districts one by one to handle duplicates gracefully
      let batchProcessed = 0;
      for (const district of batch) {
        // Check if district already exists first
        const { data: existingDistrict } = await supabase
          .from("districts")
          .select("id")
          .eq("name", district.name)
          .eq("state_id", district.state_id)
          .single();

        if (existingDistrict) {
          console.log(`   ✅ District '${district.name}' already exists`);
        } else {
          const { error: districtError } = await supabase
            .from("districts")
            .insert([district]);

          if (districtError) {
            console.log(
              `   ⚠️  Failed to insert district '${district.name}': ${districtError.message}`
            );
          } else {
            batchProcessed++;
            console.log(`   ➕ Added new district: ${district.name}`);
          }
        }
      }

      stats.districtsProcessed += batchProcessed;
      console.log(
        `   Processed ${Math.min(i + BATCH_SIZE, districtEntries.length)}/${
          districtEntries.length
        } districts (${batchProcessed} new)`
      );

      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, PROCESSING_DELAY));
    }

    return {
      success: true,
      message: "Location data processed successfully",
      stats,
    };
  } catch (error) {
    console.error("Processing error:", error);
    return {
      success: false,
      message: error.message,
      stats,
    };
  }
}

// Run the script
if (require.main === module) {
  processLocationFiles()
    .then(() => {
      console.log("\n🎉 Location data processing completed!");
      process.exit(0);
    })
    .catch(error => {
      console.error("\n💥 Fatal error:", error);
      process.exit(1);
    });
}

module.exports = { processLocationFiles };
