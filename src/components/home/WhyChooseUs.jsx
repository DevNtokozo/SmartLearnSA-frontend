import { motion } from "framer-motion";
import {
    BookOpen,
    CheckCircle,
    MonitorPlay,
    Users,
    Target,
    TrendingUp
} from "lucide-react";

const benefits = [
    {
        title: "Structured Learning",
        description:
            "Courses are organised into lessons, assignments and learning resources so students can progress step by step.",
        icon: BookOpen
    },
    {
        title: "South African Focus",
        description:
            "Support for South African grades and curriculum options helps learners find content relevant to their studies.",
        icon: Target
    },
    {
        title: "Learn Anywhere",
        description:
            "Access lessons, courses and assignments from a modern web-based learning platform.",
        icon: MonitorPlay
    },
    {
        title: "Tutor Support",
        description:
            "Tutors can provide assignment marks and personalised feedback to help students improve.",
        icon: Users
    },
    {
        title: "Track Your Progress",
        description:
            "Keep your assignments and submission history organised so you can review your academic work.",
        icon: TrendingUp
    },
    {
        title: "Simple Experience",
        description:
            "A clean interface makes it easy for students to discover courses and for tutors to manage learning content.",
        icon: CheckCircle
    }
];

export default function WhyChooseUs() {

    return (

        <section
            id="why-us"
            className="bg-gray-50 py-20"
        >

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Header */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}
                    viewport={{
                        once: true
                    }}
                    className="mx-auto max-w-2xl text-center"
                >

                    <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                        Why SmartLearnSA?
                    </span>


                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">

                        A smarter way to
                        <span className="text-indigo-600">
                            {" "}learn
                        </span>

                    </h2>


                    <p className="mt-4 text-lg leading-8 text-gray-500">

                        Everything you need to organise learning,
                        teaching and assignment progress in one place.

                    </p>

                </motion.div>


                {/* Benefits */}

                <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {benefits.map(
                        (
                            benefit,
                            index
                        ) => {

                            const Icon =
                                benefit.icon;

                            return (

                                <motion.div
                                    key={benefit.title}
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
                                            index * 0.06
                                    }}
                                    className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                        <Icon size={24} />

                                    </div>


                                    <h3 className="mt-5 text-xl font-bold text-gray-900">

                                        {benefit.title}

                                    </h3>


                                    <p className="mt-3 leading-7 text-gray-500">

                                        {benefit.description}

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