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
    CheckCircle,
    FileText,
    Loader2,
    PlayCircle
} from "lucide-react";

import {
    getCourse
} from "../../api/courseApi";

import {
    getCourseLessons
} from "../../api/lessonApi";

export default function CourseDetails() {

    const { id } = useParams();


    const [course, setCourse] =
        useState(null);

    const [lessons, setLessons] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD
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


            const [
                courseData,
                lessonData
            ] = await Promise.all([

                getCourse(id),

                getCourseLessons(id)

            ]);


            setCourse(
                courseData
            );


            setLessons(
                Array.isArray(lessonData)
                    ? lessonData
                    : []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load course."
            );

        } finally {

            setLoading(false);
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
                        size={40}
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
    // ERROR
    // =========================================================

    if (error && !course) {

        return (

            <div className="mx-auto max-w-4xl">

                <Link
                    to="/student/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
                >

                    <ArrowLeft size={18} />

                    Back to Courses

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <h1 className="text-xl font-bold text-red-800">
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


    return (

        <div className="mx-auto max-w-5xl space-y-8">

            {/* =================================================
                BACK
            ================================================= */}

            <Link
                to="/student/courses"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Courses

            </Link>


            {/* =================================================
                HERO
            ================================================= */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >

                <div className="h-64 overflow-hidden bg-indigo-100">

                    {course.thumbnail ? (

                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="h-full w-full object-cover"
                        />

                    ) : (

                        <div className="flex h-full items-center justify-center text-indigo-300">

                            <BookOpen size={80} />

                        </div>

                    )}

                </div>


                <div className="p-6 sm:p-8">

                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        {course.title}
                    </h1>


                    {course.subjectName && (

                        <p className="mt-2 font-semibold text-indigo-600">
                            {course.subjectName}
                        </p>

                    )}


                    <div className="mt-5 flex flex-wrap gap-2">

                        {course.grade && (

                            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">

                                {course.grade.replace(
                                    "GRADE_",
                                    "Grade "
                                )}

                            </span>

                        )}


                        {course.curriculum && (

                            <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">

                                {course.curriculum}

                            </span>

                        )}


                        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">

                            <CheckCircle size={15} />

                            Published

                        </span>

                    </div>


                    <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-600">

                        {course.description ||
                            "No course description has been provided."}

                    </p>

                </div>

            </motion.div>


            {/* =================================================
                LESSONS
            ================================================= */}

            <div>

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            Course Lessons
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Work through the lessons in order.
                        </p>

                    </div>


                    <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">

                        {lessons.length}
                        {" "}
                        lesson
                        {lessons.length === 1
                            ? ""
                            : "s"}

                    </span>

                </div>


                {lessons.length === 0 && (

                    <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">

                        <FileText
                            size={40}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-4 text-lg font-bold text-gray-900">
                            No lessons available yet
                        </h3>

                        <p className="mt-2 text-gray-500">
                            This course does not have any published lessons yet.
                        </p>

                    </div>

                )}


                {lessons.length > 0 && (

                    <div className="mt-6 space-y-4">

                        {lessons.map(
                            (
                                lesson,
                                index
                            ) => (

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
                                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">

                                            {lesson.lessonOrder ??
                                                index + 1}

                                        </div>


                                        <div className="min-w-0 flex-1">

                                            <h3 className="font-bold text-gray-900">

                                                {lesson.title}

                                            </h3>


                                            {lesson.description && (

                                                <p className="mt-1 line-clamp-2 text-sm text-gray-500">

                                                    {lesson.description}

                                                </p>

                                            )}

                                        </div>


                                        <Link
                                            to={`/student/lessons/${lesson.id}`}
                                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                                        >

                                            <PlayCircle size={17} />

                                            <span className="hidden sm:inline">
                                                Start
                                            </span>

                                            <ArrowRight size={17} />

                                        </Link>

                                    </div>

                                </motion.div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}