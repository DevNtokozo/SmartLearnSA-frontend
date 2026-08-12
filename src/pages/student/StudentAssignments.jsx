import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Loader2
} from "lucide-react";

import {
    getStudentAssignments
} from "../../api/assignmentApi";

export default function StudentAssignments() {

    const [assignments, setAssignments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadAssignments();

    }, []);


    const loadAssignments = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getStudentAssignments();

            setAssignments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load assignments."
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
                        Loading assignments...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="space-y-8">

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
                            Assignments
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Complete your available assignments.
                        </p>

                    </div>

                </div>

            </motion.div>


            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>

            )}


            {!error &&
                assignments.length === 0 && (

                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

                        <CheckCircle
                            size={45}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-4 text-xl font-bold text-gray-900">
                            No assignments available
                        </h2>

                        <p className="mt-2 text-gray-500">
                            You're all caught up for now.
                        </p>

                    </div>
                )}


            {assignments.length > 0 && (

                <div className="grid gap-6 lg:grid-cols-2">

                    {assignments.map(
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
                                    delay: index * 0.05
                                }}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex min-w-0 gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                            <FileText size={23} />

                                        </div>


                                        <div className="min-w-0">

                                            <h2 className="text-xl font-bold text-gray-900">
                                                {assignment.title}
                                            </h2>

                                            {assignment.courseTitle && (

                                                <p className="mt-1 text-sm font-semibold text-indigo-600">
                                                    {assignment.courseTitle}
                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        Available
                                    </span>

                                </div>


                                {assignment.description && (

                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                        {assignment.description}
                                    </p>

                                )}


                                <div className="mt-5 flex flex-wrap gap-2">

                                    {assignment.totalMarks != null && (

                                        <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                            {assignment.totalMarks} marks

                                        </span>

                                    )}


                                    {assignment.dueDate && (

                                        <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                            <Calendar size={13} />

                                            {new Date(
                                                assignment.dueDate
                                            ).toLocaleDateString()}

                                        </span>

                                    )}


                                    {assignment.estimatedMinutes && (

                                        <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                            <Clock size={13} />

                                            {assignment.estimatedMinutes} min

                                        </span>

                                    )}

                                </div>


                                <Link
                                    to={`/student/assignments/${assignment.id}`}
                                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                                >

                                    Open Assignment

                                    <ArrowRight size={18} />

                                </Link>

                            </motion.div>
                        )
                    )}

                </div>

            )}

        </div>
    );
}