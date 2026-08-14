import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    CheckCircle2,
    Loader2,
    Mail,
    Phone,
    Power,
    Shield,
    ShieldCheck,
    User,
    UserX
} from "lucide-react";

import {
    disableAdminUser,
    enableAdminUser,
    getAdminUser
} from "../../api/adminApi";


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


const getRoleClasses = (role) => {

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


const getInitials = (
    firstName,
    lastName
) => {

    const first =
        firstName?.trim()?.[0] || "";

    const last =
        lastName?.trim()?.[0] || "";

    return (
        `${first}${last}`.toUpperCase()
        || "U"
    );
};


export default function AdminUserDetails() {

    const navigate =
        useNavigate();

    const { id } =
        useParams();


    // =========================================================
    // STATE
    // =========================================================

    const [user, setUser] =
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
    // LOAD USER
    // =========================================================

    useEffect(() => {

        if (!id) {

            setError(
                "User ID is missing."
            );

            setLoading(false);

            return;
        }

        loadUser();

    }, [id]);


    const loadUser = async () => {

        try {

            setLoading(true);
            setError("");
            setSuccess("");


            const data =
                await getAdminUser(id);


            setUser(data);

        } catch (error) {

            console.error(
                "Failed to load user:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to load user."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // ENABLE / DISABLE
    // =========================================================

    const handleStatusChange = async () => {

        if (!user) {
            return;
        }


        try {

            setProcessing(true);
            setError("");
            setSuccess("");


            let updatedUser;


            if (user.enabled) {

                updatedUser =
                    await disableAdminUser(
                        user.id
                    );

                setSuccess(
                    "User account has been disabled."
                );

            } else {

                updatedUser =
                    await enableAdminUser(
                        user.id
                    );

                setSuccess(
                    "User account has been enabled."
                );
            }


            setUser(
                updatedUser
            );

        } catch (error) {

            console.error(
                "Failed to update user:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update user status."
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
                        Loading user...
                    </p>

                </div>

            </div>
        );
    }


    // =========================================================
    // ERROR WITHOUT USER
    // =========================================================

    if (error && !user) {

        return (

            <div className="mx-auto max-w-3xl">

                <Link
                    to="/admin/users"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >

                    <ArrowLeft
                        size={18}
                    />

                    Back to Users

                </Link>


                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <UserX
                        size={45}
                        className="mx-auto text-red-400"
                    />

                    <h1 className="mt-4 text-xl font-bold text-red-800">
                        Unable to load user
                    </h1>

                    <p className="mt-2 text-red-700">
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    if (!user) {
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
            className="mx-auto max-w-5xl space-y-8 pb-10"
        >

            {/* =================================================
                BACK
            ================================================= */}

            <Link
                to="/admin/users"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >

                <ArrowLeft size={18} />

                Back to Users

            </Link>


            {/* =================================================
                PROFILE HEADER
            ================================================= */}

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-8 text-white sm:px-8">

                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-4">

                            {user.profilePicture ? (

                                <img
                                    src={
                                        user.profilePicture
                                    }
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="h-20 w-20 rounded-2xl border-2 border-white/30 object-cover"
                                />

                            ) : (

                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold">

                                    {getInitials(
                                        user.firstName,
                                        user.lastName
                                    )}

                                </div>
                            )}


                            <div>

                                <h1 className="text-3xl font-bold">

                                    {user.firstName}
                                    {" "}
                                    {user.lastName}

                                </h1>


                                <p className="mt-1 text-indigo-100">

                                    {user.email}

                                </p>


                                <div className="mt-3 flex flex-wrap gap-2">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${getRoleClasses(
                                            user.role
                                        )}`}
                                    >

                                        {formatRole(
                                            user.role
                                        )}

                                    </span>


                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                                            user.enabled
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >

                                        {user.enabled
                                            ? "Enabled"
                                            : "Disabled"}

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ACTION */}

                        {user.role !== "ADMIN" ? (

                            <button
                                type="button"
                                onClick={
                                    handleStatusChange
                                }
                                disabled={processing}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                    user.enabled
                                        ? "bg-white text-red-600 hover:bg-red-50"
                                        : "bg-white text-indigo-600 hover:bg-indigo-50"
                                }`}
                            >

                                {processing ? (

                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Power
                                        size={18}
                                    />
                                )}

                                {processing
                                    ? "Saving..."
                                    : user.enabled
                                        ? "Disable Account"
                                        : "Enable Account"}

                            </button>

                        ) : (

                            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold">

                                <ShieldCheck
                                    size={18}
                                />

                                Protected Admin

                            </div>
                        )}

                    </div>

                </div>


                {/* =================================================
                    PROFILE CONTENT
                ================================================= */}

                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">

                    {/* =================================================
                        CONTACT
                    ================================================= */}

                    <InfoCard
                        title="Contact Information"
                    >

                        <InfoRow
                            icon={Mail}
                            label="Email"
                            value={user.email}
                        />

                        <InfoRow
                            icon={Phone}
                            label="Phone"
                            value={
                                user.phone ||
                                "Not provided"
                            }
                        />

                    </InfoCard>


                    {/* =================================================
                        ACCOUNT
                    ================================================= */}

                    <InfoCard
                        title="Account Information"
                    >

                        <InfoRow
                            icon={User}
                            label="User ID"
                            value={
                                String(
                                    user.id
                                )
                            }
                        />

                        <InfoRow
                            icon={Shield}
                            label="Role"
                            value={
                                formatRole(
                                    user.role
                                )
                            }
                        />

                        <InfoRow
                            icon={
                                user.enabled
                                    ? CheckCircle2
                                    : UserX
                            }
                            label="Status"
                            value={
                                user.enabled
                                    ? "Enabled"
                                    : "Disabled"
                            }
                        />

                        <InfoRow
                            icon={Shield}
                            label="Account Locked"
                            value={
                                user.accountLocked
                                    ? "Yes"
                                    : "No"
                            }
                        />

                        <InfoRow
                            icon={User}
                            label="Created"
                            value={
                                formatDate(
                                    user.createdAt
                                )
                            }
                        />

                    </InfoCard>

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

                    <CheckCircle2
                        size={19}
                    />

                    {success}

                </motion.div>
            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && user && (

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

                    <UserX
                        size={19}
                    />

                    {error}

                </motion.div>
            )}


            {/* =================================================
                ADMIN INFORMATION
            ================================================= */}

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

                <div className="flex items-start gap-3">

                    <ShieldCheck
                        size={22}
                        className="mt-0.5 shrink-0 text-indigo-600"
                    />

                    <div>

                        <h2 className="font-bold text-gray-900">
                            Account Administration
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-gray-600">

                            Account status is controlled by the
                            administrator. Disabled users cannot
                            authenticate successfully while their
                            account remains disabled.

                        </p>

                    </div>

                </div>

            </div>

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