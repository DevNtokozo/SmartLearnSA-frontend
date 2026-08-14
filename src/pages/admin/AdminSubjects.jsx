import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    Edit3,
    Loader2,
    Plus,
    Power,
    Search,
    X
} from "lucide-react";

import {
    activateAdminSubject,
    createAdminSubject,
    deactivateAdminSubject,
    getAdminSubjects,
    updateAdminSubject
} from "../../api/adminApi";


export default function AdminSubjects() {

    // =========================================================
    // STATE
    // =========================================================

    const [subjects, setSubjects] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [showForm, setShowForm] =
        useState(false);

    const [editingSubject, setEditingSubject] =
        useState(null);

    const [form, setForm] =
        useState({
            name: "",
            description: ""
        });


    // =========================================================
    // LOAD SUBJECTS
    // =========================================================

    useEffect(() => {

        loadSubjects();

    }, []);


    const loadSubjects = async (
        searchValue = search
    ) => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getAdminSubjects(
                    searchValue
                );

            setSubjects(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load subjects:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load subjects."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = async (
        event
    ) => {

        event.preventDefault();

        await loadSubjects(
            search.trim()
        );
    };


    // =========================================================
    // CLEAR SEARCH
    // =========================================================

    const handleClearSearch = async () => {

        setSearch("");

        await loadSubjects("");
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


        setError("");
    };


    // =========================================================
    // OPEN CREATE
    // =========================================================

    const openCreate = () => {

        setEditingSubject(
            null
        );

        setForm({
            name: "",
            description: ""
        });

        setError("");

        setShowForm(true);
    };


    // =========================================================
    // OPEN EDIT
    // =========================================================

    const openEdit = (
        subject
    ) => {

        setEditingSubject(
            subject
        );

        setForm({
            name:
                subject.name ||
                "",

            description:
                subject.description ||
                ""
        });

        setError("");

        setShowForm(true);
    };


    // =========================================================
    // CLOSE FORM
    // =========================================================

    const closeForm = () => {

        if (saving) {
            return;
        }

        setShowForm(false);

        setEditingSubject(
            null
        );

        setForm({
            name: "",
            description: ""
        });
    };


    // =========================================================
    // SAVE SUBJECT
    // =========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        const name =
            form.name.trim();

        if (!name) {

            setError(
                "Subject name is required."
            );

            return;
        }


        try {

            setSaving(true);
            setError("");


            const data = {

                name,

                description:
                    form.description.trim() ||
                    null

            };


            let result;


            if (editingSubject) {

                result =
                    await updateAdminSubject(
                        editingSubject.id,
                        data
                    );

            } else {

                result =
                    await createAdminSubject(
                        data
                    );
            }


            setSubjects(
                previous => {

                    if (editingSubject) {

                        return previous.map(
                            subject =>
                                subject.id ===
                                result.id
                                    ? result
                                    : subject
                        );
                    }

                    return [
                        result,
                        ...previous
                    ];
                }
            );


            closeForm();

        } catch (error) {

            console.error(
                "Failed to save subject:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to save subject."
            );

        } finally {

            setSaving(false);
        }
    };


    // =========================================================
    // TOGGLE STATUS
    // =========================================================

    const handleToggleStatus = async (
        subject
    ) => {

        try {

            setError("");


            const updated =
                subject.active

                    ? await deactivateAdminSubject(
                        subject.id
                    )

                    : await activateAdminSubject(
                        subject.id
                    );


            setSubjects(
                previous =>
                    previous.map(
                        item =>
                            item.id ===
                            updated.id
                                ? updated
                                : item
                    )
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
                        Loading subjects...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

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
                className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
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
                                Subjects
                            </h1>

                        </div>

                    </div>


                    <p className="mt-3 max-w-2xl text-gray-500">
                        Manage the subjects available throughout SmartLearnSA.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                >

                    <Plus
                        size={18}
                    />

                    Add Subject

                </button>

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

            <form
                onSubmit={handleSearch}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
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
                            placeholder="Search subjects..."
                            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-11 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />


                        {search && (

                            <button
                                type="button"
                                onClick={
                                    handleClearSearch
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >

                                <X
                                    size={16}
                                />

                            </button>
                        )}

                    </div>


                    <button
                        type="submit"
                        className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
                    >

                        Search

                    </button>

                </div>


                <p className="mt-3 text-xs text-gray-500">
                    Search by subject name or description.
                </p>

            </form>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-3">

                <SummaryCard
                    label="Total Subjects"
                    value={
                        subjects.length
                    }
                    icon={BookOpen}
                />


                <SummaryCard
                    label="Active"
                    value={
                        subjects.filter(
                            subject =>
                                subject.active
                        ).length
                    }
                    icon={CheckCircle2}
                />


                <SummaryCard
                    label="Inactive"
                    value={
                        subjects.filter(
                            subject =>
                                !subject.active
                        ).length
                    }
                    icon={Power}
                />

            </div>


            {/* =================================================
                EMPTY
            ================================================= */}

            {subjects.length === 0 && (

                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

                    <BookOpen
                        size={48}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                        No subjects found
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Add a subject or change your search.
                    </p>


                    <button
                        type="button"
                        onClick={openCreate}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                    >

                        <Plus
                            size={18}
                        />

                        Add Subject

                    </button>

                </div>
            )}


            {/* =================================================
                SUBJECT CARDS
            ================================================= */}

            {subjects.length > 0 && (

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                    {subjects.map(
                        (
                            subject,
                            index
                        ) => (

                            <motion.div
                                key={
                                    subject.id
                                }
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
                                        0.04
                                }}
                                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                {/* TOP */}

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                        <BookOpen
                                            size={21}
                                        />

                                    </div>


                                    <span
                                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                            subject.active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >

                                        {subject.active
                                            ? "Active"
                                            : "Inactive"}

                                    </span>

                                </div>


                                {/* NAME */}

                                <Link
                                    to={`/admin/subjects/${subject.id}`}
                                    className="mt-5 block text-xl font-bold text-gray-900 transition hover:text-indigo-600"
                                >

                                    {subject.name}

                                </Link>


                                {/* DESCRIPTION */}

                                <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-500">

                                    {subject.description ||
                                        "No description provided."}

                                </p>


                                {/* ACTIONS */}

                                <div className="mt-6 flex gap-2 border-t border-gray-100 pt-5">

                                    <Link
                                        to={`/admin/subjects/${subject.id}`}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                    >

                                        <Edit3
                                            size={15}
                                        />

                                        View / Edit

                                    </Link>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleToggleStatus(
                                                subject
                                            )
                                        }
                                        className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                                            subject.active
                                                ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                                        }`}
                                    >

                                        <Power
                                            size={15}
                                        />

                                        {subject.active
                                            ? "Deactivate"
                                            : "Activate"}

                                    </button>

                                </div>

                            </motion.div>

                        )
                    )}

                </div>
            )}


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            {showForm && (

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
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
                    >

                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">

                                    {editingSubject
                                        ? "Edit Subject"
                                        : "Create Subject"}

                                </h2>


                                <p className="mt-1 text-sm text-gray-500">

                                    {editingSubject
                                        ? "Update this subject's information."
                                        : "Add a new subject to SmartLearnSA."}

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={closeForm}
                                disabled={saving}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <X
                                    size={19}
                                />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="mt-6 space-y-5"
                        >

                            {/* NAME */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">

                                    Subject Name
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>

                                </label>


                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    maxLength={100}
                                    placeholder="e.g. Mathematics"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">

                                    Description

                                </label>


                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={5}
                                    maxLength={500}
                                    placeholder="Describe this subject..."
                                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>


                            {/* ACTIONS */}

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    disabled={saving}
                                    className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                                        : editingSubject
                                            ? "Save Changes"
                                            : "Create Subject"}

                                </button>

                            </div>

                        </form>

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

                    <Icon
                        size={21}
                    />

                </div>

            </div>

        </div>
    );
}