import { motion } from "framer-motion";
import {
    BookOpen,
    ShieldCheck,
    Users
} from "lucide-react";

export default function AdminDashboard() {

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
                    Administration
                </p>

                <h1 className="mt-2 text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>

                <p className="mt-2 text-gray-500">
                    Manage the SmartLearn platform.
                </p>

            </motion.div>


            <div className="grid gap-6 md:grid-cols-3">

                <AdminCard
                    icon={Users}
                    title="Users"
                    description="Manage students, tutors and other accounts."
                />

                <AdminCard
                    icon={BookOpen}
                    title="Courses"
                    description="Review courses across the platform."
                />

                <AdminCard
                    icon={ShieldCheck}
                    title="Platform"
                    description="Monitor the overall learning environment."
                />

            </div>

        </div>
    );
}


function AdminCard({
    icon: Icon,
    title,
    description
}) {

    return (

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                <Icon size={24} />

            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
            </p>

        </div>
    );
}