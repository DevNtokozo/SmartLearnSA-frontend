
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    ExternalLink,
    Link2,
    Plus,
    Trash2,
    Video,
    XCircle
} from "lucide-react";

import {
    getCourseLessons,
    publishLesson,
    unpublishLesson,
    deleteLesson
} from "../../api/lessonApi";


export default function TutorLessons() {

    const [searchParams] =
        useSearchParams();

    const courseId =
        searchParams.get("courseId");


    // =========================================================
    // STATE
    // =========================================================

    const [lessons, setLessons] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(null);


    // =========================================================
    // LOAD LESSONS
    // =========================================================

    useEffect(() => {

        if (!courseId) {

            setError(
                "No course selected."
            );

            setLoading(false);

            return;
        }

        loadLessons();

    }, [courseId]);


    const loadLessons = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getCourseLessons(courseId);

            setLessons(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load lessons:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load lessons."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // PUBLISH / UNPUBLISH
    // =========================================================

    const handlePublishToggle = async (
        lesson
    ) => {

        try {

            setActionLoading(
                `publish-${lesson.id}`
            );

            setError("");


            let updatedLesson;


            if (lesson.published) {

                updatedLesson =
                    await unpublishLesson(
                        lesson.id
                    );

            } else {

                updatedLesson =
                    await publishLesson(
                        lesson.id
                    );
            }


            setLessons((previous) =>
                previous.map((item) =>
                    item.id === lesson.id
                        ? updatedLesson
                        : item
                )
            );

        } catch (error) {

            console.error(
                "Failed to update lesson:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update lesson."
            );

        } finally {

            setActionLoading(null);
        }
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (
        lesson
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${lesson.title}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(
                `delete-${lesson.id}`
            );

            setError("");


            await deleteLesson(
                lesson.id
            );


            setLessons((previous) =>
                previous.filter(
                    (item) =>
                        item.id !== lesson.id
                )
            );

        } catch (error) {

            console.error(
                "Failed to delete lesson:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete lesson."
            );

        } finally {

            setActionLoading(null);
        }
    };


    // =========================================================
    // NO COURSE
    // =========================================================

    if (!courseId) {

        return (

            <div className="mx-auto max-w-3xl">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
                >

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <XCircle size={28} />
                    </div>


                    <h1 className="mt-4 text-2xl font-bold text-gray-900">
                        No Course Selected
                    </h1>


                    <p className="mt-2 text-gray-600">
                        Please select a course to view its lessons.
                    </p>


                    <Link
                        to="/tutor/courses"
                        className="mt-6 inline-flex items-center rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                    >
                        Go to My Courses
                    </Link>

                </motion.div>

            </div>
        );
    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    className="text-center"
                >

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

                    <p className="mt-4 text-gray-500">
                        Loading lessons...
                    </p>

                </motion.div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="mx-auto max-w-6xl space-y-8">

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

                <Link
                    to="/tutor/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back to My Courses

                </Link>


                <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">

                            <BookOpen
                                size={28}
                            />

                        </div>


                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Course Lessons
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Create and manage lessons for your course.
                            </p>

                        </div>

                    </div>


                    <Link
                        to={`/tutor/lessons/create?courseId=${courseId}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg"
                    >

                        <Plus
                            size={19}
                        />

                        Create Lesson

                    </Link>

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
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                >

                    <XCircle
                        size={20}
                        className="mt-0.5 shrink-0"
                    />

                    <p>
                        {error}
                    </p>

                </motion.div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 15
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    delay: 0.1
                }}
                className="grid gap-4 sm:grid-cols-3"
            >

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Total Lessons
                    </p>

                    <p className="mt-1 text-3xl font-bold text-gray-900">
                        {lessons.length}
                    </p>

                </div>


                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Published
                    </p>

                    <p className="mt-1 text-3xl font-bold text-green-600">
                        {
                            lessons.filter(
                                (lesson) =>
                                    lesson.published
                            ).length
                        }
                    </p>

                </div>


                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                    <p className="text-sm text-gray-500">
                        Drafts
                    </p>

                    <p className="mt-1 text-3xl font-bold text-yellow-600">
                        {
                            lessons.filter(
                                (lesson) =>
                                    !lesson.published
                            ).length
                        }
                    </p>

                </div>

            </motion.div>


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {lessons.length === 0 && (

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.96
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center"
                >

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">

                        <BookOpen
                            size={30}
                        />

                    </div>


                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        No lessons yet
                    </h2>


                    <p className="mx-auto mt-2 max-w-md text-gray-500">
                        Start building your course by creating your first lesson.
                    </p>


                    <Link
                        to={`/tutor/lessons/create?courseId=${courseId}`}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                    >

                        <Plus
                            size={18}
                        />

                        Create First Lesson

                    </Link>

                </motion.div>

            )}


            {/* =================================================
                LESSONS
            ================================================= */}

            {lessons.length > 0 && (

                <div className="space-y-5">

                    {lessons.map(
                        (lesson, index) => (

                            <motion.div
                                key={lesson.id}
                                initial={{
                                    opacity: 0,
                                    x: -25
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0
                                }}
                                transition={{
                                    duration: 0.4,
                                    delay:
                                        0.08 * index
                                }}
                                whileHover={{
                                    y: -2
                                }}
                                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg sm:p-6"
                            >

                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                                    {/* =================================================
                                        LESSON INFO
                                    ================================================= */}

                                    <div className="flex min-w-0 gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">

                                            {lesson.lessonOrder}

                                        </div>


                                        <div className="min-w-0">

                                            <div className="flex flex-wrap items-center gap-3">

                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {lesson.title}
                                                </h2>


                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        lesson.published
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                                >

                                                    {lesson.published
                                                        ? "Published"
                                                        : "Draft"}

                                                </span>

                                            </div>


                                            <p className="mt-2 max-w-3xl text-gray-500">

                                                {lesson.description ||
                                                    "No description provided."}

                                            </p>


                                            <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500">

                                                {lesson.videoUrl && (

                                                    <a
                                                        href={
                                                            lesson.videoUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-700"
                                                    >

                                                        <Video
                                                            size={16}
                                                        />

                                                        Video

                                                        <ExternalLink
                                                            size={13}
                                                        />

                                                    </a>

                                                )}


                                                {lesson.resourceUrl && (

                                                    <a
                                                        href={
                                                            lesson.resourceUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 font-medium text-indigo-600 hover:text-indigo-700"
                                                    >

                                                        <Link2
                                                            size={16}
                                                        />

                                                        Resource

                                                        <ExternalLink
                                                            size={13}
                                                        />

                                                    </a>

                                                )}

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        ACTIONS
                                    ================================================= */}

                                    <div className="flex shrink-0 flex-wrap gap-2">

                                        {/* Publish */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handlePublishToggle(
                                                    lesson
                                                )
                                            }
                                            disabled={
                                                actionLoading ===
                                                `publish-${lesson.id}`
                                            }
                                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                                lesson.published
                                                    ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                                    : "bg-green-50 text-green-700 hover:bg-green-100"
                                            }`}
                                        >

                                            {actionLoading ===
                                            `publish-${lesson.id}` ? (

                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

                                            ) : lesson.published ? (

                                                <XCircle
                                                    size={16}
                                                />

                                            ) : (

                                                <CheckCircle
                                                    size={16}
                                                />

                                            )}


                                            {lesson.published
                                                ? "Unpublish"
                                                : "Publish"}

                                        </button>


                                        {/* Delete */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(
                                                    lesson
                                                )
                                            }
                                            disabled={
                                                actionLoading ===
                                                `delete-${lesson.id}`
                                            }
                                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >

                                            {actionLoading ===
                                            `delete-${lesson.id}` ? (

                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />

                                            ) : (

                                                <Trash2
                                                    size={16}
                                                />

                                            )}

                                            Delete

                                        </button>

                                    </div>

                                </div>


                                {/* =================================================
                                    CONTENT PREVIEW
                                ================================================= */}

                                {lesson.content && (

                                    <div className="mt-5 border-t border-gray-100 pt-5">

                                        <p className="line-clamp-3 whitespace-pre-line text-sm leading-6 text-gray-600">

                                            {lesson.content}

                                        </p>

                                    </div>

                                )}

                            </motion.div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

