import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle,
    Clock,
    ExternalLink,
    FileText,
    Loader2
} from "lucide-react";

import {
    getMySubmissions
} from "../../api/assignmentApi";

export default function StudentSubmissions() {

    const [submissions, setSubmissions] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD SUBMISSIONS
    // =========================================================

    useEffect(() => {

        loadSubmissions();

    }, []);


    const loadSubmissions = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getMySubmissions();

            setSubmissions(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load submissions:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load your submissions."
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

                    <Loader2
                        size={40}
                        className="mx-auto animate-spin text-indigo-600"
                    />

                    <p className="mt-4 text-gray-500">
                        Loading your submissions...
                    </p>

                </div>

            </div>
        );
    }


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
            >

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                        <FileText size={25} />

                    </div>


                    <div>

                        <h1 className="text-3xl font-bold text-gray-900">
                            My Submissions
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Review your submitted assignments, marks and feedback.
                        </p>

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
                EMPTY
            ================================================= */}

            {!error &&
                submissions.length === 0 && (

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center"
                    >

                        <FileText
                            size={45}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            No submissions yet
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Once you submit an assignment, it will appear here.
                        </p>


                        <Link
                            to="/student/assignments"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                        >

                            Browse Assignments

                            <ArrowRight size={18} />

                        </Link>

                    </motion.div>
                )}


            {/* =================================================
                SUBMISSION CARDS
            ================================================= */}

            {submissions.length > 0 && (

                <div className="space-y-5">

                    {submissions.map(
                        (
                            submission,
                            index
                        ) => {

                            const graded =
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
                                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                                >

                                    {/* HEADER */}

                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                        <div className="flex min-w-0 gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                                <FileText size={21} />

                                            </div>


                                            <div className="min-w-0">

                                                <h2 className="text-xl font-bold text-gray-900">

                                                    {submission.assignmentTitle ||
                                                        "Assignment"}

                                                </h2>


                                                <p className="mt-1 text-sm text-gray-500">

                                                    Submitted:

                                                    {" "}

                                                    {submission.submittedAt
                                                        ? new Date(
                                                            submission.submittedAt
                                                        ).toLocaleString()
                                                        : "Unknown"}

                                                </p>

                                            </div>

                                        </div>


                                        <span
                                            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                graded
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >

                                            {graded ? (
                                                <>
                                                    <CheckCircle size={14} />
                                                    Graded
                                                </>
                                            ) : (
                                                <>
                                                    <Clock size={14} />
                                                    Awaiting Grade
                                                </>
                                            )}

                                        </span>

                                    </div>


                                    {/* MARK */}

                                    {graded && (

                                        <div className="mt-6 rounded-xl bg-indigo-50 p-5">

                                            <p className="text-sm font-semibold text-gray-500">
                                                Your Mark
                                            </p>

                                            <p className="mt-1 text-3xl font-bold text-indigo-700">

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


                                    {/* FEEDBACK */}

                                    {submission.feedback && (

                                        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">

                                            <p className="text-sm font-semibold text-gray-700">
                                                Tutor Feedback
                                            </p>

                                            <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-600">

                                                {submission.feedback}

                                            </p>

                                        </div>
                                    )}


                                    {/* FILE */}

                                    {submission.fileUrl && (

                                        <div className="mt-5">

                                            <a
                                                href={
                                                    submission.fileUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
                                            >

                                                View Submitted File

                                                <ExternalLink
                                                    size={16}
                                                />

                                            </a>

                                        </div>
                                    )}


                                    {/* OPEN ASSIGNMENT */}

                                    {submission.assignmentId && (

                                        <div className="mt-6 border-t border-gray-100 pt-5">

                                            <Link
                                                to={`/student/assignments/${submission.assignmentId}`}
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                            >

                                                Open Assignment

                                                <ArrowRight
                                                    size={16}
                                                />

                                            </Link>

                                        </div>
                                    )}

                                </motion.div>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
}