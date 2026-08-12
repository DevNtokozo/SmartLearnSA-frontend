import { useEffect, useState } from "react";
import {
    Link,
    useSearchParams
} from "react-router-dom";
import { motion } from "framer-motion";
import {
    Plus,
    FileText,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    ClipboardCheck,
    Calendar,
    BookOpen,
    Loader2,
    AlertCircle
} from "lucide-react";

import {
    getTutorAssignments,
    deleteAssignment
} from "../../api/assignmentApi";

export default function TutorAssignments() {

    const [searchParams] =
        useSearchParams();

    const courseId =
        searchParams.get("courseId");


    const [assignments, setAssignments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deletingId, setDeletingId] =
        useState(null);


    // =========================================================
    // LOAD ASSIGNMENTS
    // =========================================================

    useEffect(() => {

        loadAssignments();

    }, []);


    const loadAssignments = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTutorAssignments();

            setAssignments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load assignments:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load assignments."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (assignmentId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this assignment?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(assignmentId);

            await deleteAssignment(
                assignmentId
            );

            setAssignments(
                previous =>
                    previous.filter(
                        assignment =>
                            assignment.id !==
                            assignmentId
                    )
            );

        } catch (error) {

            console.error(
                "Failed to delete assignment:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete assignment."
            );

        } finally {

            setDeletingId(null);
        }
    };


    // =========================================================
    // FILTER
    // =========================================================

    const displayedAssignments =
        courseId
            ? assignments.filter(
                assignment =>
                    String(
                        assignment.courseId
                    ) === String(courseId)
            )
            : assignments;


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
                        Loading assignments...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

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
                transition={{
                    duration: 0.5
                }}
                className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
            >

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                            <FileText size={25} />

                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Assignments
                            </h1>

                            <p className="mt-1 text-gray-500">
                                Create and manage assignments for your students.
                            </p>

                        </div>

                    </div>

                </div>


                <Link
                    to={
                        courseId
                            ? `/tutor/assignments/create?courseId=${courseId}`
                            : "/tutor/assignments/create"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg"
                >

                    <Plus size={19} />

                    Create Assignment

                </Link>

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
                    className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                >

                    <AlertCircle size={20} />

                    {error}

                </motion.div>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!error &&
                displayedAssignments.length === 0 && (

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

                            <FileText size={28} />

                        </div>

                        <h2 className="mt-5 text-xl font-bold text-gray-900">
                            No assignments yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-gray-500">
                            Create your first assignment and give your students something to work on.
                        </p>

                        <Link
                            to={
                                courseId
                                    ? `/tutor/assignments/create?courseId=${courseId}`
                                    : "/tutor/assignments/create"
                            }
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                        >

                            <Plus size={18} />

                            Create Assignment

                        </Link>

                    </motion.div>

                )}


            {/* =================================================
                ASSIGNMENT CARDS
            ================================================= */}

            {displayedAssignments.length > 0 && (

                <div className="grid gap-6 lg:grid-cols-2">

                    {displayedAssignments.map(
                        (
                            assignment,
                            index
                        ) => (

                            <motion.div
                                key={assignment.id}
                                initial={{
                                    opacity: 0,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                transition={{
                                    delay:
                                        index * 0.06
                                }}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* =================================================
                                    CARD HEADER
                                ================================================= */}

                                <div className="p-6">

                                    <div className="flex items-start justify-between gap-4">

                                        <div className="flex min-w-0 items-start gap-4">

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                                <FileText
                                                    size={23}
                                                />

                                            </div>


                                            <div className="min-w-0">

                                                <h2 className="truncate text-lg font-bold text-gray-900">

                                                    {assignment.title}

                                                </h2>


                                                {assignment.courseTitle && (

                                                    <div className="mt-1 flex items-center gap-1 text-sm text-indigo-600">

                                                        <BookOpen
                                                            size={14}
                                                        />

                                                        {assignment.courseTitle}

                                                    </div>

                                                )}

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
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


                                    {/* =================================================
                                        DESCRIPTION
                                    ================================================= */}

                                    {assignment.description && (

                                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">

                                            {assignment.description}

                                        </p>

                                    )}


                                    {/* =================================================
                                        META
                                    ================================================= */}

                                    <div className="mt-5 flex flex-wrap gap-2">

                                        {assignment.totalMarks != null && (

                                            <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">

                                                {assignment.totalMarks} marks

                                            </span>

                                        )}


                                        {assignment.dueDate && (

                                            <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">

                                                <Calendar size={13} />

                                                {new Date(
                                                    assignment.dueDate
                                                ).toLocaleDateString()}

                                            </span>

                                        )}


                                        {assignment.lessonTitle && (

                                            <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">

                                                Lesson:{" "}
                                                {assignment.lessonTitle}

                                            </span>

                                        )}

                                    </div>

                                </div>


                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <div className="flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50 p-4">

                                    {/* EDIT */}

                                    <Link
                                        to={`/tutor/assignments/${assignment.id}/edit`}
                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                                    >

                                        <Pencil size={15} />

                                        Edit

                                    </Link>


                                    {/* SUBMISSIONS */}

                                    <Link
                                        to={`/tutor/assignments/${assignment.id}/submissions`}
                                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                    >

                                        <ClipboardCheck
                                            size={15}
                                        />

                                        Submissions

                                    </Link>


                                    {/* DELETE */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                assignment.id
                                            )
                                        }
                                        disabled={
                                            deletingId ===
                                            assignment.id
                                        }
                                        className="ml-auto inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {deletingId ===
                                        assignment.id ? (

                                            <Loader2
                                                size={15}
                                                className="animate-spin"
                                            />

                                        ) : (

                                            <Trash2
                                                size={15}
                                            />

                                        )}

                                        Delete

                                    </button>

                                </div>

                            </motion.div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}