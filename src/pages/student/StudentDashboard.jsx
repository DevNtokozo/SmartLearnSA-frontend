import { motion } from "framer-motion";
import {
    ArrowRight,
    BookOpen,
    ClipboardList
} from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {

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

                <p className="text-sm font-semibold text-indigo-600">
                    Student Portal
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    Student Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                    Continue learning and complete your assignments.
                </p>

            </motion.div>


            <div className="grid gap-6 md:grid-cols-2">

                <StudentCard
                    to="/student/courses"
                    icon={BookOpen}
                    title="My Courses"
                    description="Explore available SmartLearn courses and lessons."
                />

                <StudentCard
                    to="/student/assignments"
                    icon={ClipboardList}
                    title="Assignments"
                    description="View assignments, submit work and check feedback."
                />

            </div>

        </div>
    );
}


function StudentCard({
    to,
    icon: Icon,
    title,
    description
}) {

    return (

        <Link
            to={to}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                <Icon size={24} />

            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">

                Open

                <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                />

            </div>

        </Link>
    );
}