import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

// =========================================================
// PUBLIC
// =========================================================

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =========================================================
// TUTOR
// =========================================================

import TutorDashboard
    from "./pages/tutor/TutorDashboard";

import TutorCourses
    from "./pages/tutor/TutorCourses";

import CreateCourse
    from "./pages/tutor/CreateCourse";

import EditCourse
    from "./pages/tutor/EditCourse";

import TutorLessons
    from "./pages/tutor/TutorLessons";

import CreateLesson
    from "./pages/tutor/CreateLesson";

import EditLesson
    from "./pages/tutor/EditLesson";

import TutorAssignments
    from "./pages/tutor/TutorAssignments";

import CreateAssignment
    from "./pages/tutor/CreateAssignment";

import EditAssignment
    from "./pages/tutor/EditAssignment";

import AssignmentSubmissions
    from "./pages/tutor/AssignmentSubmissions";

// =========================================================
// STUDENT
// =========================================================

import StudentDashboard
    from "./pages/student/StudentDashboard";

import StudentCourses
    from "./pages/student/StudentCourses";

import CourseDetails
    from "./pages/student/CourseDetails";

import LessonDetails
    from "./pages/student/LessonDetails";

import StudentAssignments
    from "./pages/student/StudentAssignments";

import AssignmentDetails
    from "./pages/student/AssignmentDetails";

import StudentSubmissions
    from "./pages/student/StudentSubmissions";

// =========================================================
// ADMIN
// =========================================================

import AdminDashboard
    from "./pages/admin/AdminDashboard";

// =========================================================
// COMMON
// =========================================================

import ProtectedRoute
    from "./components/auth/ProtectedRoute";

import MainLayout
    from "./components/layout/MainLayout";


// =========================================================
// TUTOR LAYOUT
// =========================================================

function TutorLayout() {

    return (
        <MainLayout role="TUTOR">

            <Routes>

                <Route
                    path="dashboard"
                    element={<TutorDashboard />}
                />

                <Route
                    path="courses"
                    element={<TutorCourses />}
                />

                <Route
                    path="courses/create"
                    element={<CreateCourse />}
                />

                <Route
                    path="courses/:id/edit"
                    element={<EditCourse />}
                />

                <Route
                    path="lessons"
                    element={<TutorLessons />}
                />

                <Route
                    path="lessons/create"
                    element={<CreateLesson />}
                />

                <Route
                    path="lessons/:id/edit"
                    element={<EditLesson />}
                />

                <Route
                    path="assignments"
                    element={<TutorAssignments />}
                />

                <Route
                    path="assignments/create"
                    element={<CreateAssignment />}
                />

                <Route
                    path="assignments/:id/edit"
                    element={<EditAssignment />}
                />

                <Route
                    path="assignments/:id/submissions"
                    element={<AssignmentSubmissions />}
                />

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </MainLayout>
    );
}


// =========================================================
// STUDENT LAYOUT
// =========================================================

function StudentLayout() {

    return (
        <MainLayout role="STUDENT">

            <Routes>

                <Route
                    path="dashboard"
                    element={<StudentDashboard />}
                />

                <Route
                    path="courses"
                    element={<StudentCourses />}
                />

                <Route
                    path="courses/:id"
                    element={<CourseDetails />}
                />

                <Route
                    path="lessons/:id"
                    element={<LessonDetails />}
                />

                <Route
                    path="assignments"
                    element={<StudentAssignments />}
                />

                <Route
                    path="assignments/:id"
                    element={<AssignmentDetails />}
                />

                <Route
                    path="submissions"
                    element={<StudentSubmissions />}
                />

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </MainLayout>
    );
}


// =========================================================
// ADMIN LAYOUT
// =========================================================

function AdminLayout() {

    return (
        <MainLayout role="ADMIN">

            <Routes>

                <Route
                    path="dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </MainLayout>
    );
}


// =========================================================
// APP
// =========================================================

export default function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================================
                    PUBLIC
                ================================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =================================================
                    TUTOR
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["TUTOR"]}
                        />
                    }
                >

                    <Route
                        path="/tutor/*"
                        element={<TutorLayout />}
                    />

                </Route>


                {/* =================================================
                    STUDENT
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["STUDENT"]}
                        />
                    }
                >

                    <Route
                        path="/student/*"
                        element={<StudentLayout />}
                    />

                </Route>


                {/* =================================================
                    ADMIN
                ================================================= */}

                <Route
                    element={
                        <ProtectedRoute
                            allowedRoles={["ADMIN"]}
                        />
                    }
                >

                    <Route
                        path="/admin/*"
                        element={<AdminLayout />}
                    />

                </Route>


                {/* =================================================
                    FALLBACK
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}