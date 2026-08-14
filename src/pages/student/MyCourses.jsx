import { useEffect, useState } from "react";

import {
    Link
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    AlertTriangle,
    ArrowRight,
    BookOpen,
    Calendar,
    GraduationCap,
    Loader2,
    Trash2
} from "lucide-react";

import {
    getMyCourses,
    unenrollFromCourse
} from "../../api/enrollmentApi";

import {
    getCourseProgressSummary
} from "../../api/progressApi";


export default function MyCourses() {

    // =========================================================
    // STATE
    // =========================================================

    const [courses, setCourses] =
        useState([]);

    const [progress, setProgress] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [progressLoading, setProgressLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [unenrollingId, setUnenrollingId] =
        useState(null);


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        loadMyCourses();

    }, []);


    const loadMyCourses = async () => {

        try {

            setLoading(true);
            setProgressLoading(true);
            setError("");


            // =================================================
            // LOAD ENROLLED COURSES
            // =================================================

            const data =
                await getMyCourses();


            const enrolledCourses =
                Array.isArray(data)
                    ? data
                    : [];


            setCourses(
                enrolledCourses
            );


            // =================================================
            // LOAD PROGRESS
            // =================================================

            if (enrolledCourses.length === 0) {

                setProgress({});

                setProgressLoading(false);

                return;
            }


            const progressEntries =
                await Promise.all(
                    enrolledCourses.map(
                        async course => {

                            try {

                                const summary =
                                    await getCourseProgressSummary(
                                        course.courseId
                                    );


                                return [
                                    course.courseId,
                                    summary
                                ];

                            } catch (progressError) {

                                console.error(
                                    `Failed to load progress for course ${course.courseId}:`,
                                    progressError
                                );


                                return [
                                    course.courseId,
                                    {
                                        courseId:
                                            course.courseId,

                                        totalLessons:
                                            0,

                                        completedLessons:
                                            0,

                                        progressPercentage:
                                            0
                                    }
                                ];
                            }
                        }
                    )
                );


            setProgress(
                Object.fromEntries(
                    progressEntries
                )
            );

        } catch (error) {

            console.error(
                "Failed to load my courses:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load your courses."
            );

        } finally {

            setLoading(false);
            setProgressLoading(false);
        }
    };


    // =========================================================
    // UNENROLL
    // =========================================================

    const handleUnenroll = async (
        courseId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to unenroll from this course?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setUnenrollingId(
                courseId
            );

            setError("");


            await unenrollFromCourse(
                courseId
            );


            // -------------------------------------------------
            // Remove course from UI
            // -------------------------------------------------

            setCourses(
                previous =>
                    previous.filter(
                        course =>
                            course.courseId !==
                            courseId
                    )
            );


            // -------------------------------------------------
            // Remove progress from UI
            // -------------------------------------------------

            setProgress(
                previous => {

                    const updated = {
                        ...previous
                    };

                    delete updated[
                        courseId
                    ];

                    return updated;
                }
            );

        } catch (error) {

            console.error(
                "Failed to unenroll:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to unenroll from course."
            );

        } finally {

            setUnenrollingId(
                null
            );
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

                        Loading your courses...

                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="space-y-8 pb-12">


            {/* =================================================
                HEADER
            ================================================= */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: -20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}
            >

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <GraduationCap
                            size={25}
                        />

                    </div>


                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">

                            My Courses

                        </h1>


                        <p className="mt-1 text-gray-500">

                            Continue learning from the courses you have enrolled in.

                        </p>

                    </div>

                </div>

            </motion.div>


            {/* =================================================
                ERROR
            ================================================= */}

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
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >

                    <AlertTriangle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />


                    <span>
                        {error}
                    </span>

                </motion.div>

            )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!error &&
                courses.length === 0 && (

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.97
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1
                        }}
                        transition={{
                            duration: 0.4
                        }}
                        className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center"
                    >

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">

                            <BookOpen
                                size={30}
                            />

                        </div>


                        <h2 className="mt-5 text-xl font-bold text-gray-900">

                            You haven't enrolled in any courses yet

                        </h2>


                        <p className="mx-auto mt-2 max-w-md leading-6 text-gray-500">

                            Browse the available courses and enroll in one to start learning.

                        </p>


                        <Link
                            to="/student/courses"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 hover:shadow-md"
                        >

                            Browse Courses

                            <ArrowRight
                                size={18}
                            />

                        </Link>

                    </motion.div>

                )}


            {/* =================================================
                COURSE GRID
            ================================================= */}

            {courses.length > 0 && (

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {courses.map(
                        (
                            course,
                            index
                        ) => {

                            const courseProgress =
                                progress[
                                    course.courseId
                                ];


                            const progressPercentage =
                                courseProgress?.progressPercentage ??
                                0;


                            const completedLessons =
                                courseProgress?.completedLessons ??
                                0;


                            const totalLessons =
                                courseProgress?.totalLessons ??
                                0;


                            const isUnenrolling =
                                unenrollingId ===
                                course.courseId;


                            return (

                                <motion.div
                                    key={
                                        course.id
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 20
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    transition={{
                                        delay:
                                            index *
                                            0.06
                                    }}
                                    whileHover={{
                                        y: -4
                                    }}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
                                >

                                    {/* =================================================
                                        THUMBNAIL
                                    ================================================= */}

                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-slate-100">

                                        {course.courseThumbnail ? (

                                            <img
                                                src={
                                                    course.courseThumbnail
                                                }
                                                alt={
                                                    course.courseTitle ||
                                                    "Course"
                                                }
                                                className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                            />

                                        ) : (

                                            <div className="flex h-full items-center justify-center text-indigo-300">

                                                <BookOpen
                                                    size={62}
                                                    strokeWidth={1.5}
                                                />

                                            </div>

                                        )}


                                        {/* Enrolled Badge */}

                                        <div className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">

                                            Enrolled

                                        </div>

                                    </div>


                                    {/* =================================================
                                        CONTENT
                                    ================================================= */}

                                    <div className="p-6">


                                        {/* =================================================
                                            TITLE
                                        ================================================= */}

                                        <div className="flex items-start justify-between gap-3">

                                            <div className="min-w-0">

                                                <h2 className="truncate text-xl font-bold text-gray-900">

                                                    {
                                                        course.courseTitle
                                                    }

                                                </h2>


                                                {course.subjectName && (

                                                    <p className="mt-1 text-sm font-semibold text-indigo-600">

                                                        {
                                                            course.subjectName
                                                        }

                                                    </p>

                                                )}

                                            </div>

                                        </div>


                                        {/* =================================================
                                            COURSE META
                                        ================================================= */}

                                        <div className="mt-5 flex flex-wrap gap-2">

                                            {course.grade && (

                                                <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                                    {course.grade.replace(
                                                        "GRADE_",
                                                        "Grade "
                                                    )}

                                                </span>

                                            )}


                                            {course.curriculum && (

                                                <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">

                                                    {
                                                        course.curriculum
                                                    }

                                                </span>

                                            )}


                                            {course.enrolledAt && (

                                                <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                                    <Calendar
                                                        size={13}
                                                    />

                                                    Enrolled:

                                                    {" "}

                                                    {new Date(
                                                        course.enrolledAt
                                                    ).toLocaleDateString()}

                                                </span>

                                            )}

                                        </div>


                                        {/* =================================================
                                            PROGRESS
                                        ================================================= */}

                                        <div className="mt-6">

                                            <div className="flex items-center justify-between">

                                                <div>

                                                    <p className="text-sm font-semibold text-gray-700">

                                                        Learning Progress

                                                    </p>


                                                    {progressLoading ? (

                                                        <div className="mt-2 h-3 w-28 animate-pulse rounded bg-gray-200" />

                                                    ) : (

                                                        <p className="mt-1 text-xs text-gray-500">

                                                            {completedLessons}

                                                            {" "}

                                                            of

                                                            {" "}

                                                            {totalLessons}

                                                            {" "}

                                                            lessons completed

                                                        </p>

                                                    )}

                                                </div>


                                                {progressLoading ? (

                                                    <div className="h-5 w-10 animate-pulse rounded bg-gray-200" />

                                                ) : (

                                                    <span className="text-lg font-bold text-indigo-600">

                                                        {progressPercentage}%

                                                    </span>

                                                )}

                                            </div>


                                            {/* Progress Track */}

                                            {progressLoading ? (

                                                <div className="mt-3 h-2.5 animate-pulse rounded-full bg-gray-200" />

                                            ) : (

                                                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-200">

                                                    <motion.div
                                                        initial={{
                                                            width: 0
                                                        }}
                                                        animate={{
                                                            width:
                                                                `${progressPercentage}%`
                                                        }}
                                                        transition={{
                                                            duration:
                                                                0.8,
                                                            ease:
                                                                "easeOut"
                                                        }}
                                                        className={`h-full rounded-full ${
                                                            progressPercentage ===
                                                            100
                                                                ? "bg-green-500"
                                                                : "bg-indigo-600"
                                                        }`}
                                                    />

                                                </div>

                                            )}

                                        </div>


                                        {/* =================================================
                                            CONTINUE LEARNING
                                        ================================================= */}

                                        <Link
                                            to={`/student/courses/${course.courseId}`}
                                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 hover:shadow-md"
                                        >

                                            Continue Learning

                                            <ArrowRight
                                                size={18}
                                            />

                                        </Link>


                                        {/* =================================================
                                            UNENROLL
                                        ================================================= */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleUnenroll(
                                                    course.courseId
                                                )
                                            }
                                            disabled={
                                                isUnenrolling
                                            }
                                            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >

                                            {isUnenrolling ? (

                                                <>

                                                    <Loader2
                                                        size={16}
                                                        className="animate-spin"
                                                    />

                                                    Removing...

                                                </>

                                            ) : (

                                                <>

                                                    <Trash2
                                                        size={16}
                                                    />

                                                    Unenroll

                                                </>

                                            )}

                                        </button>

                                    </div>

                                </motion.div>

                            );
                        }
                    )}

                </div>

            )}

        </div>
    );
}