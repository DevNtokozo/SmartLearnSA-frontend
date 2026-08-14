import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    AlertCircle,
    BookOpen,
    Calendar,
    CheckCircle2,
    GraduationCap,
    Loader2,
    RefreshCw,
    Search,
    Trash2,
    User,
    UserX,
    X
} from "lucide-react";

import {
    deleteAdminEnrollment,
    getAdminEnrollments
} from "../../api/adminApi";


// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (value) => {

    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
};


// =========================================================
// INITIALS
// =========================================================

const getInitials = (
    name
) => {

    if (!name) {
        return "U";
    }

    const parts =
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    if (parts.length === 1) {
        return parts[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        `${parts[0][0]}${parts[parts.length - 1][0]}`
    ).toUpperCase();
};


// =========================================================
// PAGE
// =========================================================

export default function AdminEnrollments() {

    const [enrollments, setEnrollments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [confirmEnrollment, setConfirmEnrollment] =
        useState(null);

    const [deletingId, setDeletingId] =
        useState(null);


    // =========================================================
    // LOAD
    // =========================================================

    useEffect(() => {

        loadEnrollments();

    }, []);


    const loadEnrollments = async (
        options = {}
    ) => {

        const isRefresh =
            options.refresh === true;

        try {

            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const data =
                await getAdminEnrollments(
                    search
                );

            setEnrollments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load enrollments:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load enrollments."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = (
        event
    ) => {

        event.preventDefault();

        loadEnrollments({
            refresh: true
        });
    };


    // =========================================================
    // RESET SEARCH
    // =========================================================

    const clearSearch = async () => {

        setSearch("");

        try {

            setRefreshing(true);
            setError("");

            const data =
                await getAdminEnrollments("");

            setEnrollments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load enrollments."
            );

        } finally {

            setRefreshing(false);
        }
    };


    // =========================================================
    // DELETE ENROLLMENT
    // =========================================================

    const handleDelete = async () => {

        if (!confirmEnrollment) {
            return;
        }

        try {

            setDeletingId(
                confirmEnrollment.id
            );

            setError("");

            await deleteAdminEnrollment(
                confirmEnrollment.id
            );

            setEnrollments(
                previous =>
                    previous.filter(
                        enrollment =>
                            enrollment.id !==
                            confirmEnrollment.id
                    )
            );

            setConfirmEnrollment(
                null
            );

        } catch (error) {

            console.error(
                "Failed to delete enrollment:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to remove enrollment."
            );

        } finally {

            setDeletingId(
                null
            );
        }
    };


    // =========================================================
    // COURSE COUNTS
    // =========================================================

    const courseCount =
        useMemo(() => {

            return new Set(
                enrollments
                    .map(
                        enrollment =>
                            enrollment.courseId
                    )
                    .filter(
                        id => id != null
                    )
            ).size;

        }, [enrollments]);


    const studentCount =
        useMemo(() => {

            return new Set(
                enrollments
                    .map(
                        enrollment =>
                            enrollment.studentId
                    )
                    .filter(
                        id => id != null
                    )
            ).size;

        }, [enrollments]);


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
                        Loading enrollments...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="space-y-8 pb-10">

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
                className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
            >

                <div>

                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                            <GraduationCap size={25} />

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-indigo-600">
                                Administration
                            </p>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Enrollments
                            </h1>

                        </div>

                    </div>


                    <p className="mt-3 max-w-2xl text-gray-500">
                        Monitor student course enrollments and manage enrollment records.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        loadEnrollments({
                            refresh: true
                        })
                    }
                    disabled={refreshing}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >

                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </motion.div>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-3">

                <SummaryCard
                    label="Enrollments"
                    value={
                        enrollments.length
                    }
                    icon={GraduationCap}
                />

                <SummaryCard
                    label="Students"
                    value={studentCount}
                    icon={User}
                />

                <SummaryCard
                    label="Courses"
                    value={courseCount}
                    icon={BookOpen}
                />

            </div>


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
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >

                    <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0"
                    />

                    <span>
                        {error}
                    </span>

                </motion.div>
            )}


            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-2">

                    <Search
                        size={18}
                        className="text-indigo-600"
                    />

                    <h2 className="font-bold text-gray-900">
                        Search Enrollments
                    </h2>

                </div>


                <form
                    onSubmit={handleSearch}
                    className="mt-5"
                >

                    <div className="flex flex-col gap-3 sm:flex-row">

                        <div className="relative flex-1">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />


                            <input
                                type="search"
                                value={search}
                                onChange={event =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by student name, email, or course..."
                                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>


                        <button
                            type="submit"
                            disabled={refreshing}
                            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            Search

                        </button>


                        {search && (

                            <button
                                type="button"
                                onClick={
                                    clearSearch
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                            >

                                <X size={17} />

                                Clear

                            </button>
                        )}

                    </div>


                    <p className="mt-3 text-xs text-gray-500">
                        Search matches student first name, last name, email, and course title.
                    </p>

                </form>

            </div>


            {/* =================================================
                EMPTY
            ================================================= */}

            {enrollments.length === 0 && (

                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

                    <UserX
                        size={46}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                        No enrollments found
                    </h2>

                    <p className="mt-2 text-gray-500">
                        There are no enrollment records matching your search.
                    </p>

                </div>
            )}


            {/* =================================================
                TABLE
            ================================================= */}

            {enrollments.length > 0 && (

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Student
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Course
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Enrolled
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {enrollments.map(
                                    (
                                        enrollment,
                                        index
                                    ) => (

                                        <motion.tr
                                            key={
                                                enrollment.id
                                            }
                                            initial={{
                                                opacity: 0,
                                                y: 8
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            transition={{
                                                delay:
                                                    index *
                                                    0.025
                                            }}
                                            className="hover:bg-gray-50"
                                        >

                                            {/* STUDENT */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">

                                                        {getInitials(
                                                            enrollment.studentName
                                                        )}

                                                    </div>


                                                    <div className="min-w-0">

                                                        <p className="font-semibold text-gray-900">

                                                            {enrollment.studentName ||
                                                                "Unknown Student"}

                                                        </p>


                                                        <p className="mt-1 text-sm text-gray-500">

                                                            {enrollment.studentEmail ||
                                                                "No email"}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* COURSE */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                                        <BookOpen
                                                            size={18}
                                                        />

                                                    </div>


                                                    <div>

                                                        <p className="font-semibold text-gray-900">

                                                            {enrollment.courseTitle ||
                                                                "Unknown Course"}

                                                        </p>


                                                        <p className="mt-1 text-xs text-gray-400">

                                                            Course ID:{" "}
                                                            {enrollment.courseId ??
                                                                "—"}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* DATE */}

                                            <td className="px-6 py-5">

                                                <div className="inline-flex items-center gap-2 text-sm text-gray-600">

                                                    <Calendar
                                                        size={15}
                                                        className="text-gray-400"
                                                    />

                                                    {formatDate(
                                                        enrollment.enrolledAt
                                                    )}

                                                </div>

                                            </td>


                                            {/* ACTION */}

                                            <td className="px-6 py-5">

                                                <div className="flex justify-end">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setConfirmEnrollment(
                                                                enrollment
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            enrollment.id
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >

                                                        {deletingId ===
                                                        enrollment.id ? (

                                                            <Loader2
                                                                size={15}
                                                                className="animate-spin"
                                                            />

                                                        ) : (

                                                            <Trash2
                                                                size={15}
                                                            />
                                                        )}

                                                        Remove

                                                    </button>

                                                </div>

                                            </td>

                                        </motion.tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}


            {/* =================================================
                CONFIRMATION MODAL
            ================================================= */}

            {confirmEnrollment && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 15
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Remove Enrollment?
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    This will remove the enrollment record. The student account and course will remain available.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setConfirmEnrollment(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >

                                <X size={19} />

                            </button>

                        </div>


                        <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4">

                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Student
                                </p>

                                <p className="mt-1 font-semibold text-gray-900">

                                    {confirmEnrollment.studentName ||
                                        "Unknown Student"}

                                </p>

                                <p className="mt-1 text-sm text-gray-500">

                                    {confirmEnrollment.studentEmail ||
                                        "No email"}

                                </p>

                            </div>


                            <div>

                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Course
                                </p>

                                <p className="mt-1 font-semibold text-gray-900">

                                    {confirmEnrollment.courseTitle ||
                                        "Unknown Course"}

                                </p>

                            </div>

                        </div>


                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setConfirmEnrollment(
                                        null
                                    )
                                }
                                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                            >

                                Cancel

                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleDelete
                                }
                                disabled={
                                    deletingId ===
                                    confirmEnrollment.id
                                }
                                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {deletingId ===
                                confirmEnrollment.id
                                    ? "Removing..."
                                    : "Remove Enrollment"}

                            </button>

                        </div>

                    </motion.div>

                </div>
            )}

        </div>
    );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
    label,
    value,
    icon: Icon
}) {

    return (

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-medium text-gray-500">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {value}
                    </p>

                </div>


                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                    <Icon size={21} />

                </div>

            </div>

        </div>
    );
}