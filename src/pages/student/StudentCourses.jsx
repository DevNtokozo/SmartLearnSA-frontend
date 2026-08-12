import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    BookOpen,
    Calendar,
    GraduationCap,
    Loader2,
    ArrowRight
} from "lucide-react";

import { getCourses } from "../../api/courseApi";

export default function StudentCourses() {

    const [courses, setCourses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD COURSES
    // =========================================================

    useEffect(() => {

        loadCourses();

    }, []);


    const loadCourses = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getCourses();

            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load courses:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load courses."
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
                        Loading courses...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="space-y-8">

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
            >

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <GraduationCap size={25} />

                    </div>

                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Courses
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Explore available SmartLearn courses.
                        </p>

                    </div>

                </div>

            </motion.div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

                    {error}

                </div>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!error &&
                courses.length === 0 && (

                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

                        <BookOpen
                            size={45}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            No courses available
                        </h2>

                        <p className="mt-2 text-gray-500">
                            There are currently no published courses.
                        </p>

                    </div>
                )}


            {/* =================================================
                COURSE CARDS
            ================================================= */}

            {courses.length > 0 && (

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {courses.map(
                        (
                            course,
                            index
                        ) => (

                            <motion.div
                                key={course.id}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    delay: index * 0.06
                                }}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >

                                {/* IMAGE */}

                                <div className="h-48 overflow-hidden bg-indigo-100">

                                    {course.thumbnail ? (

                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center text-indigo-300">

                                            <BookOpen size={60} />

                                        </div>

                                    )}

                                </div>


                                {/* CONTENT */}

                                <div className="p-6">

                                    <h2 className="text-xl font-bold text-gray-900">
                                        {course.title}
                                    </h2>


                                    {course.subjectName && (

                                        <p className="mt-1 text-sm font-semibold text-indigo-600">
                                            {course.subjectName}
                                        </p>

                                    )}


                                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">

                                        {course.description ||
                                            "Explore this course to begin learning."}

                                    </p>


                                    {/* META */}

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

                                            <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                                {course.curriculum}

                                            </span>

                                        )}


                                        {course.createdAt && (

                                            <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                                <Calendar size={13} />

                                                {new Date(
                                                    course.createdAt
                                                ).toLocaleDateString()}

                                            </span>

                                        )}

                                    </div>


                                    {/* ACTION */}

                                    <Link
                                        to={`/student/courses/${course.id}`}
                                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                                    >

                                        View Course

                                        <ArrowRight size={18} />

                                    </Link>

                                </div>

                            </motion.div>

                        )
                    )}

                </div>
            )}

        </div>
    );
}