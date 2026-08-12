import { useEffect, useState } from "react";
import {
    Link,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    BookOpen,
    ExternalLink,
    FileText,
    Loader2,
    PlayCircle
} from "lucide-react";

import {
    getLesson
} from "../../api/lessonApi";

export default function LessonDetails() {

    const { id } = useParams();


    const [lesson, setLesson] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (!id) {

            setError(
                "Lesson ID is missing."
            );

            setLoading(false);

            return;
        }

        loadLesson();

    }, [id]);


    const loadLesson = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getLesson(id);

            setLesson(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load lesson."
            );

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <Loader2
                        size={40}
                        className="mx-auto animate-spin text-indigo-600"
                    />

                    <p className="mt-4 text-gray-500">
                        Loading lesson...
                    </p>

                </div>

            </div>
        );
    }


    if (error || !lesson) {

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
                        Unable to load lesson
                    </h1>

                    <p className="mt-2 text-red-700">
                        {error || "Lesson not found."}
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="mx-auto max-w-4xl space-y-8">

            {/* Back */}

            <Link
                to={`/student/courses/${lesson.courseId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Course

            </Link>


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
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

                <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">

                        <BookOpen size={28} />

                    </div>


                    <div className="min-w-0">

                        <p className="text-sm font-semibold text-indigo-600">
                            {lesson.courseTitle}
                        </p>

                        <h1 className="mt-2 text-3xl font-bold text-gray-900">
                            {lesson.title}
                        </h1>


                        {lesson.description && (

                            <p className="mt-3 leading-7 text-gray-600">
                                {lesson.description}
                            </p>

                        )}

                    </div>

                </div>

            </motion.div>


            {/* Video */}

            {lesson.videoUrl && (

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >

                    <div className="flex items-center gap-3">

                        <PlayCircle
                            size={22}
                            className="text-indigo-600"
                        />

                        <h2 className="text-xl font-bold text-gray-900">
                            Lesson Video
                        </h2>

                    </div>


                    <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                    >

                        Open Video

                        <ExternalLink size={17} />

                    </a>

                </motion.section>
            )}


            {/* Content */}

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

                <div className="flex items-center gap-3">

                    <FileText
                        size={22}
                        className="text-indigo-600"
                    />

                    <h2 className="text-xl font-bold text-gray-900">
                        Lesson Content
                    </h2>

                </div>


                <div className="mt-6 whitespace-pre-wrap leading-8 text-gray-700">

                    {lesson.content ||
                        "No lesson content has been provided."}

                </div>

            </motion.section>


            {/* Resource */}

            {lesson.resourceUrl && (

                <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <h2 className="font-bold text-gray-900">
                                Additional Resource
                            </h2>

                            <p className="mt-1 text-sm text-gray-600">
                                Open the supplementary learning material.
                            </p>

                        </div>


                        <a
                            href={lesson.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                        >

                            Open

                            <ExternalLink size={16} />

                        </a>

                    </div>

                </section>
            )}

        </div>
    );
}