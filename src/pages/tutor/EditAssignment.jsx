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
    Calendar,
    FileText,
    Loader2,
    Save
} from "lucide-react";

import {
    getAssignment,
    updateAssignment
} from "../../api/assignmentApi";

import {
    getCourse
} from "../../api/courseApi";

import {
    getCourseLessons
} from "../../api/lessonApi";


export default function EditAssignment() {

    const navigate = useNavigate();

    const { id } = useParams();


    // =========================================================
    // STATE
    // =========================================================

    const [assignment, setAssignment] =
        useState(null);

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
    // LOAD ASSIGNMENT
    // =========================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Assignment ID is missing."
            );

            setLoading(false);

            return;
        }

        loadAssignment();

    }, [id]);


    // =========================================================
    // LOAD ASSIGNMENT DATA
    // =========================================================

    const loadAssignment = async () => {

        try {

            setLoading(true);

            setError("");


            // -------------------------------------------------
            // GET ASSIGNMENT
            // -------------------------------------------------

            const assignmentData =
                await getAssignment(id);


            setAssignment(
                assignmentData
            );


            // -------------------------------------------------
            // POPULATE FORM
            // -------------------------------------------------

            setForm({

                title:
                    assignmentData.title || "",

                description:
                    assignmentData.description || "",

                instructions:
                    assignmentData.instructions || "",

                totalMarks:
                    assignmentData.totalMarks ?? "",

                dueDate:
                    formatDateTimeLocal(
                        assignmentData.dueDate
                    ),

                resourceUrl:
                    assignmentData.resourceUrl || "",

                lessonId:
                    assignmentData.lessonId ?? ""

            });


            // -------------------------------------------------
            // LOAD COURSE
            // -------------------------------------------------

            if (
                assignmentData.courseId
            ) {

                const courseData =
                    await getCourse(
                        assignmentData.courseId
                    );


                setCourse(
                    courseData
                );


                // -------------------------------------------------
                // LOAD LESSONS
                // -------------------------------------------------

                try {

                    const lessonData =
                        await getCourseLessons(
                            assignmentData.courseId
                        );


                    setLessons(

                        Array.isArray(
                            lessonData
                        )
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

            }

        } catch (error) {

            console.error(
                "Failed to load assignment:",
                error
            );


            setError(

                error.response?.data?.message ||
                "Failed to load assignment."

            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // FORMAT DATETIME
    // =========================================================

    const formatDateTimeLocal = (
        value
    ) => {

        if (!value) {

            return "";

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "";

        }


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        const hours =
            String(
                date.getHours()
            ).padStart(2, "0");


        const minutes =
            String(
                date.getMinutes()
            ).padStart(2, "0");


        return (
            `${year}-${month}-${day}T${hours}:${minutes}`
        );

    };


    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setForm(
            previous => ({

                ...previous,

                [name]: value

            })
        );

    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");


        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (
            !form.title.trim()
        ) {

            setError(
                "Assignment title is required."
            );

            return;

        }


        if (
            !form.totalMarks
        ) {

            setError(
                "Total marks are required."
            );

            return;

        }


        if (
            Number(
                form.totalMarks
            ) <= 0
        ) {

            setError(
                "Total marks must be greater than zero."
            );

            return;

        }


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        try {

            setSaving(true);


            // -------------------------------------------------
            // REQUEST DATA
            // -------------------------------------------------

            const data = {

                courseId:
                    assignment.courseId,

                lessonId:
                    form.lessonId
                        ? Number(
                            form.lessonId
                        )
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
                    Number(
                        form.totalMarks
                    ),

                dueDate:
                    form.dueDate
                        ? form.dueDate
                        : null,

                resourceUrl:
                    form.resourceUrl.trim()
                        || null

            };


            // -------------------------------------------------
            // UPDATE ASSIGNMENT
            // -------------------------------------------------

            const updatedAssignment =
                await updateAssignment(
                    id,
                    data
                );


            // -------------------------------------------------
            // UPDATE LOCAL STATE
            // -------------------------------------------------

            setAssignment(
                updatedAssignment
            );


            // -------------------------------------------------
            // REDIRECT
            // -------------------------------------------------

            navigate(
                `/tutor/assignments?courseId=${updatedAssignment.courseId}`
            );

        } catch (error) {

            console.error(
                "Failed to update assignment:",
                error
            );


            setError(

                error.response?.data?.message ||
                "Failed to update assignment."

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
                        Loading assignment...
                    </p>

                </div>

            </div>

        );

    }


    // =========================================================
    // ERROR WITHOUT ASSIGNMENT
    // =========================================================

    if (
        error &&
        !assignment
    ) {

        return (

            <div className="mx-auto max-w-3xl">

                <Link
                    to="/tutor/assignments"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back to Assignments

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">

                        <FileText
                            size={26}
                        />

                    </div>


                    <h1 className="mt-4 text-xl font-bold text-red-800">

                        Unable to load assignment

                    </h1>


                    <p className="mt-2 text-red-700">

                        {error}

                    </p>

                </div>

            </div>

        );

    }


    if (!assignment) {

        return null;

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
            className="mx-auto max-w-3xl pb-10"
        >

            {/* =================================================
                BACK
            ================================================= */}

            <Link
                to={`/tutor/assignments?courseId=${assignment.courseId}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >

                <ArrowLeft
                    size={18}
                />

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

                <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <FileText
                            size={25}
                        />

                    </div>


                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">

                            Edit Assignment

                        </h1>


                        <p className="mt-1 text-gray-500">

                            Update the assignment details.

                        </p>

                    </div>

                </div>


                {/* =================================================
                    COURSE
                ================================================= */}

                {course && (

                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">

                        <BookOpen
                            size={18}
                        />

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
                        maxLength={150}
                        required
                        placeholder="e.g. Algebra Assignment 1"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >

                        <option value="">
                            No specific lesson
                        </option>


                        {lessons.map(
                            lesson => (

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

                        Optionally associate this assignment with a lesson.

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
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />

                </div>


                {/* =================================================
                    MARKS + DUE DATE
                ================================================= */}

                <div className="grid gap-6 sm:grid-cols-2">

                    {/* =================================================
                        TOTAL MARKS
                    ================================================= */}

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
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* =================================================
                        DUE DATE
                    ================================================= */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">

                            <span className="flex items-center gap-2">

                                <Calendar
                                    size={16}
                                />

                                Due Date

                            </span>

                        </label>


                        <input
                            type="datetime-local"
                            name="dueDate"
                            value={form.dueDate}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />


                        <p className="mt-2 text-xs text-gray-500">

                            Optional deadline for students.

                        </p>

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
                        placeholder="https://example.com/resource.pdf"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />


                    <p className="mt-2 text-xs text-gray-500">

                        Optional link to a worksheet, PDF, video, or other learning resource.

                    </p>

                </div>


                {/* =================================================
                    ASSIGNMENT STATUS
                ================================================= */}

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-semibold text-gray-700">

                                Assignment Status

                            </p>

                            <p className="mt-1 text-xs text-gray-500">

                                Publishing is managed separately from editing.

                            </p>

                        </div>


                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                assignment.published
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                        >

                            {assignment.published
                                ? "Published"
                                : "Draft"}

                        </span>

                    </div>

                </div>


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

                    <Link
                        to={`/tutor/assignments?courseId=${assignment.courseId}`}
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

                                <Save
                                    size={18}
                                />

                                Save Changes

                            </>

                        )}

                    </button>

                </div>

            </motion.form>

        </motion.div>

    );
}