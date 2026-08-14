import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    AlertCircle,
    BookOpen,
    Calendar,
    CheckCircle2,
    Eye,
    Filter,
    Loader2,
    RefreshCw,
    Search,
    X
} from "lucide-react";

import {
    getAdminCourses,
    publishAdminCourse,
    unpublishAdminCourse
} from "../../api/adminApi";


const GRADE_OPTIONS = [
    "ALL",
    "GRADE_R",
    "GRADE_1",
    "GRADE_2",
    "GRADE_3",
    "GRADE_4",
    "GRADE_5",
    "GRADE_6",
    "GRADE_7",
    "GRADE_8",
    "GRADE_9",
    "GRADE_10",
    "GRADE_11",
    "GRADE_12",
    "UNIVERSITY"
];


const CURRICULUM_OPTIONS = [
    "ALL",
    "CAPS",
    "IEB"
];


const formatGrade = (grade) => {

    if (!grade) {
        return "";
    }

    if (grade === "UNIVERSITY") {
        return "University";
    }

    return grade.replace(
        "GRADE_",
        "Grade "
    );
};


const formatCurriculum = (
    curriculum
) => {

    if (!curriculum) {
        return "";
    }

    return curriculum;
};


const formatDate = (
    value
) => {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
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


export default function AdminCourses() {

    // =========================================================
    // STATE
    // =========================================================

    const [courses, setCourses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [grade, setGrade] =
        useState("ALL");

    const [curriculum, setCurriculum] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [processingId, setProcessingId] =
        useState(null);

    const [confirmCourse, setConfirmCourse] =
        useState(null);


    // =========================================================
    // LOAD COURSES
    // =========================================================

    useEffect(() => {

        loadCourses();

    }, [
        grade,
        curriculum
    ]);


    const loadCourses = async (
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
                await getAdminCourses({

                    search,

                    grade:
                        grade === "ALL"
                            ? ""
                            : grade,

                    curriculum:
                        curriculum === "ALL"
                            ? ""
                            : curriculum
                });


            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load courses:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load courses."
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

        loadCourses({
            refresh: true
        });
    };


    // =========================================================
    // RESET
    // =========================================================

    const resetFilters = async () => {

        setSearch("");
        setGrade("ALL");
        setCurriculum("ALL");
        setStatusFilter("ALL");

        try {

            setRefreshing(true);
            setError("");

            const data =
                await getAdminCourses();

            setCourses(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load courses."
            );

        } finally {

            setRefreshing(false);
        }
    };


    // =========================================================
    // LOCAL STATUS FILTER
    // =========================================================

    const displayedCourses =
        useMemo(() => {

            if (
                statusFilter ===
                "ALL"
            ) {
                return courses;
            }

            if (
                statusFilter ===
                "PUBLISHED"
            ) {

                return courses.filter(
                    course =>
                        course.published === true
                );
            }

            if (
                statusFilter ===
                "DRAFT"
            ) {

                return courses.filter(
                    course =>
                        course.published === false
                );
            }

            return courses;

        }, [
            courses,
            statusFilter
        ]);


    // =========================================================
    // STATUS CHANGE
    // =========================================================

    const handleStatusChange =
        async () => {

            if (!confirmCourse) {
                return;
            }


            const course =
                confirmCourse;


            try {

                setProcessingId(
                    course.id
                );

                setError("");


                let updated;


                if (course.published) {

                    updated =
                        await unpublishAdminCourse(
                            course.id
                        );

                } else {

                    updated =
                        await publishAdminCourse(
                            course.id
                        );
                }


                setCourses(
                    previous =>
                        previous.map(
                            item =>
                                item.id ===
                                course.id
                                    ? updated
                                    : item
                        )
                );


                setConfirmCourse(
                    null
                );

            } catch (error) {

                console.error(
                    "Failed to update course status:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to update course."
                );

            } finally {

                setProcessingId(
                    null
                );
            }
        };


    // =========================================================
    // COUNTS
    // =========================================================

    const publishedCount =
        courses.filter(
            course =>
                course.published
        ).length;

    const draftCount =
        courses.filter(
            course =>
                !course.published
        ).length;


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
                        Loading courses...
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

                            <BookOpen
                                size={25}
                            />

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-indigo-600">
                                Administration
                            </p>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Course Management
                            </h1>

                        </div>

                    </div>


                    <p className="mt-3 max-w-2xl text-gray-500">
                        Review courses, instructors, curriculum information and publication status.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        loadCourses({
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
                    label="Showing"
                    value={
                        displayedCourses.length
                    }
                    icon={BookOpen}
                />

                <SummaryCard
                    label="Published"
                    value={
                        publishedCount
                    }
                    icon={CheckCircle2}
                />

                <SummaryCard
                    label="Drafts"
                    value={
                        draftCount
                    }
                    icon={Filter}
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
                FILTERS
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                <div className="flex items-center gap-2">

                    <Filter
                        size={18}
                        className="text-indigo-600"
                    />

                    <h2 className="font-bold text-gray-900">
                        Filters
                    </h2>

                </div>


                <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_190px_190px_180px_auto]">

                    {/* SEARCH */}

                    <form
                        onSubmit={
                            handleSearch
                        }
                    >

                        <label
                            htmlFor="course-search"
                            className="sr-only"
                        >
                            Search courses
                        </label>


                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />


                            <input
                                id="course-search"
                                type="search"
                                value={search}
                                onChange={event =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search course title or description..."
                                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                    </form>


                    {/* GRADE */}

                    <div>

                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Grade
                        </label>


                        <select
                            value={grade}
                            onChange={event =>
                                setGrade(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >

                            {GRADE_OPTIONS.map(
                                option => (

                                    <option
                                        key={option}
                                        value={option}
                                    >

                                        {option ===
                                        "ALL"
                                            ? "All grades"
                                            : formatGrade(
                                                option
                                            )}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* CURRICULUM */}

                    <div>

                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Curriculum
                        </label>


                        <select
                            value={
                                curriculum
                            }
                            onChange={event =>
                                setCurriculum(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >

                            {CURRICULUM_OPTIONS.map(
                                option => (

                                    <option
                                        key={option}
                                        value={option}
                                    >

                                        {option ===
                                        "ALL"
                                            ? "All curricula"
                                            : formatCurriculum(
                                                option
                                            )}

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* STATUS */}

                    <div>

                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Status
                        </label>


                        <select
                            value={
                                statusFilter
                            }
                            onChange={event =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >

                            <option value="ALL">
                                All statuses
                            </option>

                            <option value="PUBLISHED">
                                Published
                            </option>

                            <option value="DRAFT">
                                Draft
                            </option>

                        </select>

                    </div>


                    {/* SEARCH BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            loadCourses({
                                refresh: true
                            })
                        }
                        className="self-end rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                    >

                        Search

                    </button>

                </div>


                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

                    <p className="text-sm text-gray-500">

                        {displayedCourses.length}
                        {" "}
                        course
                        {displayedCourses.length ===
                        1
                            ? ""
                            : "s"}

                        {" "}shown

                    </p>


                    <button
                        type="button"
                        onClick={
                            resetFilters
                        }
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                    >

                        <X size={15} />

                        Clear filters

                    </button>

                </div>

            </div>


            {/* =================================================
                EMPTY
            ================================================= */}

            {displayedCourses.length ===
                0 && (

                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

                    <BookOpen
                        size={46}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                        No courses found
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Try changing your search or filters.
                    </p>

                </div>
            )}


            {/* =================================================
                COURSE GRID
            ================================================= */}

            {displayedCourses.length >
                0 && (

                <div className="grid gap-6 lg:grid-cols-2">

                    {displayedCourses.map(
                        (
                            course,
                            index
                        ) => (

                            <motion.div
                                key={course.id}
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
                                        index *
                                        0.05
                                }}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* IMAGE */}

                                <div className="relative h-48 overflow-hidden bg-indigo-100">

                                    {course.thumbnail ? (

                                        <img
                                            src={
                                                course.thumbnail
                                            }
                                            alt={
                                                course.title
                                            }
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center text-indigo-300">

                                            <BookOpen
                                                size={60}
                                            />

                                        </div>

                                    )}


                                    <span
                                        className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                            course.published
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >

                                        {course.published
                                            ? "Published"
                                            : "Draft"}

                                    </span>

                                </div>


                                {/* CONTENT */}

                                <div className="p-6">

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <h2 className="text-xl font-bold text-gray-900">

                                                {course.title}

                                            </h2>


                                            {course.subjectName && (

                                                <p className="mt-1 text-sm font-semibold text-indigo-600">

                                                    {course.subjectName}

                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    {course.description && (

                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">

                                            {course.description}

                                        </p>

                                    )}


                                    {/* TAGS */}

                                    <div className="mt-5 flex flex-wrap gap-2">

                                        {course.grade && (

                                            <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">

                                                {formatGrade(
                                                    course.grade
                                                )}

                                            </span>

                                        )}


                                        {course.curriculum && (

                                            <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600">

                                                {course.curriculum}

                                            </span>

                                        )}

                                    </div>


                                    {/* TUTOR */}

                                    <div className="mt-5 rounded-xl bg-gray-50 p-4">

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Tutor
                                        </p>


                                        <p className="mt-1 font-semibold text-gray-800">

                                            {course.tutorName ||
                                                "No tutor"}

                                        </p>


                                        {course.tutorEmail && (

                                            <p className="mt-1 truncate text-sm text-gray-500">

                                                {course.tutorEmail}

                                            </p>

                                        )}

                                    </div>


                                    {/* META */}

                                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">

                                        <Calendar
                                            size={14}
                                        />

                                        Created{" "}

                                        {formatDate(
                                            course.createdAt
                                        )}

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100 pt-5">

                                        <Link
                                            to={`/admin/courses/${course.id}`}
                                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                        >

                                            <Eye size={15} />

                                            View

                                        </Link>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setConfirmCourse(
                                                    course
                                                )
                                            }
                                            disabled={
                                                processingId ===
                                                course.id
                                            }
                                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                                                course.published
                                                    ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                            }`}
                                        >

                                            {course.published
                                                ? "Unpublish"
                                                : "Publish"}

                                        </button>

                                    </div>

                                </div>

                            </motion.div>
                        )
                    )}

                </div>
            )}


            {/* =================================================
                CONFIRM MODAL
            ================================================= */}

            {confirmCourse && (

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

                                    {confirmCourse.published
                                        ? "Unpublish Course?"
                                        : "Publish Course?"}

                                </h2>


                                <p className="mt-2 text-sm leading-6 text-gray-500">

                                    {confirmCourse.published
                                        ? "Students will no longer see this course among published courses."
                                        : "This course will become available among published courses."}

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setConfirmCourse(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >

                                <X size={19} />

                            </button>

                        </div>


                        <div className="mt-5 rounded-xl bg-indigo-50 p-4">

                            <p className="font-semibold text-indigo-900">

                                {confirmCourse.title}

                            </p>

                            <p className="mt-1 text-sm text-indigo-700">

                                {formatGrade(
                                    confirmCourse.grade
                                )}

                                {confirmCourse.curriculum
                                    ? ` • ${confirmCourse.curriculum}`
                                    : ""}

                            </p>

                        </div>


                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setConfirmCourse(
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
                                    handleStatusChange
                                }
                                disabled={
                                    processingId ===
                                    confirmCourse.id
                                }
                                className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                                    confirmCourse.published
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                            >

                                {processingId ===
                                confirmCourse.id
                                    ? "Saving..."
                                    : confirmCourse.published
                                        ? "Unpublish"
                                        : "Publish"}

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