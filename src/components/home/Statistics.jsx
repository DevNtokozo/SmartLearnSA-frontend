import { motion } from "framer-motion";
import {
    BookOpen,
    GraduationCap,
    Users,
    Award
} from "lucide-react";

const statistics = [
    {
        value: "R-University",
        label: "Grades Supported",
        icon: GraduationCap
    },
   
    {
        value: "CAPS/IEB/University",
        label: "Curriculum Options",
        icon: Award
    },
    {
        value: "24/7",
        label: "Learning Access",
        icon: Users
    }
];

export default function Statistics() {

    return (

        <section
            id="statistics"
            className="border-y border-gray-100 bg-white py-16"
        >

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">

                    {statistics.map(
                        (stat, index) => {

                            const Icon =
                                stat.icon;

                            return (

                                <motion.div
                                    key={stat.label}
                                    initial={{
                                        opacity: 0,
                                        y: 25
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    viewport={{
                                        once: true
                                    }}
                                    transition={{
                                        delay:
                                            index * 0.08
                                    }}
                                    className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center"
                                >

                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                        <Icon size={24} />

                                    </div>


                                    <p className="mt-4 text-3xl font-bold text-gray-900">

                                        {stat.value}

                                    </p>


                                    <p className="mt-1 text-sm font-medium text-gray-500">

                                        {stat.label}

                                    </p>

                                </motion.div>
                            );
                        }
                    )}

                </div>

            </div>

        </section>
    );
}