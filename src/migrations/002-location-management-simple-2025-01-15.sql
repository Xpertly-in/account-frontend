-- Drop existing tables if they exist
DROP TABLE IF EXISTS states CASCADE;
DROP TABLE IF EXISTS districts CASCADE;
DROP TABLE IF EXISTS data_imports CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

-- Create simplified states table
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name),
    UNIQUE(code)
);

-- Create simplified districts table
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, state_id) -- Unique district per state
);

-- Create indexes for better performance
CREATE INDEX idx_districts_state_id ON districts(state_id);
CREATE INDEX idx_districts_name ON districts(name);
CREATE INDEX idx_states_name ON states(name);
CREATE INDEX idx_states_code ON states(code);

-- Create data imports tracking table
CREATE TABLE data_imports (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    stats JSONB,
    UNIQUE(file_hash)
);

-- Processing queue table removed - using local processing instead

-- Enable RLS
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_imports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access for states" ON states FOR SELECT USING (true);
CREATE POLICY "Public read access for districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public read access for data_imports" ON data_imports FOR SELECT USING (true);

-- Create RLS policies for service role
CREATE POLICY "Service role full access for states" ON states FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for districts" ON districts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access for data_imports" ON data_imports FOR ALL USING (auth.role() = 'service_role');

-- Drop existing functions (no longer needed with local processing)
DROP FUNCTION IF EXISTS get_latest_location_file() CASCADE;
DROP FUNCTION IF EXISTS trigger_location_processing() CASCADE;
DROP FUNCTION IF EXISTS check_processing_status() CASCADE;
DROP FUNCTION IF EXISTS list_location_files() CASCADE;

-- States and districts will be populated from CSV data only 