import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    BookOpen,
    FileText,
    Loader2,
    Save,
    Video
} from "lucide-react";

import {
    getLesson,
    updateLesson
} from "../../api/lessonApi";

export default function EditLesson() {

    const navigate = useNavigate();

    const { id } = useParams();


    // =========================================================
    // STATE
    // =========================================================

    const [lesson, setLesson] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [form, setForm] =
        useState({

            title: "",
            description: "",
            content: "",
            videoUrl: "",
            resourceUrl: "",
            lessonOrder: ""

        });


    // =========================================================
    // LOAD LESSON
    // =========================================================

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


            setForm({

                title:
                    data.title || "",

                description:
                    data.description || "",

                content:
                    data.content || "",

                videoUrl:
                    data.videoUrl || "",

                resourceUrl:
                    data.resourceUrl || "",

                lessonOrder:
                    data.lessonOrder ?? ""

            });

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
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        if (!form.title.trim()) {

            setError(
                "Lesson title is required."
            );

            return;
        }


        if (
            form.lessonOrder !== "" &&
            Number(form.lessonOrder) < 1
        ) {

            setError(
                "Lesson order must be at least 1."
            );

            return;
        }


        try {

            setSaving(true);


            const data = {

                title:
                    form.title.trim(),

                description:
                    form.description.trim()
                        || null,

                content:
                    form.content.trim()
                        || null,

                videoUrl:
                    form.videoUrl.trim()
                        || null,

                resourceUrl:
                    form.resourceUrl.trim()
                        || null,

                lessonOrder:
                    form.lessonOrder !== ""
                        ? Number(
                            form.lessonOrder
                        )
                        : null

            };


            const updatedLesson =
                await updateLesson(
                    id,
                    data
                );


            setLesson(
                updatedLesson
            );


            navigate(
                `/tutor/lessons?courseId=${updatedLesson.courseId}`
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

            setSaving(false);
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
                        Loading lesson...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error && !lesson) {

        return (

            <div className="mx-auto max-w-3xl">

                <Link
                    to="/tutor/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft size={18} />

                    Back to Courses

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">

                        <FileText size={26} />

                    </div>


                    <h1 className="mt-4 text-xl font-bold text-red-800">

                        Unable to load lesson

                    </h1>


                    <p className="mt-2 text-red-700">

                        {error}

                    </p>

                </div>

            </div>
        );
    }


    if (!lesson) {
        return null;
    }


    return (

        <motion.div
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
            className="mx-auto max-w-3xl pb-10"
        >

            {/* =================================================
                BACK
            ================================================= */}

            <Link
                to={`/tutor/lessons?courseId=${lesson.courseId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Lessons

            </Link>


            {/* =================================================
                HEADER
            ================================================= */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: -15
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                className="mt-6"
            >

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <FileText size={25} />

                    </div>


                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">

                            Edit Lesson

                        </h1>


                        <p className="mt-1 text-gray-500">

                            Update your lesson content and resources.

                        </p>

                    </div>

                </div>


                {lesson.courseTitle && (

                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">

                        <BookOpen size={18} />

                        <span>
                            Course:
                        </span>

                        <span className="font-bold">
                            {lesson.courseTitle}
                        </span>

                    </div>

                )}

            </motion.div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >

                    {error}

                </motion.div>

            )}


            {/* =================================================
                FORM
            ================================================= */}

            <motion.form
                onSubmit={handleSubmit}
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
                className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

                {/* TITLE */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Lesson Title *

                    </label>

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={150}
                        required
                        placeholder="e.g. Introduction to Algebra"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                </div>


                {/* ORDER */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Lesson Order

                    </label>

                    <input
                        type="number"
                        name="lessonOrder"
                        value={form.lessonOrder}
                        onChange={handleChange}
                        min="1"
                        placeholder="1"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                    <p className="mt-2 text-xs text-gray-500">

                        Controls the order of the lesson within the course.

                    </p>

                </div>


                {/* DESCRIPTION */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Description

                    </label>

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Briefly describe this lesson..."
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                </div>


                {/* CONTENT */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Lesson Content

                    </label>

                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        rows={12}
                        placeholder="Write the lesson content here..."
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                    <p className="mt-2 text-xs text-gray-500">

                        This is the main material students will read.

                    </p>

                </div>


                {/* VIDEO */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Video URL

                    </label>

                    <div className="relative">

                        <Video
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="url"
                            name="videoUrl"
                            value={form.videoUrl}
                            onChange={handleChange}
                            placeholder="https://youtube.com/..."
                            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>

                </div>


                {/* RESOURCE */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Resource URL

                    </label>

                    <input
                        type="url"
                        name="resourceUrl"
                        value={form.resourceUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/worksheet.pdf"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                    <p className="mt-2 text-xs text-gray-500">

                        Optional PDF, worksheet, or other learning material.

                    </p>

                </div>


                {/* STATUS */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-sm font-semibold text-gray-700">

                                Lesson Status

                            </p>

                            <p className="mt-1 text-xs text-gray-500">

                                Publishing is controlled from the lessons list.

                            </p>

                        </div>


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

                </div>


                {/* ACTIONS */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                    <Link
                        to={`/tutor/lessons?courseId=${lesson.courseId}`}
                        className="rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
                    >

                        Cancel

                    </Link>


                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {saving ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Saving...

                            </>

                        ) : (

                            <>
                                <Save size={18} />

                                Save Changes

                            </>

                        )}

                    </button>

                </div>

            </motion.form>

        </motion.div>
    );
}