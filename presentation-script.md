# University of Ghana Student Portal - Technical Presentation Script

## Introduction

Welcome everyone. Today I'll be presenting the University of Ghana Student Portal, a full-stack web application designed to provide students and administrators with a centralized platform for academic services and management.

## System Architecture

The application follows a client-server architecture with:

1. **Frontend**: A Next.js/React application with TypeScript and Tailwind CSS
2. **Backend**: A Spring Boot REST API with Java
3. **Database**: PostgreSQL for data persistence

The frontend communicates with the backend through RESTful API endpoints, while the backend handles all business logic and database operations.

## Technology Stack Overview

For our group presentation, each member can explain a specific component of our technology stack:

### Backend - Spring Boot (Java)
**File Reference: `/backend/pom.xml`**

Our backend is built with Spring Boot 3.2.0 and requires Java 17. Key dependencies include:

- **Spring Boot Starters**:
  - `spring-boot-starter-web`: For building web applications and RESTful APIs
  - `spring-boot-starter-data-jpa`: For database operations using JPA/Hibernate
  - `spring-boot-starter-validation`: For input validation
  - `spring-boot-starter-test`: For testing framework

- **Database Driver**:
  - `postgresql`: PostgreSQL JDBC driver for database connectivity

- **Development Tools**:
  - `spring-boot-devtools`: For development-time features like automatic restart

### Frontend - Next.js (TypeScript/React)
**File Reference: `/package.json`**

Our frontend is built with Next.js 15.2.4 and React 19. Key technologies include:

- **Core Framework**:
  - `next`: The React framework for production
  - `react` and `react-dom`: Core React libraries

- **UI Components**:
  - `@radix-ui/*`: Accessible UI primitives
  - `lucide-react`: Icon library
  - `tailwind-merge` and `class-variance-authority`: For styling

- **Database Connection**:
  - `pg`: Node.js PostgreSQL client for direct database connections from API routes

- **Utilities**:
  - `tailwindcss` and `autoprefixer`: For styling
  - `typescript`: For type safety

### Database - PostgreSQL
**File References: `/scripts/setup-local-database.sql` and `/backend/src/main/resources/application.properties`**

Our application uses PostgreSQL as its database with:

- **Configuration**:
  - Database URL: `jdbc:postgresql://localhost:5432/ug_student_portal`
  - Connection managed through Spring's data source configuration

- **Schema**:
  - `students` table: Stores student registration information
  - `login_sessions` table: Tracks user login sessions
  - `admins` table: Contains pre-registered administrative users

## Local Database Setup and Schema

The application uses a PostgreSQL database named `ug_student_portal` with a carefully designed schema to store student information, login sessions, and administrative data.

### Database Tables

1. **Students Table** (`students`)
   - Stores student registration information
   - Columns: `id` (primary key), `name`, `student_id` (unique), `email` (unique), `created_at`, `updated_at`
   - The application automatically registers new students during their first login
   - Updates existing student information if they log in again with the same student ID

2. **Login Sessions Table** (`login_sessions`)
   - Tracks all user login sessions for security and analytics
   - Columns: `id` (primary key), `student_id`, `name`, `email`, `login_time`, `logout_time`, `session_status`, `ip_address`, `user_agent`
   - Maintains active sessions to show currently logged-in users
   - Records IP address and user agent for security monitoring

3. **Admins Table** (`admins`)
   - Contains pre-registered administrative users
   - Columns: `id` (primary key), `name`, `admin_id` (unique), `email`, `created_at`
   - Includes a default admin user (Maximus with ID 12345) for demonstration purposes

### Database Indexes and Views

For improved performance, the database includes several indexes:
- Index on `student_id` in the students table for fast lookups
- Index on `email` in the students table for email validation
- Index on `student_id` in the login sessions table for session tracking
- Index on `login_time` in the login sessions table for time-based queries
- Index on `session_status` in the login sessions table for active session queries

Additionally, a database view `active_login_sessions` is created to simplify queries for currently active user sessions.

## Frontend Overview

The frontend is built with Next.js, a React framework that provides server-side rendering and other performance optimizations. Key features include:

- Responsive design using Tailwind CSS
- TypeScript for type safety
- Client-side routing
- Component-based architecture

### Key Frontend Components

1. **Login Page** (`/components/login-page.tsx`)
   - Handles both student and admin authentication
   - For students: Requires name, student ID, and email
   - For admins: Requires only name ("Maximus") and admin ID ("12345")
   - Admin login is handled entirely on the frontend without backend verification

2. **Student Dashboard** (`/components/student-dashboard.tsx`)
   - Displays student information and academic services
   - Provides access to registration, course selection, and grade viewing

3. **Admin Dashboard** (`/components/admin-dashboard.tsx`)
   - Shows system statistics and logged-in students
   - Allows administrators to monitor system usage

### Frontend Database Integration

The frontend communicates with the PostgreSQL database through a connection pool configured in `/lib/db.ts`. This pool manages database connections efficiently and securely.

#### API Routes

The frontend uses Next.js API routes to interact with the database:

1. **Student Authentication** (`/app/api/auth/login/route.ts`)
   - Inserts or updates student records in the `students` table
   - Records login sessions in the `login_sessions` table
   - Returns session information to the client

2. **Admin Dashboard Statistics** (`/app/api/admin/dashboard-stats/route.ts`)
   - Queries the database for system statistics
   - Returns counts of active sessions, total students, and today's logins

3. **Logged Students List** (`/app/api/admin/logged-students/route.ts`)
   - Retrieves active login sessions from the database
   - Joins with student data to provide comprehensive information

## Backend Overview

The backend is built with Spring Boot and uses Spring Data JPA for database interactions. It provides RESTful APIs that the frontend consumes.

### Backend Database Integration

The backend connects to the same PostgreSQL database through configuration in `application.properties`:
- Database URL: `jdbc:postgresql://localhost:5432/ug_student_portal`
- Connection pooling managed by Spring Boot

### Key Backend Components

1. **Entity Models**
   - `Student` entity maps to the `students` table
   - `LoginSession` entity maps to the `login_sessions` table
   - JPA annotations define the database schema and relationships

2. **Repositories**
   - `StudentRepository` provides CRUD operations for students
   - `LoginSessionRepository` manages login session data
   - Custom query methods for specific data retrieval needs

3. **Services**
   - `StudentService` contains business logic for student operations
   - Handles student registration and login session recording
   - Provides methods for retrieving dashboard statistics

4. **Controllers**
   - `AuthController` handles student authentication
   - `AdminController` provides endpoints for admin dashboard data

## Local Development Setup

To run the application locally:

1. Install PostgreSQL and create the `ug_student_portal` database
2. Run the `setup-local-database.sql` script to create tables and sample data
3. Update `application.properties` with your database credentials
4. Start the Spring Boot backend with `mvn spring-boot:run`
5. Start the Next.js frontend with `npm run dev`

The application will be accessible at `http://localhost:3000` with the backend API running at `http://localhost:8080`.

## Security Features

The application implements several security measures related to database interactions:

- Prepared statements to prevent SQL injection attacks
- Connection pooling for efficient resource management
- Session tracking to monitor user activity
- IP address and user agent logging for security auditing

## Conclusion

The University of Ghana Student Portal demonstrates a well-architected full-stack application with a robust database design. The PostgreSQL database serves as the central data store, with both frontend and backend components interacting with it through secure, efficient mechanisms.

Each group member can focus on explaining their respective component:
- Backend dependencies and Spring Boot configuration (`/backend/pom.xml`)
- Frontend stack and dependencies (`/package.json`)
- Database schema and setup (`/scripts/setup-local-database.sql`)

Thank you for your attention. I'm happy to answer any questions about the implementation details.
