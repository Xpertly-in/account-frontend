# Location Data Processing

This script processes CSV files containing Indian postal location data and imports them into Supabase database.

## Setup

1. **Create location-data directory:**

   ```bash
   mkdir location-data
   ```

2. **Add your CSV files:**
   Place your CSV files in the `location-data` directory. The script will process all `.csv` files in this directory.

3. **Environment variables:**
   Make sure you have the following environment variables set:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Usage

Run the location processing script:

```bash
npm run process-locations
```

## CSV Format

The script expects CSV files with the following columns (in order):

1. `circlename` - Postal circle name
2. `regionname` - Region name
3. `divisionname` - Division name
4. `officename` - Post office name
5. `pincode` - PIN code
6. `officetype` - Office type
7. `delivery` - Delivery status
8. `district` - District name
9. `statename` - State name

## Features

- **Batch Processing**: Processes data in batches of 1000 records to avoid overwhelming the database
- **Duplicate Detection**: Uses file hashing to avoid processing the same file twice
- **Progress Tracking**: Shows detailed progress for states and districts processing
- **Error Handling**: Gracefully handles errors and continues processing other files
- **Resume Support**: Can resume processing if interrupted (skips already processed files)

## Database Tables

The script populates two main tables:

### States Table

- `id` - Primary key
- `name` - State name
- `code` - State code (first 2 letters)
- `created_at` - Timestamp

### Districts Table

- `id` - Primary key
- `name` - District name
- `state_id` - Foreign key to states table
- `created_at` - Timestamp

### Data Imports Table

- `id` - Primary key
- `file_name` - Name of processed file
- `file_hash` - Hash for duplicate detection
- `status` - Processing status (pending/processing/completed/failed)
- `records_processed` - Number of records successfully processed
- `records_skipped` - Number of records skipped
- `stats` - JSON with processing statistics
- `created_at` - Timestamp
- `completed_at` - Completion timestamp

## Architecture

The location processing system uses a **local-first approach**:

1. **CSV files** are placed in the `location-data/` directory
2. **Node.js script** processes files locally with full control
3. **Batch processing** prevents database overload
4. **Duplicate detection** ensures data integrity
5. **Supabase database** stores the processed location data

This approach avoids the limitations of edge functions (timeouts, memory limits) and provides reliable processing of large datasets.

## Example Output

```
🚀 Starting location data processing...
📋 Found 1 CSV files to process

📄 Processing file: location-data.csv
📊 Processing 150000 rows from location-data.csv
📋 Headers: ['circlename', 'regionname', 'divisionname', ...]
📍 Parsed 149500 valid locations
🏛️  Processing 36 unique states
   Processed 36/36 states
🏘️  Processing 640 unique districts
   Processed 640/640 districts
✅ Successfully processed location-data.csv
   States: 36
   Districts: 640
   Skipped: 500

✅ All files processed successfully!
🎉 Location data processing completed!
```

## Troubleshooting

- **Missing environment variables**: Make sure Supabase URL and service role key are set
- **File not found**: Ensure CSV files are in the `location-data` directory
- **Database errors**: Check Supabase connection and table structure
- **Memory issues**: The script processes files in batches to avoid memory problems

## Performance

- Processes approximately 1000 records per batch
- Includes 100ms delay between batches to prevent overwhelming the database
- Can handle large CSV files (tested with 150k+ records)
- Duplicate detection prevents reprocessing the same data
