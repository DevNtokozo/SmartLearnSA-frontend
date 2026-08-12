SmartLearnSA Frontend

SmartLearnSA is a South African learning platform frontend built with React, Vite, Tailwind CSS, Axios, React Router, Framer Motion, and Lucide React.

The platform provides separate experiences for students, tutors, and administrators.

Features
Student
Student registration and login
Browse published courses
View course details
View published lessons
View course assignments
Submit assignment answers
Submit assignment file URLs
Update existing submissions
View submission history
View marks
View tutor feedback
Tutor
Tutor registration and login
Tutor dashboard
Create courses
Edit courses
Publish and unpublish courses
Delete courses
Create lessons
Edit lessons
Publish and unpublish lessons
Delete lessons
Create assignments
Edit assignments
Publish and unpublish assignments
Delete assignments
View student submissions
Grade submissions
Provide tutor feedback
Admin
Admin login
Protected admin dashboard
Admin role-based routing
Technology Stack
React
Vite
JavaScript / JSX
React Router DOM
Axios
Framer Motion
Lucide React
Tailwind CSS v4
Project Structure
src/
├── api/
│   ├── axios.js
│   ├── authApi.js
│   ├── assignmentApi.js
│   ├── courseApi.js
│   ├── lessonApi.js
│   └── subjectApi.js
│
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   │
│   └── layout/
│       ├── MainLayout.jsx
│       ├── Navbar.jsx
│       └── Sidebar.jsx
│
├── pages/
│   ├── Home.jsx
│   │
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── admin/
│   │   └── AdminDashboard.jsx
│   │
│   ├── tutor/
│   │   ├── TutorDashboard.jsx
│   │   ├── TutorCourses.jsx
│   │   ├── CreateCourse.jsx
│   │   ├── EditCourse.jsx
│   │   ├── TutorLessons.jsx
│   │   ├── CreateLesson.jsx
│   │   ├── EditLesson.jsx
│   │   ├── TutorAssignments.jsx
│   │   ├── CreateAssignment.jsx
│   │   ├── EditAssignment.jsx
│   │   └── AssignmentSubmissions.jsx
│   │
│   └── student/
│       ├── StudentDashboard.jsx
│       ├── StudentCourses.jsx
│       ├── CourseDetails.jsx
│       ├── LessonDetails.jsx
│       ├── StudentAssignments.jsx
│       ├── AssignmentDetails.jsx
│       └── StudentSubmissions.jsx
│
├── App.jsx
├── main.jsx
└── index.css
Getting Started
Prerequisites

Install:

Node.js
npm
SmartLearnSA Spring Boot backend

The backend should normally run on:

http://localhost:8080
Install dependencies

From the frontend project:

npm install
Start the development server
npm run dev

Vite normally starts at:

http://localhost:5173

If port 5173 is already being used, Vite may use another port such as:

http://localhost:5174
Main Dependencies

Install the main frontend dependencies with:

npm install axios react-router-dom framer-motion lucide-react tailwindcss @tailwindcss/vite
Tailwind CSS

This project uses Tailwind CSS v4.

vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],

    server: {
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false
            }
        }
    }
});
src/index.css
@import "tailwindcss";
API Configuration

Axios uses /api as the base URL.

src/api/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.response.use(
    response => response,
    error => {

        if (error.response?.status === 401) {

            localStorage.removeItem(
                "smartlearn-user"
            );
        }

        return Promise.reject(error);
    }
);

export default api;

During development:

Frontend
    ↓
/api/...
    ↓
Vite Proxy
    ↓
http://localhost:8080/api/...
    ↓
Spring Boot Backend
Authentication

SmartLearnSA uses session-based authentication.

The frontend sends requests with:

withCredentials: true

The backend creates the authenticated Spring Security session.

The authenticated user returned by the backend is represented by AuthResponse:

{
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "STUDENT"
}

The frontend stores the user in:

localStorage

using:

smartlearn-user

Authentication endpoints:

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
Supported Roles

The backend currently defines:

ADMIN
TUTOR
PARENT
STUDENT

The current frontend provides complete portal flows for:

ADMIN
TUTOR
STUDENT

The Parent portal can be added later.

Application Routes
Public
/
 /login
 /register
Tutor
/tutor/dashboard

/tutor/courses
/tutor/courses/create
/tutor/courses/:id/edit

/tutor/lessons
/tutor/lessons/create
/tutor/lessons/:id/edit

/tutor/assignments
/tutor/assignments/create
/tutor/assignments/:id/edit
/tutor/assignments/:id/submissions
Student
/student/dashboard

/student/courses
/student/courses/:id

/student/lessons/:id

/student/assignments
/student/assignments/:id

/student/submissions
Admin
/admin/dashboard
Student Learning Flow
Student Registration
        ↓
Student Login
        ↓
Student Dashboard
        ↓
Courses
        ↓
Course Details
        ↓
Published Lessons
        ↓
Lesson Details
        ↓
Assignments
        ↓
Assignment Details
        ↓
Submit Assignment
        ↓
Tutor Grades Submission
        ↓
Student Views Mark + Feedback
        ↓
My Submissions
Tutor Learning Management Flow
Tutor Registration
        ↓
Tutor Login
        ↓
Tutor Dashboard
        ↓
Create Course
        ↓
Create Lessons
        ↓
Publish Lessons
        ↓
Create Assignments
        ↓
Publish Assignments
        ↓
Students Submit Work
        ↓
View Submissions
        ↓
Grade Submission
        ↓
Provide Feedback
Backend API Integration
Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
Subjects
GET /api/subjects
GET /api/subjects/{id}
Courses
Public / Student
GET /api/courses
GET /api/courses/{id}
Tutor
GET    /api/tutor/courses
POST   /api/tutor/courses
PUT    /api/tutor/courses/{courseId}
PUT    /api/tutor/courses/{id}/publish
PUT    /api/tutor/courses/{id}/unpublish
DELETE /api/tutor/courses/{id}
Lessons
Public / Student
GET /api/courses/{courseId}/lessons
GET /api/lessons/{lessonId}
Tutor
GET    /api/tutor/courses/{courseId}/lessons
POST   /api/tutor/courses/{courseId}/lessons
PUT    /api/tutor/lessons/{lessonId}
PUT    /api/tutor/lessons/{lessonId}/publish
PUT    /api/tutor/lessons/{lessonId}/unpublish
DELETE /api/tutor/lessons/{lessonId}
Assignments
Tutor
GET    /api/tutor/assignments
GET    /api/tutor/courses/{courseId}/assignments
POST   /api/tutor/assignments
PUT    /api/tutor/assignments/{assignmentId}
PUT    /api/tutor/assignments/{assignmentId}/publish
PUT    /api/tutor/assignments/{assignmentId}/unpublish
DELETE /api/tutor/assignments/{assignmentId}
Student
GET /api/student/assignments
GET /api/assignments/{assignmentId}
Assignment Submissions
Student
POST /api/student/assignments/{assignmentId}/submit
GET  /api/student/assignments/{assignmentId}/submission
GET  /api/student/submissions
Tutor
GET /api/tutor/assignments/{assignmentId}/submissions
PUT /api/tutor/submissions/{submissionId}/grade
Course Structure

Courses are associated with:

Course
├── Subject
├── Grade
├── Curriculum
├── Tutor
├── Lessons
└── Assignments

Supported grades:

GRADE_R
GRADE_1
GRADE_2
GRADE_3
GRADE_4
GRADE_5
GRADE_6
GRADE_7
GRADE_8
GRADE_9
GRADE_10
GRADE_11
GRADE_12
Frontend Components
ProtectedRoute

ProtectedRoute.jsx protects pages according to the logged-in user's role.

Example:

<ProtectedRoute
    allowedRoles={["TUTOR"]}
/>
MainLayout

Provides:

Navbar
Sidebar
Main application content
Navbar

Provides:

SmartLearn branding
Current user
Logout
Sidebar

Provides role-specific navigation for:

TUTOR
STUDENT
ADMIN
Assignment Submission

Students can submit:

Answer

or:

File URL

or both.

The backend validates that at least one is supplied.

A submission can be updated before grading again, and the updated submission resets:

Mark
Feedback
Graded At

so that changed work can be reviewed again.

Tutor Grading

Tutors can provide:

Mark
Feedback

The mark cannot be negative and cannot exceed the assignment's total marks.

Example:

{
    "mark": 42,
    "feedback": "Good work. Show more working in question 3."
}
Development Commands

Start development server:

npm run dev

Create production build:

npm run build

Preview production build:

npm run preview
Common Development Issues
Axios cannot be resolved

Install:

npm install axios
React Router cannot be resolved

Install:

npm install react-router-dom
Tailwind cannot be resolved

Install:

npm install tailwindcss @tailwindcss/vite
Vite cannot resolve a page import

Check that the referenced file actually exists.

For example:

import TutorCourses from "./pages/tutor/TutorCourses";

requires:

src/pages/tutor/TutorCourses.jsx
Vite says port 5173 is already in use

Stop the other Vite process with:

Ctrl + C

or use the alternate port Vite provides.

API returns 404

Check:

Spring Boot is running.
Spring Boot is running on port 8080.
vite.config.js contains the /api proxy.
Axios uses baseURL: "/api".
Production Build

Run:

npm run build

The compiled frontend will be placed in:

dist/

For production deployment, configure the hosting platform so /api requests point to the deployed Spring Boot backend.

Future Features

Possible future modules include:

Parent portal
Admin user management
Admin course management
Tutor management
Student progress tracking
Course enrollment
Notifications
Search and filtering
Profile management
File uploads
Assignment analytics
Progress dashboards
Curriculum-specific learning paths
Playwright frontend testing
Responsive mobile navigation
Development Architecture

The frontend follows a simple separation of concerns:

Pages
  ↓
API layer
  ↓
Axios
  ↓
Vite proxy
  ↓
Spring Boot REST API
  ↓
Service layer
  ↓
Repository
  ↓
Database

API calls should remain inside:

src/api/

while UI pages remain inside:

src/pages/

Protected role-specific pages should remain behind:

ProtectedRoute
SmartLearnSA

A learning platform focused on structured courses, lessons, assignments, submissions, grading, and feedback for students and tutors.