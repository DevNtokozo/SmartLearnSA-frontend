import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    AlertCircle,
    CheckCircle2,
    Eye,
    Filter,
    Loader2,
    Mail,
    Power,
    RefreshCw,
    Search,
    ShieldCheck,
    User,
    UserCheck,
    UserX,
    X
} from "lucide-react";

import {
    disableAdminUser,
    enableAdminUser,
    getAdminUsers
} from "../../api/adminApi";


const ROLE_OPTIONS = [
    "ALL",
    "ADMIN",
    "TUTOR",
    "PARENT",
    "STUDENT"
];


const formatRole = (role) => {

    if (!role) {
        return "";
    }

    return (
        role.charAt(0) +
        role
            .slice(1)
            .toLowerCase()
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

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );
};


const getInitials = (
    firstName,
    lastName
) => {

    const first =
        firstName?.trim()?.[0] || "";

    const last =
        lastName?.trim()?.[0] || "";

    const initials =
        `${first}${last}`.toUpperCase();

    return initials || "U";
};


const getRoleClasses = (
    role
) => {

    switch (role) {

        case "ADMIN":
            return "bg-purple-100 text-purple-700";

        case "TUTOR":
            return "bg-indigo-100 text-indigo-700";

        case "PARENT":
            return "bg-amber-100 text-amber-700";

        case "STUDENT":
            return "bg-emerald-100 text-emerald-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};


export default function AdminUsers() {

    // =========================================================
    // STATE
    // =========================================================

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [role, setRole] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [processingId, setProcessingId] =
        useState(null);

    const [confirmUser, setConfirmUser] =
        useState(null);


    // =========================================================
    // LOAD USERS
    // =========================================================

    useEffect(() => {

        loadUsers();

    }, [role]);


    const loadUsers = async (
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
                await getAdminUsers({
                    search,
                    role:
                        role === "ALL"
                            ? ""
                            : role
                });


            setUsers(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load users:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load users."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearchSubmit = (
        event
    ) => {

        event.preventDefault();

        loadUsers({
            refresh: true
        });
    };


    // =========================================================
    // RESET FILTERS
    // =========================================================

    const resetFilters = () => {

        setSearch("");
        setRole("ALL");
        setStatusFilter("ALL");


        setTimeout(() => {

            getAdminUsers()
                .then(data => {

                    setUsers(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                    setError("");

                })
                .catch(error => {

                    console.error(error);

                    setError(
                        error.response?.data?.message ||
                        "Failed to load users."
                    );
                });

        }, 0);
    };


    // =========================================================
    // LOCAL STATUS FILTER
    // =========================================================

    const displayedUsers =
        useMemo(() => {

            if (
                statusFilter ===
                "ALL"
            ) {
                return users;
            }


            if (
                statusFilter ===
                "ENABLED"
            ) {

                return users.filter(
                    user =>
                        user.enabled === true
                );
            }


            if (
                statusFilter ===
                "DISABLED"
            ) {

                return users.filter(
                    user =>
                        user.enabled === false
                );
            }


            return users;

        }, [
            users,
            statusFilter
        ]);


    // =========================================================
    // ENABLE / DISABLE
    // =========================================================

    const handleStatusChange = async () => {

        if (!confirmUser) {
            return;
        }


        const user =
            confirmUser;


        try {

            setProcessingId(
                user.id
            );

            setError("");


            if (user.enabled) {

                await disableAdminUser(
                    user.id
                );

            } else {

                await enableAdminUser(
                    user.id
                );
            }


            setUsers(
                previous =>
                    previous.map(
                        item =>
                            item.id === user.id
                                ? {
                                    ...item,
                                    enabled:
                                        !user.enabled
                                }
                                : item
                    )
            );


            setConfirmUser(
                null
            );

        } catch (error) {

            console.error(
                "Failed to update user status:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update user status."
            );

        } finally {

            setProcessingId(
                null
            );
        }
    };


    // =========================================================
    // SUMMARY COUNTS
    // =========================================================

    const enabledCount =
        users.filter(
            user =>
                user.enabled
        ).length;

    const disabledCount =
        users.filter(
            user =>
                !user.enabled
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
                        Loading users...
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

                            <UserCheck size={25} />

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-indigo-600">
                                Administration
                            </p>

                            <h1 className="text-3xl font-bold text-gray-900">
                                User Management
                            </h1>

                        </div>

                    </div>


                    <p className="mt-3 max-w-2xl text-gray-500">
                        Search, filter and manage SmartLearnSA user accounts.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        loadUsers({
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
                    value={displayedUsers.length}
                    icon={User}
                />

                <SummaryCard
                    label="Enabled"
                    value={enabledCount}
                    icon={CheckCircle2}
                />

                <SummaryCard
                    label="Disabled"
                    value={disabledCount}
                    icon={UserX}
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

                    <p>
                        {error}
                    </p>

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


                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_220px_180px_auto]">

                    {/* SEARCH */}

                    <form
                        onSubmit={
                            handleSearchSubmit
                        }
                    >

                        <label
                            htmlFor="user-search"
                            className="sr-only"
                        >
                            Search users
                        </label>


                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />


                            <input
                                id="user-search"
                                type="search"
                                value={search}
                                onChange={event =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by name or email..."
                                className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                    </form>


                    {/* ROLE */}

                    <div>

                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Role
                        </label>


                        <select
                            value={role}
                            onChange={event =>
                                setRole(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >

                            {ROLE_OPTIONS.map(
                                option => (

                                    <option
                                        key={option}
                                        value={option}
                                    >

                                        {option ===
                                        "ALL"
                                            ? "All roles"
                                            : formatRole(
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
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >

                            <option value="ALL">
                                All statuses
                            </option>

                            <option value="ENABLED">
                                Enabled
                            </option>

                            <option value="DISABLED">
                                Disabled
                            </option>

                        </select>

                    </div>


                    {/* SEARCH BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            loadUsers({
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

                        {displayedUsers.length}
                        {" "}
                        user
                        {displayedUsers.length ===
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

            {displayedUsers.length === 0 && (

                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">

                    <UserX
                        size={46}
                        className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-4 text-xl font-bold text-gray-900">
                        No users found
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Try a different search term or filter.
                    </p>

                </div>
            )}


            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

            {displayedUsers.length > 0 && (

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1050px]">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        User
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Role
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Created
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                                {displayedUsers.map(
                                    (
                                        user,
                                        index
                                    ) => (

                                        <motion.tr
                                            key={user.id}
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

                                            {/* USER */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-3">

                                                    {user.profilePicture ? (

                                                        <img
                                                            src={
                                                                user.profilePicture
                                                            }
                                                            alt={`${user.firstName} ${user.lastName}`}
                                                            className="h-11 w-11 rounded-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">

                                                            {getInitials(
                                                                user.firstName,
                                                                user.lastName
                                                            )}

                                                        </div>

                                                    )}


                                                    <div className="min-w-0">

                                                        <p className="font-semibold text-gray-900">

                                                            {user.firstName}
                                                            {" "}
                                                            {user.lastName}

                                                        </p>


                                                        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">

                                                            <Mail
                                                                size={13}
                                                            />

                                                            <span className="truncate">
                                                                {user.email}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* ROLE */}

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getRoleClasses(
                                                        user.role
                                                    )}`}
                                                >

                                                    {formatRole(
                                                        user.role
                                                    )}

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td className="px-6 py-5">

                                                <div className="space-y-1">

                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                            user.enabled
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >

                                                        {user.enabled ? (
                                                            <CheckCircle2
                                                                size={13}
                                                            />
                                                        ) : (
                                                            <UserX
                                                                size={13}
                                                            />
                                                        )}

                                                        {user.enabled
                                                            ? "Enabled"
                                                            : "Disabled"}

                                                    </span>


                                                    {user.accountLocked && (

                                                        <p className="text-xs font-medium text-red-600">
                                                            Account locked
                                                        </p>
                                                    )}

                                                </div>

                                            </td>


                                            {/* CREATED */}

                                            <td className="px-6 py-5 text-sm text-gray-600">

                                                {formatDate(
                                                    user.createdAt
                                                )}

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-6 py-5">

                                                <div className="flex items-center justify-end gap-2">

                                                    <Link
                                                        to={`/admin/users/${user.id}`}
                                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                                    >

                                                        <Eye
                                                            size={15}
                                                        />

                                                        View

                                                    </Link>


                                                    {user.role !==
                                                        "ADMIN" && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setConfirmUser(
                                                                    user
                                                                )
                                                            }
                                                            disabled={
                                                                processingId ===
                                                                user.id
                                                            }
                                                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                                                user.enabled
                                                                    ? "border border-red-200 bg-white text-red-600 hover:bg-red-50"
                                                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                                            }`}
                                                        >

                                                            <Power
                                                                size={15}
                                                            />

                                                            {user.enabled
                                                                ? "Disable"
                                                                : "Enable"}

                                                        </button>
                                                    )}

                                                    {user.role ===
                                                        "ADMIN" && (

                                                        <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-2 text-xs font-semibold text-purple-700">

                                                            <ShieldCheck
                                                                size={14}
                                                            />

                                                            Protected

                                                        </span>
                                                    )}

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
                CONFIRM MODAL
            ================================================= */}

            {confirmUser && (

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

                                    {confirmUser.enabled
                                        ? "Disable Account?"
                                        : "Enable Account?"}

                                </h2>


                                <p className="mt-2 text-sm leading-6 text-gray-500">

                                    You are about to{" "}
                                    {confirmUser.enabled
                                        ? "disable"
                                        : "enable"}{" "}
                                    the account for{" "}

                                    <span className="font-semibold text-gray-700">

                                        {confirmUser.firstName}
                                        {" "}
                                        {confirmUser.lastName}

                                    </span>

                                    .

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setConfirmUser(
                                        null
                                    )
                                }
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            >

                                <X size={19} />

                            </button>

                        </div>


                        <div
                            className={`mt-5 rounded-xl p-4 text-sm ${
                                confirmUser.enabled
                                    ? "bg-red-50 text-red-700"
                                    : "bg-indigo-50 text-indigo-700"
                            }`}
                        >

                            {confirmUser.enabled
                                ? "The user will no longer be able to authenticate successfully while the account is disabled."
                                : "The user will be able to sign in again after the account is enabled."}

                        </div>


                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setConfirmUser(
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
                                    confirmUser.id
                                }
                                className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                                    confirmUser.enabled
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                            >

                                {processingId ===
                                confirmUser.id
                                    ? "Saving..."
                                    : confirmUser.enabled
                                        ? "Disable Account"
                                        : "Enable Account"}

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