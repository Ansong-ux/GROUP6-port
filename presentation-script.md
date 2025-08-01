# University of Ghana Student Portal - Technical Presentation Script

## Introduction

Welcome everyone. Today I'll be presenting the University of Ghana Student Portal, a full-stack web application designed to provide students and administrators with a centralized platform for academic services and management.

## System Architecture

The application follows a client-server architecture with:

1. **Frontend**: A Next.js/React application with TypeScript and Tailwind CSS
2. **Backend**: A Spring Boot REST API with Java
3. **Database**: PostgreSQL for data persistence

The frontend communicates with the backend through RESTful API endpoints, while the backend handles all business logic and database operations.

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

### Frontend API Integration

The frontend communicates with the backend through several API routes:

- `/api/auth/login` - Student authentication and registration
- `/api/admin/dashboard-stats` - Admin dashboard statistics
- `/api/admin/logged-students` - List of currently logged-in students

## Backend Overview

The backend is a Spring Boot application written in Java that provides RESTful API endpoints for the frontend. Key features include:

- RESTful API design
- PostgreSQL database integration using JPA/Hibernate
- Maven for dependency management
- Environment-based configuration

### Key Backend Components

1. **Controllers**
   - `AdminController.java` - Handles admin-related endpoints
   - `AuthController.java` - Handles authentication endpoints
   - `StudentController.java` - Handles student-related endpoints

2. **Models**
   - `Student.java` - Student entity with name, ID, and email
   - `Admin.java` - Admin entity with name and ID
   - `LoginSession.java` - Tracks user login sessions

3. **Database Configuration**
   - Configuration in `application.properties`
   - Database connection using environment variables
   - PostgreSQL integration with JPA/Hibernate

## Database Schema

The PostgreSQL database contains several tables:

1. **students** - Stores student information (name, ID, email)
2. **admins** - Stores admin information (name, ID, email)
3. **login_sessions** - Tracks active user sessions

The database is initialized with a default admin user (Maximus, ID: 12345) through the setup script.

## Authentication Flow

### Student Login
1. User enters name, student ID, and email on the frontend
2. Frontend sends data to `/api/auth/login` endpoint
3. Backend validates and stores student information
4. Backend creates a login session
5. Frontend receives user data and stores it in localStorage

### Admin Login
1. User selects "Admin" type and enters "Maximus" and "12345"
2. Frontend validates credentials locally (no backend verification)
3. Frontend creates admin user object with hardcoded email
4. User data is stored in localStorage

## Development Setup

### Backend Setup
1. Navigate to the backend directory
2. Configure database credentials in `application.properties` or use environment variables
3. Run with `mvn spring-boot:run`

### Frontend Setup
1. Navigate to the project root
2. Create `.env.local` with `DATABASE_URL` for direct database connection
3. Install dependencies with `npm install`
4. Start development server with `npm run dev`

## Security Considerations

During development, several security aspects were identified:

1. Admin login is not verified against the database
2. Admin API endpoints lack authentication checks
3. Direct database connections from frontend

These would need to be addressed in a production environment.

## Conclusion

The University of Ghana Student Portal demonstrates a modern full-stack web application with:

- A responsive Next.js frontend
- A robust Spring Boot backend
- PostgreSQL for data persistence
- RESTful API communication

The application successfully provides separate interfaces for students and administrators with distinct functionality for each user type.

Thank you for your attention. I'm happy to answer any questions about the implementation details.
