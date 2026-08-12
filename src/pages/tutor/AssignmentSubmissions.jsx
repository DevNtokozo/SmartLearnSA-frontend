import { useEffect, useState } from "react";
import {
    Link,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    CheckCircle,
    ExternalLink,
    FileText,
    Loader2,
    Send,
    User
} from "lucide-react";

import {
    getAssignment,
    getAssignmentSubmissions,
    gradeSubmission
} from "../../api/assignmentApi";


export default function AssignmentSubmissions() {

    const { id } = useParams();

    const [assignment, setAssignment] =
        useState(null);

    const [submissions, setSubmissions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [gradingId, setGradingId] =
        useState(null);

    const [grades, setGrades] =
        useState({});


    // =========================================================
    // LOAD
    // =========================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Assignment ID is missing."
            );

            setLoading(false);

            return;
        }

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");


            const [
                assignmentData,
                submissionData
            ] = await Promise.all([

                getAssignment(id),

                getAssignmentSubmissions(id)

            ]);


            setAssignment(
                assignmentData
            );


            const submissionList =
                Array.isArray(submissionData)
                    ? submissionData
                    : [];


            setSubmissions(
                submissionList
            );


            // -------------------------------------------------
            // Populate existing grades
            // -------------------------------------------------

            const existingGrades = {};


            submissionList.forEach(
                submission => {

                    existingGrades[
                        submission.id
                    ] = {

                        mark:
                            submission.mark != null
                                ? submission.mark
                                : "",

                        feedback:
                            submission.feedback || ""

                    };

                }
            );


            setGrades(
                existingGrades
            );

        } catch (error) {

            console.error(
                "Failed to load submissions:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load assignment submissions."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // GRADE CHANGE
    // =========================================================

    const handleGradeChange = (
        submissionId,
        field,
        value
    ) => {

        setGrades(previous => ({

            ...previous,

            [submissionId]: {

                ...previous[submissionId],

                [field]: value

            }

        }));
    };


    // =========================================================
    // GRADE SUBMISSION
    // =========================================================

    const handleGrade = async (
        submissionId
    ) => {

        const grade =
            grades[submissionId];


        if (!grade) {

            return;
        }


        if (
            grade.mark === "" ||
            grade.mark == null
        ) {

            setError(
                "Please enter a mark."
            );

            return;
        }


        const mark =
            Number(grade.mark);


        if (Number.isNaN(mark)) {

            setError(
                "Mark must be a valid number."
            );

            return;
        }


        if (mark < 0) {

            setError(
                "Mark cannot be negative."
            );

            return;
        }


        if (
            assignment?.totalMarks != null &&
            mark > assignment.totalMarks
        ) {

            setError(
                `Mark cannot be greater than ${assignment.totalMarks}.`
            );

            return;
        }


        try {

            setGradingId(
                submissionId
            );

            setError("");


            const response =
                await gradeSubmission(
                    submissionId,
                    {

                        mark,

                        feedback:
                            grade.feedback?.trim() ||
                            null

                    }
                );


            // Update the submission
            // without reloading the page.

            setSubmissions(
                previous =>
                    previous.map(
                        submission =>
                            submission.id === submissionId
                                ? response
                                : submission
                    )
            );


            setGrades(
                previous => ({

                    ...previous,

                    [submissionId]: {

                        mark:
                            response.mark ?? mark,

                        feedback:
                            response.feedback || ""

                    }

                })
            );

        } catch (error) {

            console.error(
                "Failed to grade submission:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to grade submission."
            );

        } finally {

            setGradingId(null);
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
                        Loading submissions...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error && !assignment) {

        return (

            <div className="mx-auto max-w-4xl">

                <Link
                    to="/tutor/assignments"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft size={18} />

                    Back to Assignments

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <h1 className="text-xl font-bold text-red-800">
                        Unable to load submissions
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
            className="mx-auto max-w-5xl space-y-6"
        >

            {/* =================================================
                BACK
            ================================================= */}

            <Link
                to="/tutor/assignments"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
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
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

                <div className="flex items-start gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">

                        <FileText size={28} />

                    </div>


                    <div className="min-w-0 flex-1">

                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">

                            {assignment.title}

                        </h1>


                        {assignment.courseTitle && (

                            <p className="mt-2 font-medium text-indigo-600">

                                {assignment.courseTitle}

                            </p>

                        )}


                        <div className="mt-4 flex flex-wrap gap-3">

                            {assignment.totalMarks != null && (

                                <span className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">

                                    Total Marks:
                                    {" "}
                                    {assignment.totalMarks}

                                </span>

                            )}


                            <span className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600">

                                {submissions.length}
                                {" "}
                                submission
                                {submissions.length === 1
                                    ? ""
                                    : "s"}

                            </span>

                        </div>

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
                NO SUBMISSIONS
            ================================================= */}

            {submissions.length === 0 && (

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm"
                >

                    <FileText
                        size={45}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 text-xl font-bold text-gray-800">

                        No submissions yet

                    </h2>

                    <p className="mt-2 text-gray-500">

                        Students have not submitted this assignment yet.

                    </p>

                </motion.div>
            )}


            {/* =================================================
                SUBMISSIONS
            ================================================= */}

            <div className="space-y-6">

                {submissions.map(
                    (submission, index) => {

                        const grade =
                            grades[submission.id] || {

                                mark:
                                    submission.mark ?? "",

                                feedback:
                                    submission.feedback || ""

                            };


                        const isGraded =
                            submission.mark != null;


                        return (

                            <motion.div
                                key={submission.id}
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
                                        index * 0.05
                                }}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                            >

                                {/* Student Header */}

                                <div className="border-b border-gray-100 bg-gray-50 p-5 sm:p-6">

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">

                                                <User size={21} />

                                            </div>


                                            <div>

                                                <h2 className="font-bold text-gray-900">

                                                    {submission.studentName ||
                                                        "Student"}

                                                </h2>

                                                {submission.studentEmail && (

                                                    <p className="text-sm text-gray-500">

                                                        {submission.studentEmail}

                                                    </p>

                                                )}

                                            </div>

                                        </div>


                                        {isGraded ? (

                                            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                                                <CheckCircle size={17} />

                                                Graded

                                            </div>

                                        ) : (

                                            <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">

                                                Not Graded

                                            </div>

                                        )}

                                    </div>

                                </div>


                                {/* Submission Content */}

                                <div className="space-y-6 p-5 sm:p-6">

                                    {/* Answer */}

                                    {submission.answer && (

                                        <div>

                                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">

                                                Student Answer

                                            </h3>

                                            <div className="mt-3 whitespace-pre-wrap rounded-xl border border-gray-200 bg-gray-50 p-4 leading-7 text-gray-700">

                                                {submission.answer}

                                            </div>

                                        </div>

                                    )}


                                    {/* File */}

                                    {submission.fileUrl && (

                                        <div>

                                            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">

                                                Submitted File

                                            </h3>

                                            <a
                                                href={submission.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-100"
                                            >

                                                <ExternalLink size={18} />

                                                Open Submitted File

                                            </a>

                                        </div>

                                    )}


                                    {/* Submitted At */}

                                    {submission.submittedAt && (

                                        <p className="text-sm text-gray-500">

                                            Submitted:

                                            {" "}

                                            {new Date(
                                                submission.submittedAt
                                            ).toLocaleString()}

                                        </p>

                                    )}


                                    {/* Grade */}

                                    <div className="border-t border-gray-100 pt-6">

                                        <h3 className="text-lg font-bold text-gray-900">

                                            Grade Submission

                                        </h3>


                                        <div className="mt-4 grid gap-5 sm:grid-cols-[160px_1fr]">

                                            {/* Mark */}

                                            <div>

                                                <label className="mb-2 block text-sm font-semibold text-gray-700">

                                                    Mark

                                                </label>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={
                                                        assignment.totalMarks ??
                                                        undefined
                                                    }
                                                    value={
                                                        grade.mark
                                                    }
                                                    onChange={event =>
                                                        handleGradeChange(
                                                            submission.id,
                                                            "mark",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="0"
                                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                />

                                                {assignment.totalMarks != null && (

                                                    <p className="mt-2 text-xs text-gray-500">

                                                        Out of{" "}
                                                        {assignment.totalMarks}

                                                    </p>

                                                )}

                                            </div>


                                            {/* Feedback */}

                                            <div>

                                                <label className="mb-2 block text-sm font-semibold text-gray-700">

                                                    Feedback

                                                </label>

                                                <textarea
                                                    rows={4}
                                                    value={
                                                        grade.feedback
                                                    }
                                                    onChange={event =>
                                                        handleGradeChange(
                                                            submission.id,
                                                            "feedback",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Provide feedback to the student..."
                                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                />

                                            </div>

                                        </div>


                                        <div className="mt-5 flex justify-end">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleGrade(
                                                        submission.id
                                                    )
                                                }
                                                disabled={
                                                    gradingId ===
                                                    submission.id
                                                }
                                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >

                                                {gradingId ===
                                                submission.id ? (

                                                    <>
                                                        <Loader2
                                                            size={18}
                                                            className="animate-spin"
                                                        />

                                                        Saving...

                                                    </>

                                                ) : (

                                                    <>
                                                        <Send size={18} />

                                                        {isGraded
                                                            ? "Update Grade"
                                                            : "Save Grade"}

                                                    </>

                                                )}

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </motion.div>
                        );
                    }
                )}

            </div>

        </motion.div>
    );
}