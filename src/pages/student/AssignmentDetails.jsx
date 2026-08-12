
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Send,
    AlertCircle
} from "lucide-react";

import {
    getAssignment,
    getMySubmission,
    submitAssignment
} from "../../api/assignmentApi";

export default function AssignmentDetails() {

    const { id } = useParams();

    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);

    const [answer, setAnswer] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // LOAD ASSIGNMENT
    // =========================================================

    useEffect(() => {

        if (!id) {
            setError("Assignment ID is missing.");
            setLoading(false);
            return;
        }

        loadAssignment();

    }, [id]);

    const loadAssignment = async () => {

        try {

            setLoading(true);
            setError("");

            const assignmentData =
                await getAssignment(id);

            setAssignment(assignmentData);

            // =================================================
            // LOAD EXISTING SUBMISSION
            // =================================================

            try {

                const submissionData =
                    await getMySubmission(id);

                setSubmission(submissionData);

                if (submissionData?.answer) {
                    setAnswer(submissionData.answer);
                }

                if (submissionData?.fileUrl) {
                    setFileUrl(submissionData.fileUrl);
                }

            } catch (submissionError) {

                if (
                    submissionError.response?.status !== 404
                ) {

                    console.error(
                        "Failed to load submission:",
                        submissionError
                    );
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
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        const trimmedAnswer = answer.trim();
        const trimmedFileUrl = fileUrl.trim();

        // At least one submission method is required

        if (!trimmedAnswer && !trimmedFileUrl) {

            setError(
                "Please provide an answer or file before submitting."
            );

            return;
        }

        // Validate URL if supplied

        if (trimmedFileUrl) {

            try {

                new URL(trimmedFileUrl);

            } catch {

                setError(
                    "Please provide a valid file URL."
                );

                return;
            }
        }

        try {

            setSubmitting(true);

            const data = {
                answer: trimmedAnswer || null,
                fileUrl: trimmedFileUrl || null
            };

            const response =
                await submitAssignment(
                    id,
                    data
                );

            setSubmission(response);

            setSuccess(
                submission
                    ? "Assignment submission updated successfully."
                    : "Assignment submitted successfully."
            );

        } catch (error) {

            console.error(
                "Failed to submit assignment:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to submit assignment."
            );

        } finally {

            setSubmitting(false);
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
                        Loading assignment...
                    </p>

                </div>

            </div>
        );
    }

    // =========================================================
    // ERROR / NOT FOUND
    // =========================================================

    if (error && !assignment) {

        return (

            <div className="mx-auto max-w-3xl">

                <Link
                    to="/student/assignments"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft size={18} />

                    Back to Assignments

                </Link>

                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <AlertCircle
                        className="mx-auto text-red-500"
                        size={40}
                    />

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
    // SUBMISSION STATUS
    // =========================================================

    const isGraded =
        submission?.mark !== null &&
        submission?.mark !== undefined;

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="mx-auto max-w-4xl space-y-6">

            {/* =================================================
                BACK
            ================================================= */}

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
                    to="/student/assignments"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft size={18} />

                    Back to Assignments

                </Link>

            </motion.div>


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

                    </div>

                </div>


                {/* =================================================
                    META
                ================================================= */}

                <div className="mt-6 flex flex-wrap gap-3">

                    {assignment.totalMarks != null && (

                        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-600">

                            <CheckCircle size={17} />

                            {assignment.totalMarks} marks

                        </div>

                    )}

                    {assignment.dueDate && (

                        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-600">

                            <Calendar size={17} />

                            Due:
                            {" "}
                            {new Date(
                                assignment.dueDate
                            ).toLocaleDateString()}

                        </div>

                    )}

                    {assignment.estimatedMinutes && (

                        <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm text-gray-600">

                            <Clock size={17} />

                            {assignment.estimatedMinutes} minutes

                        </div>

                    )}

                </div>

            </motion.div>


            {/* =================================================
                INSTRUCTIONS
            ================================================= */}

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
                    duration: 0.5,
                    delay: 0.1
                }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

                <h2 className="text-xl font-bold text-gray-900">
                    Assignment Instructions
                </h2>

                <div className="mt-4 whitespace-pre-wrap leading-7 text-gray-700">
                    {assignment.description ||
                        "No additional instructions provided."}
                </div>

            </motion.div>


            {/* =================================================
                SUBMISSION STATUS
            ================================================= */}

            {submission && (

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.98
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    className={`rounded-2xl border p-6 ${
                        isGraded
                            ? "border-green-200 bg-green-50"
                            : "border-blue-200 bg-blue-50"
                    }`}
                >

                    <div className="flex items-start gap-3">

                        <CheckCircle
                            className={
                                isGraded
                                    ? "mt-0.5 text-green-600"
                                    : "mt-0.5 text-blue-600"
                            }
                            size={22}
                        />

                        <div>

                            <h2
                                className={`font-bold ${
                                    isGraded
                                        ? "text-green-800"
                                        : "text-blue-800"
                                }`}
                            >
                                {isGraded
                                    ? "Assignment graded"
                                    : "Assignment submitted"}
                            </h2>

                            <p
                                className={`mt-1 text-sm ${
                                    isGraded
                                        ? "text-green-700"
                                        : "text-blue-700"
                                }`}
                            >
                                {isGraded
                                    ? "Your tutor has graded this assignment."
                                    : "Your submission has been recorded and is awaiting grading."}
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        MARK
                    ================================================= */}

                    {isGraded && (

                        <div className="mt-4 rounded-xl bg-white p-4">

                            <p className="text-sm text-gray-500">
                                Mark
                            </p>

                            <p className="mt-1 text-2xl font-bold text-indigo-600">

                                {submission.mark}

                                {submission.totalMarks != null && (
                                    <>
                                        {" / "}
                                        {submission.totalMarks}
                                    </>
                                )}

                            </p>

                        </div>

                    )}


                    {/* =================================================
                        FEEDBACK
                    ================================================= */}

                    {submission.feedback && (

                        <div className="mt-4 rounded-xl bg-white p-4">

                            <p className="text-sm font-semibold text-gray-700">
                                Tutor Feedback
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-gray-600">
                                {submission.feedback}
                            </p>

                        </div>

                    )}

                </motion.div>

            )}


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
                    className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                >

                    <AlertCircle size={20} />

                    {error}

                </motion.div>

            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -10
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
                >

                    <CheckCircle size={20} />

                    {success}

                </motion.div>

            )}


            {/* =================================================
                SUBMISSION FORM
            ================================================= */}

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
                    duration: 0.5,
                    delay: 0.2
                }}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

                <div>

                    <h2 className="text-xl font-bold text-gray-900">
                        Your Submission
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Provide an answer, a file URL, or both.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-6"
                >

                    {/* =================================================
                        ANSWER
                    ================================================= */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Your Answer
                        </label>

                        <textarea
                            value={answer}
                            onChange={(event) =>
                                setAnswer(
                                    event.target.value
                                )
                            }
                            rows={10}
                            placeholder="Write your answer here..."
                            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    {/* =================================================
                        OR
                    ================================================= */}

                    <div className="flex items-center gap-3">

                        <div className="h-px flex-1 bg-gray-200" />

                        <span className="text-xs font-semibold uppercase text-gray-400">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-gray-200" />

                    </div>


                    {/* =================================================
                        FILE URL
                    ================================================= */}

                    <div>

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            File URL
                        </label>

                        <input
                            type="url"
                            value={fileUrl}
                            onChange={(event) =>
                                setFileUrl(
                                    event.target.value
                                )
                            }
                            placeholder="https://example.com/my-assignment.pdf"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Provide a link to your assignment file.
                        </p>

                    </div>


                    {/* =================================================
                        SUBMIT
                    ================================================= */}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >

                        <Send size={18} />

                        {submitting
                            ? "Submitting..."
                            : submission
                                ? "Update Submission"
                                : "Submit Assignment"}

                    </button>

                </form>

            </motion.div>

        </div>
    );
}

