-- University of Ghana Student Portal Database Setup
-- PostgreSQL Database Schema

-- Create database (run this first)
CREATE DATABASE ug_student_portal;

-- Connect to the database and run the following:

-- Students table to store student information and login records
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login sessions table to track student logins
CREATE TABLE login_sessions (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    session_status VARCHAR(20) DEFAULT 'active',
    ip_address INET,
    user_agent TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Admins table for admin users
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    admin_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (Maximus with ID 12345)
INSERT INTO admins (name, admin_id, email, password_hash) 
VALUES ('Maximus', '12345', 'admin@ug.edu.gh', 'hashed_password_here');

-- Create indexes for better performance
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_login_sessions_student_id ON login_sessions(student_id);
CREATE INDEX idx_login_sessions_login_time ON login_sessions(login_time);
CREATE INDEX idx_login_sessions_status ON login_sessions(session_status);

-- Create a view for active login sessions
CREATE VIEW active_login_sessions AS
SELECT 
    ls.id,
    ls.student_id,
    ls.name,
    ls.email,
    ls.login_time,
    ls.session_status,
    s.created_at as student_registered_at
FROM login_sessions ls
LEFT JOIN students s ON ls.student_id = s.student_id
WHERE ls.session_status = 'active'
ORDER BY ls.login_time DESC;

-- Function to automatically insert/update student on login
CREATE OR REPLACE FUNCTION handle_student_login(
    p_name VARCHAR(255),
    p_student_id VARCHAR(50),
    p_email VARCHAR(255),
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    session_id INTEGER;
BEGIN
    -- Insert or update student record
    INSERT INTO students (name, student_id, email, updated_at)
    VALUES (p_name, p_student_id, p_email, CURRENT_TIMESTAMP)
    ON CONFLICT (student_id) 
    DO UPDATE SET 
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        updated_at = CURRENT_TIMESTAMP;
    
    -- Create login session
    INSERT INTO login_sessions (student_id, name, email, ip_address, user_agent)
    VALUES (p_student_id, p_name, p_email, p_ip_address, p_user_agent)
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get logged in students for admin
CREATE OR REPLACE FUNCTION get_logged_students(
    p_limit INTEGER DEFAULT 100,
    p_offset INTEGER DEFAULT 0
) RETURNS TABLE (
    id INTEGER,
    student_id VARCHAR(50),
    name VARCHAR(255),
    email VARCHAR(255),
    login_time TIMESTAMP,
    session_status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ls.id,
        ls.student_id,
        ls.name,
        ls.email,
        ls.login_time,
        ls.session_status
    FROM login_sessions ls
    WHERE ls.session_status = 'active'
    ORDER BY ls.login_time DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON admins 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
INSERT INTO students (name, student_id, email) VALUES
('John Doe', 'UG001', 'john.doe@st.ug.edu.gh'),
('Jane Smith', 'UG002', 'jane.smith@st.ug.edu.gh'),
('Michael Johnson', 'UG003', 'michael.johnson@st.ug.edu.gh');

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON DATABASE ug_student_portal TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
