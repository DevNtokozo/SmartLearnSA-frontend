import { useEffect, useState } from "react";
import {
    Link,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Edit3,
    Loader2,
    Power,
    XCircle
} from "lucide-react";

import {
    activateAdminSubject,
    deactivateAdminSubject,
    getAdminSubject,
    updateAdminSubject
} from "../../api/adminApi";

export default function AdminSubjectDetails() {

    const { id } = useParams();

    const [subject, setSubject] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [editing, setEditing] =
        useState(false);

    const [form, setForm] =
        useState({
            name: "",
            description: ""
        });


    // =========================================================
    // LOAD
    // =========================================================

    useEffect(() => {

        if (!id) {

            setError(
                "Subject ID is missing."
            );

            setLoading(false);

            return;
        }

        loadSubject();

    }, [id]);


    const loadSubject = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getAdminSubject(id);

            setSubject(data);

            setForm({
                name: data.name || "",
                description:
                    data.description || ""
            });

        } catch (error) {

            console.error(
                "Failed to load subject:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load subject."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = () => {

        setForm({
            name: subject?.name || "",
            description:
                subject?.description || ""
        });

        setEditing(true);
        setError("");
        setSuccess("");
    };


    // =========================================================
    // SAVE
    // =========================================================

    const handleSave = async (
        event
    ) => {

        event.preventDefault();

        if (!form.name.trim()) {

            setError(
                "Subject name is required."
            );

            return;
        }


        try {

            setSaving(true);
            setError("");
            setSuccess("");


            const updated =
                await updateAdminSubject(
                    id,
                    {
                        name:
                            form.name.trim(),

                        description:
                            form.description.trim() ||
                            null
                    }
                );


            setSubject(
                updated
            );

            setEditing(false);

            setSuccess(
                "Subject updated successfully."
            );

        } catch (error) {

            console.error(
                "Failed to update subject:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update subject."
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // TOGGLE STATUS
    // =========================================================

    const handleToggleStatus =
        async () => {

            if (!subject) {
                return;
            }

            try {

                setSaving(true);
                setError("");
                setSuccess("");

                const updated =
                    subject.active
                        ? await deactivateAdminSubject(
                            subject.id
                        )
                        : await activateAdminSubject(
                            subject.id
                        );

                setSubject(
                    updated
                );

                setSuccess(
                    updated.active
                        ? "Subject activated successfully."
                        : "Subject deactivated successfully."
                );

            } catch (error) {

                console.error(
                    "Failed to update subject status:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Failed to update subject status."
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
                        Loading subject...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error && !subject) {

        return (

            <div className="mx-auto max-w-3xl">

                <Link
                    to="/admin/subjects"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft size={18} />

                    Back to Subjects

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <AlertCircle
                        size={45}
                        className="mx-auto text-red-400"
                    />

                    <h1 className="mt-4 text-xl font-bold text-red-800">
                        Unable to load subject
                    </h1>

                    <p className="mt-2 text-red-700">
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    if (!subject) {
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
            className="mx-auto max-w-4xl space-y-8 pb-10"
        >

            {/* BACK */}

            <Link
                to="/admin/subjects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Subjects

            </Link>


            {/* HEADER */}

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                    <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">

                            <BookOpen size={30} />

                        </div>


                        <div>

                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                    subject.active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                            >

                                {subject.active
                                    ? "Active"
                                    : "Inactive"}

                            </span>


                            <h1 className="mt-3 text-3xl font-bold text-gray-900">

                                {subject.name}

                            </h1>

                        </div>

                    </div>


                    <div className="flex flex-wrap gap-2">

                        <button
                            type="button"
                            onClick={handleEdit}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >

                            <Edit3 size={16} />

                            Edit

                        </button>


                        <button
                            type="button"
                            onClick={
                                handleToggleStatus
                            }
                            disabled={saving}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                                subject.active
                                    ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                        >

                            {saving ? (

                                <Loader2
                                    size={16}
                                    className="animate-spin"
                                />

                            ) : (

                                <Power size={16} />
                            )}

                            {subject.active
                                ? "Deactivate"
                                : "Activate"}

                        </button>

                    </div>

                </div>


                {/* DESCRIPTION */}

                <div className="mt-8 rounded-2xl bg-gray-50 p-6">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Description
                    </p>

                    <p className="mt-3 whitespace-pre-wrap leading-7 text-gray-600">

                        {subject.description ||
                            "No description provided."}

                    </p>

                </div>


                {/* ID */}

                <div className="mt-6">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Subject ID
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                        {subject.id}
                    </p>

                </div>

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

            {error && subject && (

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


            {/* =================================================
                EDIT FORM
            ================================================= */}

            {editing && (

                <motion.form
                    initial={{
                        opacity: 0,
                        y: 15
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    onSubmit={handleSave}
                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    <div>

                        <h2 className="text-xl font-bold text-gray-900">
                            Edit Subject
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Update the subject details.
                        </p>

                    </div>


                    <div className="mt-6 space-y-5">

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">

                                Subject Name

                            </label>

                            <input
                                type="text"
                                value={form.name}
                                onChange={event =>
                                    setForm(
                                        previous => ({
                                            ...previous,
                                            name:
                                                event.target.value
                                        })
                                    )
                                }
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">

                                Description

                            </label>

                            <textarea
                                value={
                                    form.description
                                }
                                onChange={event =>
                                    setForm(
                                        previous => ({
                                            ...previous,
                                            description:
                                                event.target.value
                                        })
                                    )
                                }
                                rows={5}
                                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>


                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    setEditing(false)
                                }
                                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {saving ? (

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <CheckCircle2
                                        size={18}
                                    />
                                )}

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </div>

                </motion.form>
            )}

        </motion.div>
    );
}