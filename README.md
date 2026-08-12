SmartLearnSA Frontend

SmartLearnSA is a South African learning platform frontend built with React and Vite. The application provides separate learning and management experiences for students, tutors, and administrators.

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

View marks and tutor feedback

Tutor

Tutor registration and login

Tutor dashboard

Create, edit, publish, unpublish, and delete courses

Create, edit, publish, unpublish, and delete lessons

Associate assignments with courses and lessons

Create, edit, publish, unpublish, and delete assignments

View student submissions

Grade submissions

Provide tutor feedback

Admin

Admin authentication and protected dashboard structure

Admin role-based routing

Dashboard shell for future administration features

Technology Stack

React

Vite

React Router DOM

Axios

Framer Motion

Lucide React

Tailwind CSS v4

JavaScript / JSX

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
│   └── layout/
│       ├── MainLayout.jsx
│       ├── Navbar.jsx
│       └── Sidebar.jsx
│
├── pages/
│   ├── Home.jsx
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

Make sure you have installed:

Node.js

npm

The SmartLearnSA Spring Boot backend

Installation

Clone or open the frontend project:

cd smartlearn-frontend

Install dependencies:

npm install

Start the development server:

npm run dev

Vite will normally start the application at:

http://localhost:5173

If port 5173 is already in use, Vite may automatically use another port such as 5174.

Environment and API Configuration

The frontend uses Axios with:

baseURL: "/api"

The Vite development server proxies /api requests to the Spring Boot backend.

Example vite.config.js:

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

This means a frontend request such as:

/api/auth/login

is forwarded during development to:

http://localhost:8080/api/auth/login

Authentication

SmartLearnSA uses session-based authentication.

The frontend sends credentials using Axios with:

withCredentials: true

The backend creates and stores the authenticated Spring Security context in the HTTP session.

The frontend also stores the returned user information in:

localStorage

using:

smartlearn-user

Role-based routing is handled by ProtectedRoute.

Supported roles currently include:

ADMIN
TUTOR
STUDENT
PARENT

The current frontend portal implementations focus primarily on:

TUTOR
STUDENT
ADMIN

Main Routes

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

Learning Flow

The main student learning flow is:

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

Tutor Flow

The main tutor workflow is:

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
Review Submissions
    ↓
Grade + Feedback

Backend API Integration

The frontend currently communicates with these backend areas:

Authentication

POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout

Subjects

GET /api/subjects
GET /api/subjects/{id}

Courses

GET    /api/courses
GET    /api/courses/{id}

GET    /api/tutor/courses
POST   /api/tutor/courses
PUT    /api/tutor/courses/{courseId}
PUT    /api/tutor/courses/{id}/publish
PUT    /api/tutor/courses/{id}/unpublish
DELETE /api/tutor/courses/{id}

Lessons

GET    /api/courses/{courseId}/lessons
GET    /api/lessons/{lessonId}

GET    /api/tutor/courses/{courseId}/lessons
POST   /api/tutor/courses/{courseId}/lessons
PUT    /api/tutor/lessons/{lessonId}
PUT    /api/tutor/lessons/{lessonId}/publish
PUT    /api/tutor/lessons/{lessonId}/unpublish
DELETE /api/tutor/lessons/{lessonId}

Assignments

GET    /api/tutor/assignments
GET    /api/tutor/courses/{courseId}/assignments
POST   /api/tutor/assignments
PUT    /api/tutor/assignments/{assignmentId}
PUT    /api/tutor/assignments/{assignmentId}/publish
PUT    /api/tutor/assignments/{assignmentId}/unpublish
DELETE /api/tutor/assignments/{assignmentId}

GET    /api/student/assignments
GET    /api/assignments/{assignmentId}

Assignment Submissions

POST /api/student/assignments/{assignmentId}/submit
GET  /api/student/assignments/{assignmentId}/submission
GET  /api/student/submissions

GET  /api/tutor/assignments/{assignmentId}/submissions
PUT  /api/tutor/submissions/{submissionId}/grade

Styling

Tailwind CSS v4 is used for the application UI.

The main stylesheet uses:

@import "tailwindcss";

Framer Motion is used for page and component animations.

Lucide React provides icons throughout the application.

Build for Production

Create a production build:

npm run build

Preview the production build:

npm run preview

Development Notes

Keep API calls inside the src/api layer.

Keep protected pages behind ProtectedRoute.

Do not place duplicate API mappings in the backend controllers.

Keep the frontend API paths aligned with the Spring Boot controllers.

The backend must be running on http://localhost:8080 when using the development proxy.

Session authentication requires Axios requests to use credentials.

Future Improvements

Potential future modules include:

Parent portal

Admin user management

Course administration

Tutor management

Student progress tracking

Assignment analytics

Notifications

Search and filtering

Profile management

File upload instead of manually entering file URLs

Curriculum-specific learning paths

Improved mobile navigation

Automated testing with Playwright

Author

SmartLearnSA Frontend

Built with React, Vite, Tailwind CSS and Spring Boot API integration.