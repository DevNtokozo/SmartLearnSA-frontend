import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    BookOpen,
    Calendar,
    CheckCircle,
    Edit,
    Loader2,
    Plus,
    EyeOff,
    Eye,
    Trash2,
    XCircle
} from "lucide-react";

import {
    getTutorCourses,
    deleteCourse,
    publishCourse,
    unpublishCourse
} from "../../api/courseApi";

export default function TutorCourses() {

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState(null);


    // =========================================================
    // LOAD
    // =========================================================

    useEffect(() => {
        loadCourses();
    }, []);


    const loadCourses = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getTutorCourses();

            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load courses."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (courseId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionId(courseId);

            await deleteCourse(courseId);

            setCourses(previous =>
                previous.filter(
                    course =>
                        course.id !== courseId
                )
            );

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete course."
            );

        } finally {

            setActionId(null);
        }
    };


    // =========================================================
    // PUBLISH / UNPUBLISH
    // =========================================================

    const handlePublishToggle = async (
        course
    ) => {

        try {

            setActionId(course.id);

            const updated =
                course.published
                    ? await unpublishCourse(course.id)
                    : await publishCourse(course.id);

            setCourses(previous =>
                previous.map(item =>
                    item.id === course.id
                        ? updated
                        : item
                )
            );

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update course status."
            );

        } finally {

            setActionId(null);
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
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                            <BookOpen size={25} />

                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                My Courses
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Create and manage your SmartLearn courses.
                            </p>

                        </div>

                    </div>

                </div>


                <Link
                    to="/tutor/courses/create"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700"
                >

                    <Plus size={19} />

                    Create Course

                </Link>

            </motion.div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                </div>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!error && courses.length === 0 && (

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.97
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center"
                >

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">

                        <BookOpen size={30} />

                    </div>

                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        No courses yet
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Create your first course to start adding lessons.
                    </p>

                    <Link
                        to="/tutor/courses/create"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                    >

                        <Plus size={18} />

                        Create Course

                    </Link>

                </motion.div>

            )}


            {/* =================================================
                COURSE CARDS
            ================================================= */}

            {courses.length > 0 && (

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {courses.map(
                        (course, index) => (

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

                                {/* Thumbnail */}

                                <div className="h-44 overflow-hidden bg-indigo-100">

                                    {course.thumbnail ? (

                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center text-indigo-300">

                                            <BookOpen size={55} />

                                        </div>

                                    )}

                                </div>


                                {/* Content */}

                                <div className="p-6">

                                    <div className="flex items-start justify-between gap-3">

                                        <div className="min-w-0">

                                            <h2 className="truncate text-xl font-bold text-gray-900">
                                                {course.title}
                                            </h2>

                                            <p className="mt-1 text-sm font-medium text-indigo-600">
                                                {course.subjectName ||
                                                    "Subject"}
                                            </p>

                                        </div>


                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                                course.published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >

                                            {course.published
                                                ? "Published"
                                                : "Draft"}

                                        </span>

                                    </div>


                                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">

                                        {course.description ||
                                            "No description provided."}

                                    </p>


                                    {/* Meta */}

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


                                    {/* Actions */}

                                    <div className="mt-6 grid grid-cols-2 gap-2">

                                        <Link
                                            to={`/tutor/lessons?courseId=${course.id}`}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                        >

                                            <BookOpen size={16} />

                                            Lessons

                                        </Link>


                                        <Link
                                            to={`/tutor/courses/${course.id}/edit`}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                        >

                                            <Edit size={16} />

                                            Edit

                                        </Link>

                                    </div>


                                    <div className="mt-2 grid grid-cols-2 gap-2">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handlePublishToggle(
                                                    course
                                                )
                                            }
                                            disabled={
                                                actionId === course.id
                                            }
                                            className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50 ${
                                                course.published
                                                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                                    : "bg-green-50 text-green-700 hover:bg-green-100"
                                            }`}
                                        >

                                            {actionId === course.id ? (

                                                <Loader2
                                                    size={15}
                                                    className="animate-spin"
                                                />

                                            ) : course.published ? (

                                                <EyeOff size={15} />

                                            ) : (

                                                <CheckCircle size={15} />

                                            )}

                                            {course.published
                                                ? "Unpublish"
                                                : "Publish"}

                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    course.id
                                                )
                                            }
                                            disabled={
                                                actionId === course.id
                                            }
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                        >

                                            <Trash2 size={15} />

                                            Delete

                                        </button>

                                    </div>

                                </div>

                            </motion.div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}