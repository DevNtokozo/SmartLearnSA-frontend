import { useEffect, useState } from "react";

import {
    BookOpen,
    GraduationCap,
    ShieldCheck,
    Users,
    ClipboardList
} from "lucide-react";

import { motion } from "framer-motion";

import {
    getAdminDashboard
} from "../../api/adminApi";

export default function AdminDashboard() {

    const [stats, setStats] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadDashboard();

    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getAdminDashboard();

            setStats(data);

        } catch (error) {

            console.error(
                "Failed to load admin dashboard:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard."
            );

        } finally {

            setLoading(false);
        }
    };


    const cards = [

        {
            label: "Total Users",
            value: stats?.totalUsers ?? 0,
            icon: Users
        },

        {
            label: "Students",
            value: stats?.totalStudents ?? 0,
            icon: GraduationCap
        },

        {
            label: "Tutors",
            value: stats?.totalTutors ?? 0,
            icon: Users
        },

        {
            label: "Courses",
            value: stats?.totalCourses ?? 0,
            icon: BookOpen
        },

        {
            label: "Assignments",
            value: stats?.totalAssignments ?? 0,
            icon: ClipboardList
        },

        {
            label: "Enrollments",
            value: stats?.totalEnrollments ?? 0,
            icon: GraduationCap
        }

    ];


    return (

        <div className="space-y-8">

            <div>

                <p className="text-sm font-semibold text-indigo-600">
                    Administration
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                    Monitor the SmartLearnSA platform.
                </p>

            </div>


            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>

            )}


            {loading ? (

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                    {Array.from({
                        length: 6
                    }).map(
                        (_, index) => (

                            <div
                                key={index}
                                className="h-36 animate-pulse rounded-2xl bg-gray-200"
                            />

                        )
                    )}

                </div>

            ) : (

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                    {cards.map(
                        (
                            card,
                            index
                        ) => {

                            const Icon =
                                card.icon;

                            return (

                                <motion.div
                                    key={card.label}
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
                                            index * 0.06
                                    }}
                                    className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                                >

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                        <Icon
                                            size={24}
                                        />

                                    </div>

                                    <p className="mt-5 text-sm font-medium text-gray-500">

                                        {card.label}

                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-gray-900">

                                        {card.value}

                                    </p>

                                </motion.div>
                            );
                        }
                    )}

                </div>
            )}


            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

                <div className="flex items-center gap-3">

                    <ShieldCheck
                        size={24}
                        className="text-indigo-600"
                    />

                    <div>

                        <h2 className="font-bold text-gray-900">
                            Platform Status
                        </h2>

                        <p className="mt-1 text-sm text-gray-600">
                            SmartLearnSA administration is active.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}