
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    ExternalLink,
    FileText,
    PlayCircle,
    Video,
    AlertCircle
} from "lucide-react";

import { getLesson } from "../../api/lessonApi";


export default function StudentLessonDetails() {

    const { id } = useParams();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD LESSON
    // =========================================================

    useEffect(() => {

        loadLesson();

    }, [id]);


    const loadLesson = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getLesson(id);

            setLesson(data);

        } catch (error) {

            console.error(
                "Failed to load lesson:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load lesson."
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

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

                    <p className="mt-4 text-gray-500">
                        Loading lesson...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error || !lesson) {

        return (
            <div className="mx-auto max-w-3xl">

                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <AlertCircle
                        className="mx-auto text-red-500"
                        size={40}
                    />

                    <h1 className="mt-4 text-2xl font-bold text-gray-900">
                        Unable to Load Lesson
                    </h1>

                    <p className="mt-2 text-red-600">
                        {error || "Lesson not found."}
                    </p>

                    <Link
                        to="/student/courses"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                    >
                        <ArrowLeft size={18} />
                        Back to Courses
                    </Link>

                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="mx-auto max-w-5xl space-y-8">

            {/* Back */}

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
                    to={`/student/courses/${lesson.courseId}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft size={18} />

                    Back to Course

                </Link>

            </motion.div>


            {/* Header */}

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
                className="rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg"
            >

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">

                        <BookOpen size={30} />

                    </div>

                    <div>

                        <div className="mb-2 flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                                Lesson {lesson.lessonOrder}
                            </span>

                            {lesson.published && (
                                <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs font-semibold text-green-100">
                                    Published
                                </span>
                            )}

                        </div>

                        <h1 className="text-3xl font-bold">
                            {lesson.title}
                        </h1>

                        {lesson.courseTitle && (
                            <p className="mt-2 text-indigo-100">
                                {lesson.courseTitle}
                            </p>
                        )}

                        {lesson.description && (
                            <p className="mt-4 max-w-3xl leading-7 text-indigo-100">
                                {lesson.description}
                            </p>
                        )}

                    </div>

                </div>

            </motion.div>


            {/* Content */}

            <motion.section
                initial={{
                    opacity: 0,
                    y: 25
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    delay: 0.15
                }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

                <div className="mb-6 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <FileText size={21} />

                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">
                        Lesson Content
                    </h2>

                </div>


                {lesson.content ? (

                    <div className="whitespace-pre-line text-base leading-8 text-gray-700">
                        {lesson.content}
                    </div>

                ) : (

                    <div className="rounded-xl bg-gray-50 p-8 text-center text-gray-500">
                        No lesson content has been added yet.
                    </div>

                )}

            </motion.section>


            {/* Video */}

            {lesson.videoUrl && (

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.2
                    }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">

                            <Video size={21} />

                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            Lesson Video
                        </h2>

                    </div>


                    <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between rounded-xl border border-gray-200 p-5 transition hover:border-indigo-300 hover:bg-indigo-50"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">

                                <PlayCircle size={25} />

                            </div>

                            <div>

                                <p className="font-semibold text-gray-900">
                                    Watch Lesson Video
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Open the lesson video
                                </p>

                            </div>

                        </div>


                        <ExternalLink
                            size={20}
                            className="text-gray-400 transition group-hover:text-indigo-600"
                        />

                    </a>

                </motion.section>

            )}


            {/* Resource */}

            {lesson.resourceUrl && (

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.25
                    }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                            <FileText size={21} />

                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            Learning Resource
                        </h2>

                    </div>


                    <a
                        href={lesson.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-gray-200 p-5 transition hover:border-indigo-300 hover:bg-indigo-50"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">

                                <FileText size={24} />

                            </div>

                            <div>

                                <p className="font-semibold text-gray-900">
                                    Open Learning Resource
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    View or download the additional resource
                                </p>

                            </div>

                        </div>


                        <ExternalLink
                            size={20}
                            className="text-gray-400"
                        />

                    </a>

                </motion.section>

            )}

        </div>
    );
}

