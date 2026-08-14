import { useEffect, useState } from "react";
import {
    Link,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle2,
    GraduationCap,
    Loader2,
    Mail,
    ShieldCheck,
    User,
    UserCircle,
    XCircle
} from "lucide-react";

import {
    getAdminCourse,
    publishAdminCourse,
    unpublishAdminCourse
} from "../../api/adminApi";


const formatGrade = (grade) => {

    if (!grade) {
        return "—";
    }

    if (grade === "UNIVERSITY") {
        return "University";
    }

    return grade.replace(
        "GRADE_",
        "Grade "
    );
};


const formatDate = (value) => {

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

    return date.toLocaleString(
        undefined,
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
};


export default function AdminCourseDetails() {

    const { id } =
        useParams();


    // =========================================================
    // STATE
    // =========================================================

    const [course, setCourse] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // LOAD COURSE
    // =========================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Course ID is missing."
            );

            setLoading(false);

            return;
        }

        loadCourse();

    }, [id]);


    const loadCourse = async () => {

        try {

            setLoading(true);
            setError("");
            setSuccess("");


            const data =
                await getAdminCourse(id);


            setCourse(data);

        } catch (error) {

            console.error(
                "Failed to load course:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load course."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // PUBLISH / UNPUBLISH
    // =========================================================

    const handleStatusChange = async () => {

        if (!course) {
            return;
        }


        try {

            setProcessing(true);
            setError("");
            setSuccess("");


            let updatedCourse;


            if (course.published) {

                updatedCourse =
                    await unpublishAdminCourse(
                        course.id
                    );

                setSuccess(
                    "Course has been unpublished."
                );

            } else {

                updatedCourse =
                    await publishAdminCourse(
                        course.id
                    );

                setSuccess(
                    "Course has been published."
                );
            }


            setCourse(
                updatedCourse
            );

        } catch (error) {

            console.error(
                "Failed to update course:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update course."
            );

        } finally {

            setProcessing(false);
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

            <div className="mx-auto max-w-4xl">

                <Link
                    to="/admin/courses"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft size={18} />

                    Back to Courses

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <XCircle
                        size={46}
                        className="mx-auto text-red-400"
                    />

                    <h1 className="mt-4 text-xl font-bold text-red-800">
                        Unable to load course
                    </h1>

                    <p className="mt-2 text-red-700">
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    if (!course) {
        return null;
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
            className="mx-auto max-w-6xl space-y-8 pb-10"
        >

            {/* =================================================
                BACK
            ================================================= */}

            <Link
                to="/admin/courses"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Courses

            </Link>


            {/* =================================================
                COURSE HERO
            ================================================= */}

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                {/* IMAGE */}

                <div className="relative h-64 overflow-hidden bg-indigo-100 sm:h-80">

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
                                size={80}
                            />

                        </div>
                    )}


                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6 sm:p-8">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <span
                                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                                        course.published
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >

                                    {course.published
                                        ? "Published"
                                        : "Draft"}

                                </span>


                                <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">

                                    {course.title}

                                </h1>


                                {course.subjectName && (

                                    <p className="mt-2 text-indigo-100">

                                        {course.subjectName}

                                    </p>
                                )}

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleStatusChange
                                }
                                disabled={
                                    processing
                                }
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                    course.published
                                        ? "bg-white text-red-600 hover:bg-red-50"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                                }`}
                            >

                                {processing ? (

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                ) : course.published ? (

                                    <XCircle
                                        size={18}
                                    />

                                ) : (

                                    <CheckCircle2
                                        size={18}
                                    />
                                )}

                                {processing
                                    ? "Saving..."
                                    : course.published
                                        ? "Unpublish"
                                        : "Publish"}

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    COURSE INFORMATION
                ================================================= */}

                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">

                    {/* DESCRIPTION */}

                    <InfoCard
                        title="Course Information"
                    >

                        <InfoRow
                            icon={BookOpen}
                            label="Subject"
                            value={
                                course.subjectName ||
                                "Not specified"
                            }
                        />

                        <InfoRow
                            icon={GraduationCap}
                            label="Grade"
                            value={
                                formatGrade(
                                    course.grade
                                )
                            }
                        />

                        <InfoRow
                            icon={ShieldCheck}
                            label="Curriculum"
                            value={
                                course.curriculum ||
                                "Not specified"
                            }
                        />

                        <InfoRow
                            icon={Calendar}
                            label="Created"
                            value={
                                formatDate(
                                    course.createdAt
                                )
                            }
                        />

                    </InfoCard>


                    {/* TUTOR */}

                    <InfoCard
                        title="Course Tutor"
                    >

                        <InfoRow
                            icon={UserCircle}
                            label="Tutor"
                            value={
                                course.tutorName ||
                                "Not assigned"
                            }
                        />

                        <InfoRow
                            icon={Mail}
                            label="Email"
                            value={
                                course.tutorEmail ||
                                "Not available"
                            }
                        />

                        <InfoRow
                            icon={User}
                            label="Tutor ID"
                            value={
                                course.tutorId != null
                                    ? String(
                                        course.tutorId
                                    )
                                    : "—"
                            }
                        />

                    </InfoCard>

                </div>

            </div>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                <h2 className="text-xl font-bold text-gray-900">
                    Description
                </h2>


                <p className="mt-4 whitespace-pre-wrap leading-8 text-gray-600">

                    {course.description ||
                        "No course description has been provided."}

                </p>

            </div>


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
                    className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700"
                >

                    <CheckCircle2 size={19} />

                    {success}

                </motion.div>
            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && course && (

                <motion.div
                    initial={{
                        opacity: 0,
                        y: -10
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >

                    <XCircle size={19} />

                    {error}

                </motion.div>
            )}

        </motion.div>
    );
}


// =========================================================
// INFO CARD
// =========================================================

function InfoCard({
    title,
    children
}) {

    return (

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

            <h2 className="mb-5 text-lg font-bold text-gray-900">
                {title}
            </h2>

            <div className="space-y-4">
                {children}
            </div>

        </div>
    );
}


// =========================================================
// INFO ROW
// =========================================================

function InfoRow({
    icon: Icon,
    label,
    value
}) {

    return (

        <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">

                <Icon size={17} />

            </div>


            <div className="min-w-0">

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                    {label}

                </p>


                <p className="mt-1 break-words text-sm font-semibold text-gray-800">

                    {value}

                </p>

            </div>

        </div>
    );
}