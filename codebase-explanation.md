# University of Ghana Student Portal - Codebase Explanation

## Overview

This is a full-stack web application built with:

- **Frontend**: Next.js (React) with TypeScript and Tailwind CSS
- **Backend**: Spring Boot (Java) with PostgreSQL
- **Database**: PostgreSQL (both local and cloud via Supabase)

## Project Structure

```
fold /
├── backend/                 # Spring Boot Java backend
│   ├── src/main/java/com/ug/portal/
│   │   ├── UgStudentPortalApplication.java  # Main application class
│   │   ├── controller/                      # REST API controllers
│   │   ├── model/                           # Database entity models
│   │   ├── repository/                      # Database repositories
│   │   └── service/                         # Business logic services
│   ├── src/main/resources/
│   │   └── application.properties           # Backend configuration
│   └── pom.xml                              # Maven dependencies
├── app/                     # Next.js frontend pages
├── components/              # React components
├── lib/                     # Shared libraries (database connection)
├── public/                  # Static assets
└── scripts/                 # Database setup scripts
```

## Backend (Spring Boot - Java)

### Dependencies (pom.xml)

The backend uses Maven for dependency management with these key dependencies:

1. **Spring Boot Starters**:
   - `spring-boot-starter-web`: For building web applications
     - Includes Tomcat web server and Spring MVC
     - Provides RESTful services capabilities
   - `spring-boot-starter-data-jpa`: For database operations with JPA/Hibernate
     - Object-relational mapping (ORM) framework
     - Database abstraction layer
   - `spring-boot-starter-validation`: For input validation
     - Bean validation API implementation
     - Constraint annotations for data validation

2. **Database**:
   - `postgresql`: PostgreSQL JDBC driver
     - Official PostgreSQL JDBC driver
     - Required for connecting to PostgreSQL database

3. **Development Tools**:
   - `spring-boot-devtools`: Development-time features
     - Automatic restart when code changes
     - Live reload of browser pages
     - Remote development support
   - `spring-boot-starter-test`: Testing framework
     - JUnit 5 for unit testing
     - Mockito for mocking framework
     - AssertJ for fluent assertions

4. **Utilities**:
   - `jackson-databind`: JSON processing
     - JSON serialization and deserialization
     - Object to JSON conversion
   - `spring-boot-starter-logging`: Logging framework
     - SLF4J logging facade
     - Logback implementation
     - Structured application logging

5. **Version Information**:
   - Spring Boot Parent Version: 3.2.0
   - Java Version: 17
   - These versions ensure compatibility with modern Java features and Spring Boot capabilities

### Main Application Class

`UgStudentPortalApplication.java` is the entry point that starts the Spring Boot application.

### Models

1. **Student** (`Student.java`):
   - Represents a student entity
   - Fields: id, name, studentId, email, createdAt, updatedAt
   - Maps to `students` table in database

2. **LoginSession** (`LoginSession.java`):
   - Tracks student login sessions
   - Fields: id, studentId, name, email, loginTime, logoutTime, sessionStatus, ipAddress, userAgent
   - Maps to `login_sessions` table in database

### Repositories

1. **StudentRepository** (`StudentRepository.java`):
   - Extends JpaRepository for CRUD operations on Student entities
   - Custom queries for finding students by ID/email and counting total students

2. **LoginSessionRepository** (`LoginSessionRepository.java`):
   - Extends JpaRepository for CRUD operations on LoginSession entities
   - Custom queries for active sessions, counting logins, etc.

### Services

**StudentService** (`StudentService.java`):
- Business logic layer that uses repositories
- Handles student creation/update and session management
- Manages active login sessions

### Controllers

1. **AuthController** (`AuthController.java`):
   - Handles student authentication
   - POST `/api/auth/login` - Processes student login requests
   - Validates input and creates/updates student records
   - Tracks login sessions in database

2. **AdminController** (`AdminController.java`):
   - Handles admin dashboard functionality
   - GET `/api/admin/logged-students` - Returns active student sessions
   - GET `/api/admin/dashboard-stats` - Returns dashboard statistics

### Configuration

`application.properties` contains database configuration:
- Database URL, username, password
- JPA/Hibernate settings

## Frontend (Next.js - TypeScript)

### Dependencies (package.json)

Key frontend dependencies include:

1. **React UI Libraries**:
   - `@radix-ui/*`: UI component primitives
   - `lucide-react`: Icon library
   - `tailwindcss`: CSS framework

2. **Database**:
   - `pg`: PostgreSQL client for Node.js

3. **Forms & Validation**:
   - `react-hook-form`: Form handling
   - `zod`: Schema validation

4. **UI Components**:
   - `recharts`: Charting library
   - `sonner`: Toast notifications

### Database Connection

`lib/db.ts`:
- Uses `pg` library to connect to PostgreSQL
- Gets connection string from `DATABASE_URL` environment variable
- Handles SSL configuration for production

### API Routes

Frontend implements its own API routes that communicate with the database:

1. **Authentication**:
   - `app/api/auth/login/route.ts`: Handles student login
   - Validates input and interacts with database directly

2. **Admin Dashboard**:
   - `app/api/admin/logged-students/route.ts`: Returns active sessions
   - `app/api/admin/dashboard-stats/route.ts`: Returns dashboard statistics

### Components

1. **LoginPage** (`components/login-page.tsx`):
   - Handles both student and admin login
   - Student login sends data to backend API
   - Admin login is handled client-side (hardcoded credentials)

2. **StudentDashboard** (`components/student-dashboard.tsx`):
   - Displays student information and session data

3. **AdminDashboard** (`components/admin-dashboard.tsx`):
   - Shows dashboard statistics and active student sessions

### Main Application Flow

`app/page.tsx`:
- Main application component
- Handles authentication state
- Renders login page or appropriate dashboard based on user role

## Database Schema

Defined in `scripts/setup-local-database.sql`:

1. **students table**:
   - Stores student information
   - Fields: 
     - `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
     - `name` (VARCHAR(255) NOT NULL): Student's full name
     - `student_id` (VARCHAR(50) UNIQUE NOT NULL): Unique student identifier
     - `email` (VARCHAR(255) UNIQUE NOT NULL): Student's email address
     - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP): Record creation timestamp
     - `updated_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP): Record last update timestamp

2. **login_sessions table**:
   - Tracks student login sessions
   - Fields:
     - `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
     - `student_id` (VARCHAR(50) NOT NULL): References student's ID
     - `name` (VARCHAR(255) NOT NULL): Student's name at time of login
     - `email` (VARCHAR(255) NOT NULL): Student's email at time of login
     - `login_time` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP): Login timestamp
     - `logout_time` (TIMESTAMP NULL): Logout timestamp (NULL if still logged in)
     - `session_status` (VARCHAR(20) DEFAULT 'active'): Session status (active/inactive)
     - `ip_address` (INET): IP address of client at login
     - `user_agent` (TEXT): Browser user agent string
     - Foreign key constraint referencing students table

3. **admins table**:
   - Stores admin user information
   - Fields:
     - `id` (SERIAL PRIMARY KEY): Auto-incrementing unique identifier
     - `name` (VARCHAR(255) NOT NULL): Admin's full name
     - `admin_id` (VARCHAR(50) UNIQUE NOT NULL): Unique admin identifier
     - `email` (VARCHAR(255) UNIQUE NOT NULL): Admin's email address
     - `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP): Record creation timestamp

## Deployment Architecture

1. **Frontend**:
   - Deployed on Vercel as a Next.js application
   - Connects directly to PostgreSQL database using environment variables
   - Uses `DATABASE_URL` environment variable for database connection
   - Environment variables configured in Vercel dashboard
   - Automatic SSL termination at Vercel edge

2. **Backend**:
   - Spring Boot REST API packaged as JAR file
   - Can be deployed to cloud platforms (Heroku, AWS, Google Cloud, etc.)
   - Connects to PostgreSQL database using Spring configuration
   - Uses environment variables for database configuration
   - Currently only running locally

3. **Database**:
   - Local PostgreSQL for development (localhost:5432)
   - Supabase PostgreSQL for production
   - Connection string format: `postgresql://username:password@host:port/database`
   - SSL required for Supabase connections
   - Database schema must be manually created using setup script

## Key Features

1. **Student Login**:
   - Students enter name, ID, and email
   - Data stored in database
   - Login session tracked

2. **Admin Login**:
   - Currently hardcoded client-side (name: "Maximus", ID: "12345")
   - No backend verification

3. **Student Dashboard**:
   - Shows student information
   - Displays login session history

4. **Admin Dashboard**:
   - Shows dashboard statistics
   - Lists currently logged-in students

## Security Considerations

1. **Current Issues**:
   - Admin login is not verified against database
   - No password authentication for students
   - Database credentials in environment variables

2. **Improvements Needed**:
   - Implement proper admin authentication
   - Add password hashing for student accounts
   - Use proper SSL certificates in production

## Current Deployment Status

1. **Frontend**: Deployed on Vercel at https://portal-ten-ecru.vercel.app
2. **Database**: Set up on Supabase at https://jgxprocnstpcaemuvudh.supabase.co
3. **Backend**: Running locally only

## Troubleshooting Notes

1. **Database Connection Issues**:
   - Ensure DATABASE_URL includes SSL parameters for Supabase: `?sslmode=require`
   - Check that database schema is set up in Supabase by running the setup script
   - Verify special characters in password are URL-encoded (e.g., `?` becomes `%3F`)
   - Confirm Supabase database is not paused
   - Check that connection pooling is enabled in Supabase settings
   - Verify the connection string format: `postgresql://username:password@host:port/database?sslmode=require`

2. **Frontend Issues**:
   - Check Vercel environment variables are correctly set
   - Review Vercel deployment logs for runtime errors (not just build errors)
   - Test the database connection using the `/api/test-db` endpoint
   - Verify the DATABASE_URL environment variable is accessible in the frontend code

3. **Backend Issues**:
   - When deploying the Spring Boot backend, ensure environment variables are set:
     - `SPRING_DATASOURCE_URL`
     - `SPRING_DATASOURCE_USERNAME`
     - `SPRING_DATASOURCE_PASSWORD`
   - Check that the backend can connect to the Supabase database
   - Verify CORS settings allow requests from the frontend domain

4. **Common Solutions**:
   - For SSL connection issues: Add `?sslmode=require` to the connection string
   - For authentication issues: URL-encode special characters in passwords
   - For connection timeouts: Check firewall settings and database availability
   - For schema issues: Run the setup script in Supabase SQL editor

5. **Testing Database Connection**:
   - Use the test endpoint: `https://your-app.vercel.app/api/test-db`
   - Create a simple Node.js script to test the connection locally
   - Check Supabase connection logs in the dashboard

This comprehensive overview should help your group understand the entire codebase structure and functionality, as well as troubleshoot common deployment issues.
