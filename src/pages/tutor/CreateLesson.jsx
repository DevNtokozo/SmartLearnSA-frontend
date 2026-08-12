import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams
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
    getCourse
} from "../../api/courseApi";

import {
    createLesson
} from "../../api/lessonApi";

export default function CreateLesson() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const courseId =
        searchParams.get("courseId");


    const [course, setCourse] =
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
    // LOAD COURSE
    // =========================================================

    useEffect(() => {

        if (!courseId) {

            setError(
                "No course selected."
            );

            setLoading(false);

            return;
        }

        loadCourse();

    }, [courseId]);


    const loadCourse = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getCourse(courseId);

            setCourse(data);

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
    // FORM
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


            await createLesson(
                courseId,
                data
            );


            navigate(
                `/tutor/lessons?courseId=${courseId}`
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to create lesson."
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

            <div className="mx-auto max-w-3xl">

                <Link
                    to="/tutor/courses"
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

            <Link
                to={`/tutor/lessons?courseId=${courseId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Lessons

            </Link>


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

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <FileText size={25} />

                    </div>


                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Create Lesson
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Add a new lesson to{" "}
                            <span className="font-semibold text-gray-700">
                                {course?.title}
                            </span>
                        </p>

                    </div>

                </div>


                <div className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">

                    <BookOpen size={18} />

                    <span>
                        Course:
                    </span>

                    <span className="font-bold">
                        {course?.title}
                    </span>

                </div>

            </motion.div>


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
                        Controls the order in which lessons appear.
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
                        This is the main learning material students will read.
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
                        Optional PDF, worksheet, or additional learning resource.
                    </p>

                </div>


                {/* ACTIONS */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                    <Link
                        to={`/tutor/lessons?courseId=${courseId}`}
                        className="rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
                    >

                        Cancel

                    </Link>


                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {saving ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Creating...

                            </>

                        ) : (

                            <>
                                <Save size={18} />

                                Create Lesson

                            </>

                        )}

                    </button>

                </div>

            </motion.form>

        </motion.div>
    );
}