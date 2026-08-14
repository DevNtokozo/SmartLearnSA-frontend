import { useEffect, useState } from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    Calendar,
    CheckCircle,
    ClipboardList,
    GraduationCap,
    Loader2,
    Lock,
    PlayCircle,
    UserCircle
} from "lucide-react";

import {
    getCourse
} from "../../api/courseApi";

import {
    getCourseLessons
} from "../../api/lessonApi";

import {
    getStudentAssignments
} from "../../api/assignmentApi";

import {
    enrollInCourse,
    isEnrolled
} from "../../api/enrollmentApi";

import {
    getCourseProgress,
    getCourseProgressSummary
} from "../../api/progressApi";


export default function CourseDetails() {

    const { id } = useParams();


    // =========================================================
    // STATE
    // =========================================================

    const [course, setCourse] =
        useState(null);

    const [lessons, setLessons] =
        useState([]);

    const [assignments, setAssignments] =
        useState([]);

    const [progress, setProgress] =
        useState(null);

    const [lessonProgress, setLessonProgress] =
        useState({});

    const [enrolled, setEnrolled] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [enrolling, setEnrolling] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD COURSE
    // =========================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Course ID is missing."
            );

            setLoading(false);

            return;
        }

        loadCourse();

    }, [id]);


    const loadCourse = async () => {

        try {

            setLoading(true);
            setError("");


            // =================================================
            // COURSE
            // =================================================

            const courseData =
                await getCourse(id);

            setCourse(
                courseData
            );


            // =================================================
            // ENROLLMENT
            // =================================================

            let enrollmentStatus = false;

            try {

                enrollmentStatus =
                    Boolean(
                        await isEnrolled(id)
                    );

                setEnrolled(
                    enrollmentStatus
                );

            } catch (enrollmentError) {

                console.error(
                    "Failed to check enrollment:",
                    enrollmentError
                );

                setEnrolled(false);

            }


            // =================================================
            // LESSONS
            // =================================================

            let lessonData = [];

            try {

                const data =
                    await getCourseLessons(id);

                lessonData =
                    Array.isArray(data)
                        ? data
                        : [];

            } catch (lessonError) {

                console.error(
                    "Failed to load lessons:",
                    lessonError
                );

            }

            setLessons(
                lessonData
            );


            // =================================================
            // ASSIGNMENTS
            // =================================================

            let assignmentData = [];

            if (enrollmentStatus) {

                try {

                    const data =
                        await getStudentAssignments();

                    assignmentData =
                        Array.isArray(data)
                            ? data
                            : [];

                } catch (assignmentError) {

                    console.error(
                        "Failed to load assignments:",
                        assignmentError
                    );

                }

            }


            const courseAssignments =
                assignmentData.filter(
                    assignment =>
                        String(
                            assignment.courseId
                        ) === String(id)
                );

            setAssignments(
                courseAssignments
            );


            // =================================================
            // COURSE PROGRESS
            // =================================================

            if (enrollmentStatus) {

                try {

                    const summary =
                        await getCourseProgressSummary(
                            id
                        );

                    setProgress(
                        summary
                    );

                } catch (progressError) {

                    console.error(
                        "Failed to load course progress:",
                        progressError
                    );

                    setProgress(null);

                }


                // =================================================
                // INDIVIDUAL LESSON PROGRESS
                // =================================================

                try {

                    const progressData =
                        await getCourseProgress(
                            id
                        );

                    const progressMap =
                        {};

                    if (
                        Array.isArray(
                            progressData
                        )
                    ) {

                        progressData.forEach(
                            item => {

                                progressMap[
                                    item.lessonId
                                ] = item;

                            }
                        );

                    }

                    setLessonProgress(
                        progressMap
                    );

                } catch (lessonProgressError) {

                    console.error(
                        "Failed to load lesson progress:",
                        lessonProgressError
                    );

                    setLessonProgress({});
                }

            } else {

                setProgress(null);

                setLessonProgress({});

            }

        } catch (error) {

            console.error(
                "Failed to load course:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load course."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // ENROLL
    // =========================================================

    const handleEnroll = async () => {

        try {

            setEnrolling(true);
            setError("");


            await enrollInCourse(
                id
            );


            setEnrolled(
                true
            );


            // Reload all course-related data
            await loadCourse();

        } catch (error) {

            console.error(
                "Failed to enroll:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to enroll in this course."
            );

        } finally {

            setEnrolling(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <Loader2
                        size={42}
                        className="mx-auto animate-spin text-indigo-600"
                    />

                    <p className="mt-4 text-gray-500">
                        Loading course...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // ERROR / NOT FOUND
    // =========================================================

    if (error && !course) {

        return (

            <div className="mx-auto max-w-4xl">

                <Link
                    to="/student/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back to Courses

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">

                        <BookOpen
                            size={26}
                        />

                    </div>


                    <h1 className="mt-4 text-xl font-bold text-red-800">
                        Unable to load course
                    </h1>


                    <p className="mt-2 text-red-700">
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    if (!course) {
        return null;
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="mx-auto max-w-6xl space-y-8 pb-12">


            {/* =================================================
                BACK
            ================================================= */}

            <motion.div
                initial={{
                    opacity: 0,
                    x: -20
                }}
                animate={{
                    opacity: 1,
                    x: 0
                }}
            >

                <Link
                    to="/student/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back to Courses

                </Link>

            </motion.div>


            {/* =================================================
                COURSE HERO
            ================================================= */}

            <motion.section
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >

                {/* Thumbnail */}

                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-indigo-100 to-slate-100 sm:h-80">

                    {course.thumbnail ? (

                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-full w-full object-cover"
                        />

                    ) : (

                        <div className="flex h-full items-center justify-center text-indigo-300">

                            <BookOpen
                                size={90}
                                strokeWidth={1.4}
                            />

                        </div>

                    )}


                    {/* Published */}

                    {course.published && (

                        <div className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-md">

                            <CheckCircle
                                size={16}
                            />

                            Published

                        </div>

                    )}

                </div>


                {/* Course content */}

                <div className="p-6 sm:p-8">

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                        {/* COURSE INFO */}

                        <div className="min-w-0 flex-1">

                            {course.subjectName && (

                                <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">

                                    {course.subjectName}

                                </p>

                            )}


                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">

                                {course.title}

                            </h1>


                            <p className="mt-5 max-w-3xl whitespace-pre-wrap text-base leading-8 text-gray-600">

                                {course.description ||
                                    "No course description has been provided."}

                            </p>


                            {/* META */}

                            <div className="mt-6 flex flex-wrap gap-3">

                                {course.grade && (

                                    <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700">

                                        <GraduationCap
                                            size={17}
                                        />

                                        {course.grade.replace(
                                            "GRADE_",
                                            "Grade "
                                        )}

                                    </div>

                                )}


                                {course.curriculum && (

                                    <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700">

                                        <BookOpen
                                            size={17}
                                        />

                                        {course.curriculum}

                                    </div>

                                )}


                                {course.createdAt && (

                                    <div className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold text-gray-700">

                                        <Calendar
                                            size={17}
                                        />

                                        {new Date(
                                            course.createdAt
                                        ).toLocaleDateString()}

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* =================================================
                            ENROLLMENT CARD
                        ================================================= */}

                        <div className="w-full shrink-0 rounded-2xl border border-gray-200 bg-gray-50 p-5 lg:w-72">

                            <p className="text-sm font-semibold text-gray-500">

                                Course Access

                            </p>


                            {enrolled ? (

                                <>

                                    <div className="mt-3 flex items-center gap-2 text-green-700">

                                        <CheckCircle
                                            size={20}
                                        />

                                        <span className="font-bold">
                                            You're enrolled
                                        </span>

                                    </div>


                                    <p className="mt-2 text-sm leading-6 text-gray-500">

                                        You can access this course's lessons and assignments.

                                    </p>

                                </>

                            ) : (

                                <>

                                    <div className="mt-3 flex items-center gap-2 text-gray-700">

                                        <Lock
                                            size={18}
                                        />

                                        <span className="font-semibold">
                                            Not enrolled
                                        </span>

                                    </div>


                                    <p className="mt-2 text-sm leading-6 text-gray-500">

                                        Enroll in this course to start learning.

                                    </p>


                                    <button
                                        type="button"
                                        onClick={
                                            handleEnroll
                                        }
                                        disabled={
                                            enrolling
                                        }
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {enrolling ? (

                                            <>
                                                <Loader2
                                                    size={18}
                                                    className="animate-spin"
                                                />

                                                Enrolling...

                                            </>

                                        ) : (

                                            <>
                                                Enroll in Course

                                                <ArrowRight
                                                    size={18}
                                                />

                                            </>

                                        )}

                                    </button>

                                </>

                            )}

                        </div>

                    </div>


                    {/* Error */}

                    {error && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >

                            {error}

                        </motion.div>

                    )}

                </div>

            </motion.section>


            {/* =================================================
                TUTOR
            ================================================= */}

            {course.tutorId && (

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.1
                    }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

                        {/* Profile */}

                        {course.tutorProfilePicture ? (

                            <img
                                src={
                                    course.tutorProfilePicture
                                }
                                alt={
                                    `${course.tutorFirstName || ""} ${course.tutorLastName || ""}`
                                }
                                className="h-24 w-24 shrink-0 rounded-2xl object-cover"
                            />

                        ) : (

                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">

                                <UserCircle
                                    size={52}
                                />

                            </div>

                        )}


                        <div className="min-w-0 flex-1">

                            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">

                                Your Tutor

                            </p>


                            <h2 className="mt-1 text-2xl font-bold text-gray-900">

                                {course.tutorFirstName}
                                {" "}
                                {course.tutorLastName}

                            </h2>


                            {course.tutorQualification && (

                                <p className="mt-1 font-semibold text-gray-600">

                                    {course.tutorQualification}

                                </p>

                            )}


                            {course.tutorBio && (

                                <p className="mt-4 leading-7 text-gray-600">

                                    {course.tutorBio}

                                </p>

                            )}


                            <Link
                                to={`/tutors/${course.tutorId}`}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                            >

                                Meet Your Tutor

                                <ArrowRight
                                    size={17}
                                />

                            </Link>

                        </div>

                    </div>

                </motion.section>

            )}


            {/* =================================================
                COURSE PROGRESS
            ================================================= */}

            {enrolled && progress && (

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.15
                    }}
                    className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm sm:p-8"
                >

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">

                                Your Progress

                            </p>


                            <p className="mt-2 text-sm text-gray-600">

                                {progress.completedLessons}
                                {" "}
                                of
                                {" "}
                                {progress.totalLessons}
                                {" "}
                                lessons completed

                            </p>

                        </div>


                        <span className="text-3xl font-bold text-indigo-600">

                            {progress.progressPercentage}%

                        </span>

                    </div>


                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">

                        <motion.div
                            initial={{
                                width: 0
                            }}
                            animate={{
                                width:
                                    `${progress.progressPercentage}%`
                            }}
                            transition={{
                                duration: 0.8,
                                ease: "easeOut"
                            }}
                            className={`h-full rounded-full ${
                                progress.progressPercentage ===
                                100
                                    ? "bg-green-500"
                                    : "bg-indigo-600"
                            }`}
                        />

                    </div>

                </motion.section>

            )}


            {/* =================================================
                LESSONS
            ================================================= */}

            <motion.section
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.2
                }}
            >

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">

                            Learning

                        </p>


                        <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">

                            Course Lessons

                        </h2>


                        <p className="mt-2 text-gray-500">

                            Work through the lessons in order.

                        </p>

                    </div>


                    <span className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">

                        {lessons.length}
                        {" "}
                        lesson
                        {lessons.length === 1
                            ? ""
                            : "s"}

                    </span>

                </div>


                {!enrolled ? (

                    <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

                        <Lock
                            size={38}
                            className="mx-auto text-gray-300"
                        />


                        <h3 className="mt-4 text-lg font-bold text-gray-900">

                            Enroll to access lessons

                        </h3>


                        <p className="mx-auto mt-2 max-w-md text-gray-500">

                            Enroll in this course to start working through the lessons.

                        </p>

                    </div>

                ) : lessons.length === 0 ? (

                    <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

                        <BookOpen
                            size={40}
                            className="mx-auto text-gray-300"
                        />


                        <h3 className="mt-4 text-lg font-bold text-gray-900">

                            No lessons available

                        </h3>


                        <p className="mt-2 text-gray-500">

                            This course does not have any published lessons yet.

                        </p>

                    </div>

                ) : (

                    <div className="mt-6 space-y-4">

                        {lessons.map(
                            (
                                lesson,
                                index
                            ) => {

                                const lessonCompleted =
                                    Boolean(
                                        lessonProgress[
                                            lesson.id
                                        ]?.completed
                                    );


                                return (

                                    <motion.div
                                        key={lesson.id}
                                        initial={{
                                            opacity: 0,
                                            x: -15
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0
                                        }}
                                        transition={{
                                            delay:
                                                index * 0.05
                                        }}
                                        className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 ${
                                            lessonCompleted
                                                ? "border-green-200"
                                                : "border-gray-200"
                                        }`}
                                    >

                                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                                            {/* NUMBER */}

                                            <div
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${
                                                    lessonCompleted
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-indigo-100 text-indigo-700"
                                                }`}
                                            >

                                                {lessonCompleted ? (

                                                    <CheckCircle
                                                        size={23}
                                                    />

                                                ) : (

                                                    lesson.lessonOrder ??
                                                    index + 1

                                                )}

                                            </div>


                                            {/* INFO */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex flex-wrap items-center gap-2">

                                                    <h3 className="text-lg font-bold text-gray-900">

                                                        {lesson.title}

                                                    </h3>


                                                    {lessonCompleted && (

                                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">

                                                            Completed

                                                        </span>

                                                    )}

                                                </div>


                                                {lesson.description && (

                                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">

                                                        {
                                                            lesson.description
                                                        }

                                                    </p>

                                                )}


                                                <div className="mt-3 flex flex-wrap gap-2">

                                                    {lesson.videoUrl && (

                                                        <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">

                                                            <PlayCircle
                                                                size={13}
                                                            />

                                                            Video

                                                        </span>

                                                    )}


                                                    {lesson.resourceUrl && (

                                                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">

                                                            Resource

                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            {/* ACTION */}

                                            <Link
                                                to={`/student/lessons/${lesson.id}`}
                                                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-white transition ${
                                                    lessonCompleted
                                                        ? "bg-green-600 hover:bg-green-700"
                                                        : "bg-indigo-600 hover:bg-indigo-700"
                                                }`}
                                            >

                                                <PlayCircle
                                                    size={17}
                                                />

                                                {lessonCompleted
                                                    ? "Review Lesson"
                                                    : "Open Lesson"}

                                                <ArrowRight
                                                    size={17}
                                                />

                                            </Link>

                                        </div>

                                    </motion.div>

                                );
                            }
                        )}

                    </div>

                )}

            </motion.section>


            {/* =================================================
                ASSIGNMENTS
            ================================================= */}

            <motion.section
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.25
                }}
            >

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                        <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">

                            Assessment

                        </p>


                        <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">

                            Course Assignments

                        </h2>


                        <p className="mt-2 text-gray-500">

                            Complete the assignments associated with this course.

                        </p>

                    </div>


                    <span className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">

                        {assignments.length}
                        {" "}
                        assignment
                        {assignments.length === 1
                            ? ""
                            : "s"}

                    </span>

                </div>


                {!enrolled ? (

                    <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

                        <Lock
                            size={38}
                            className="mx-auto text-gray-300"
                        />


                        <h3 className="mt-4 text-lg font-bold text-gray-900">

                            Enroll to access assignments

                        </h3>


                        <p className="mx-auto mt-2 max-w-md text-gray-500">

                            Enroll in this course to view and complete its assignments.

                        </p>

                    </div>

                ) : assignments.length === 0 ? (

                    <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

                        <ClipboardList
                            size={40}
                            className="mx-auto text-gray-300"
                        />


                        <h3 className="mt-4 text-lg font-bold text-gray-900">

                            No assignments available

                        </h3>


                        <p className="mt-2 text-gray-500">

                            There are currently no published assignments for this course.

                        </p>

                    </div>

                ) : (

                    <div className="mt-6 grid gap-5 lg:grid-cols-2">

                        {assignments.map(
                            (
                                assignment,
                                index
                            ) => (

                                <motion.div
                                    key={assignment.id}
                                    initial={{
                                        opacity: 0,
                                        y: 15
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        delay:
                                            index * 0.05
                                    }}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                            <ClipboardList
                                                size={23}
                                            />

                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <h3 className="text-lg font-bold text-gray-900">

                                                {
                                                    assignment.title
                                                }

                                            </h3>


                                            {assignment.lessonTitle && (

                                                <p className="mt-1 text-sm font-semibold text-indigo-600">

                                                    Lesson:
                                                    {" "}
                                                    {
                                                        assignment.lessonTitle
                                                    }

                                                </p>

                                            )}


                                            {assignment.description && (

                                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">

                                                    {
                                                        assignment.description
                                                    }

                                                </p>

                                            )}


                                            <div className="mt-4 flex flex-wrap gap-2">

                                                {assignment.totalMarks != null && (

                                                    <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                                        {
                                                            assignment.totalMarks
                                                        }

                                                        {" "}
                                                        marks

                                                    </span>

                                                )}


                                                {assignment.dueDate && (

                                                    <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                                        <Calendar
                                                            size={13}
                                                        />

                                                        Due:
                                                        {" "}
                                                        {new Date(
                                                            assignment.dueDate
                                                        ).toLocaleDateString()}

                                                    </span>

                                                )}

                                            </div>


                                            <Link
                                                to={`/student/assignments/${assignment.id}`}
                                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                            >

                                                Open Assignment

                                                <ArrowRight
                                                    size={17}
                                                />

                                            </Link>

                                        </div>

                                    </div>

                                </motion.div>

                            )
                        )}

                    </div>

                )}

            </motion.section>


            {/* =================================================
                COURSE SUMMARY
            ================================================= */}

            <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 sm:p-8">

                <div className="grid gap-6 sm:grid-cols-3">

                    <div>

                        <p className="text-sm font-semibold text-indigo-600">

                            Lessons

                        </p>


                        <p className="mt-1 text-3xl font-bold text-gray-900">

                            {lessons.length}

                        </p>

                    </div>


                    <div>

                        <p className="text-sm font-semibold text-indigo-600">

                            Assignments

                        </p>


                        <p className="mt-1 text-3xl font-bold text-gray-900">

                            {assignments.length}

                        </p>

                    </div>


                    <div>

                        <p className="text-sm font-semibold text-indigo-600">

                            Status

                        </p>


                        <p className="mt-1 text-xl font-bold text-gray-900">

                            {enrolled
                                ? "Enrolled"
                                : "Available"}

                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}