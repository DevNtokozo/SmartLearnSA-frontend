
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
    Calendar,
    FileText,
    Loader2,
    Save
} from "lucide-react";

import {
    createAssignment
} from "../../api/assignmentApi";

import {
    getCourse
} from "../../api/courseApi";

import {
    getCourseLessons
} from "../../api/lessonApi";

export default function CreateAssignment() {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const courseId =
        searchParams.get("courseId");


    // =========================================================
    // STATE
    // =========================================================

    const [course, setCourse] =
        useState(null);

    const [lessons, setLessons] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    const [form, setForm] = useState({

        title: "",
        description: "",
        instructions: "",
        totalMarks: "",
        dueDate: "",
        resourceUrl: "",
        lessonId: ""

    });


    // =========================================================
    // LOAD COURSE + LESSONS
    // =========================================================

    useEffect(() => {

        if (!courseId) {

            setError(
                "No course selected."
            );

            setLoading(false);

            return;
        }

        loadCourseData();

    }, [courseId]);


    const loadCourseData = async () => {

        try {

            setLoading(true);

            setError("");


            // ---------------------------------------------
            // LOAD COURSE
            // ---------------------------------------------

            const courseData =
                await getCourse(courseId);

            setCourse(courseData);


            // ---------------------------------------------
            // LOAD LESSONS
            // ---------------------------------------------

            try {

                const lessonData =
                    await getCourseLessons(courseId);

                setLessons(
                    Array.isArray(lessonData)
                        ? lessonData
                        : []
                );

            } catch (lessonError) {

                console.error(
                    "Failed to load lessons:",
                    lessonError
                );

                setLessons([]);

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
    // FORM CHANGE
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


        // -----------------------------------------------------
        // COURSE VALIDATION
        // -----------------------------------------------------

        if (!courseId) {

            setError(
                "Course ID is missing."
            );

            return;
        }


        // -----------------------------------------------------
        // TITLE VALIDATION
        // -----------------------------------------------------

        if (!form.title.trim()) {

            setError(
                "Assignment title is required."
            );

            return;
        }


        // -----------------------------------------------------
        // MARK VALIDATION
        // -----------------------------------------------------

        if (!form.totalMarks) {

            setError(
                "Total marks are required."
            );

            return;
        }


        if (
            Number(form.totalMarks) <= 0
        ) {

            setError(
                "Total marks must be greater than zero."
            );

            return;
        }


        try {

            setSaving(true);


            // -------------------------------------------------
            // REQUEST DATA
            // -------------------------------------------------

            const data = {

                courseId:
                    Number(courseId),

                lessonId:
                    form.lessonId
                        ? Number(form.lessonId)
                        : null,

                title:
                    form.title.trim(),

                description:
                    form.description.trim()
                        || null,

                instructions:
                    form.instructions.trim()
                        || null,

                totalMarks:
                    Number(form.totalMarks),

                dueDate:
                    form.dueDate
                        ? form.dueDate
                        : null,

                resourceUrl:
                    form.resourceUrl.trim()
                        || null

            };


            // -------------------------------------------------
            // CREATE
            // -------------------------------------------------

            await createAssignment(data);


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            navigate(
                `/tutor/assignments?courseId=${courseId}`
            );

        } catch (error) {

            console.error(
                "Failed to create assignment:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create assignment."
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
                        size={38}
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
    // ERROR WITHOUT COURSE
    // =========================================================

    if (error && !course) {

        return (

            <div className="mx-auto max-w-3xl">

                <Link
                    to="/tutor/assignments"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft size={18} />

                    Back to Assignments

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


    // =========================================================
    // PAGE
    // =========================================================

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

            className="mx-auto max-w-3xl"
        >


            {/* =================================================
                BACK
            ================================================= */}

            <Link
                to={`/tutor/assignments?courseId=${courseId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Assignments

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

                transition={{
                    delay: 0.1
                }}

                className="mt-6"
            >

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <FileText size={25} />

                    </div>


                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            Create Assignment
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Add an assignment for your students.
                        </p>

                    </div>

                </div>


                {/* Course */}

                {course && (

                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">

                        <BookOpen size={18} />

                        <span>
                            Course:
                        </span>

                        <span className="font-bold">
                            {course.title}
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
                    delay: 0.15
                }}

                className="mt-8 space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >


                {/* =================================================
                    TITLE
                ================================================= */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Assignment Title

                        <span className="ml-1 text-red-500">
                            *
                        </span>

                    </label>


                    <input

                        type="text"

                        name="title"

                        value={form.title}

                        onChange={handleChange}

                        placeholder="e.g. Algebra Assignment 1"

                        maxLength={150}

                        required

                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                </div>


                {/* =================================================
                    LESSON
                ================================================= */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Lesson

                    </label>


                    <select

                        name="lessonId"

                        value={form.lessonId}

                        onChange={handleChange}

                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >

                        <option value="">
                            No specific lesson
                        </option>


                        {lessons.map(
                            (lesson) => (

                                <option
                                    key={lesson.id}
                                    value={lesson.id}
                                >

                                    {lesson.lessonOrder != null
                                        ? `${lesson.lessonOrder}. `
                                        : ""}

                                    {lesson.title}

                                </option>

                            )
                        )}

                    </select>


                    <p className="mt-2 text-xs text-gray-500">

                        Optionally associate this assignment
                        with a lesson.

                    </p>

                </div>


                {/* =================================================
                    DESCRIPTION
                ================================================= */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Description

                    </label>


                    <textarea

                        name="description"

                        value={form.description}

                        onChange={handleChange}

                        rows={4}

                        placeholder="Describe what students need to complete..."

                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                </div>


                {/* =================================================
                    INSTRUCTIONS
                ================================================= */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Instructions

                    </label>


                    <textarea

                        name="instructions"

                        value={form.instructions}

                        onChange={handleChange}

                        rows={6}

                        placeholder="Give students detailed instructions..."

                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                </div>


                {/* =================================================
                    MARKS + DUE DATE
                ================================================= */}

                <div className="grid gap-6 sm:grid-cols-2">


                    {/* Total Marks */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">

                            Total Marks

                            <span className="ml-1 text-red-500">
                                *
                            </span>

                        </label>


                        <input

                            type="number"

                            name="totalMarks"

                            value={form.totalMarks}

                            onChange={handleChange}

                            min="1"

                            required

                            placeholder="50"

                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* Due Date */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">

                            <span className="flex items-center gap-2">

                                <Calendar size={16} />

                                Due Date

                            </span>

                        </label>


                        <input

                            type="datetime-local"

                            name="dueDate"

                            value={form.dueDate}

                            onChange={handleChange}

                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>

                </div>


                {/* =================================================
                    RESOURCE URL
                ================================================= */}

                <div>

                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                        Resource URL

                    </label>


                    <input

                        type="url"

                        name="resourceUrl"

                        value={form.resourceUrl}

                        onChange={handleChange}

                        placeholder="https://example.com/assignment-resource.pdf"

                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />


                    <p className="mt-2 text-xs text-gray-500">

                        Optional link to a worksheet, PDF,
                        video, or other resource.

                    </p>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">


                    <Link

                        to={`/tutor/assignments?courseId=${courseId}`}

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

                                Creating...

                            </>

                        ) : (

                            <>

                                <Save size={18} />

                                Create Assignment

                            </>

                        )}

                    </button>

                </div>

            </motion.form>

        </motion.div>
    );
}

