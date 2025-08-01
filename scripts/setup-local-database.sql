-- University of Ghana Student Portal - Local Database Setup
-- Run this in your local PostgreSQL database

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create login sessions table
CREATE TABLE login_sessions (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    session_status VARCHAR(20) DEFAULT 'active',
    ip_address INET,
    user_agent TEXT
);

-- Create admins table
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    admin_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the default admin (Maximus with ID 12345)
INSERT INTO admins (name, admin_id, email) 
VALUES ('Maximus', '12345', 'admin@ug.edu.gh');

-- Create indexes for better performance
CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_login_sessions_student_id ON login_sessions(student_id);
CREATE INDEX idx_login_sessions_login_time ON login_sessions(login_time);
CREATE INDEX idx_login_sessions_status ON login_sessions(session_status);

-- Create a view for active sessions
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

-- Insert some sample data for testing
INSERT INTO students (name, student_id, email) VALUES
('John Doe', 'UG001', 'john.doe@st.ug.edu.gh'),
('Jane Smith', 'UG002', 'jane.smith@st.ug.edu.gh'),
('Michael Johnson', 'UG003', 'michael.johnson@st.ug.edu.gh');

-- Verify everything was created successfully
\dt
\dv

-- Show sample data
SELECT 'Students:' as table_name;
SELECT * FROM students;

SELECT 'Admins:' as table_name;
SELECT * FROM admins;

SELECT 'Database setup completed successfully!' as status;
