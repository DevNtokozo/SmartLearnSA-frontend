import { motion } from "framer-motion";

import {
    ArrowRight,
    BookOpen,
    GraduationCap
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../components/home/Navbar";
import Statistics from "../components/home/Statistics";
import WhyChooseUs from "../components/home/WhyChooseUs";

export default function Home() {

    return (

        <div className="min-h-screen bg-white">

            <Navbar />

            {/* =================================================
                HERO
            ================================================= */}

            <section
                id="home"
                className="overflow-hidden bg-linear-to-br from-indigo-50 via-white to-slate-100"
            >

                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">

                    <div className="grid items-center gap-12 lg:grid-cols-2">

                        {/* Text */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -30
                            }}
                            animate={{
                                opacity: 1,
                                x: 0
                            }}
                            transition={{
                                duration: 0.6
                            }}
                        >

                            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">

                                <GraduationCap size={16} />

                                Learning for South African Students

                            </span>


                            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

                                Learn today.

                                <span className="block text-indigo-600">
                                    Grow tomorrow.
                                </span>

                            </h1>


                            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">

                                SmartLearnSA helps students learn through
                                structured courses, engaging lessons,
                                assignments and personalised tutor feedback.

                            </p>


                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
                                >

                                    Start Learning

                                    <ArrowRight size={18} />

                                </Link>


                                <Link
                                    to="/courses"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50"
                                >

                                    <BookOpen size={18} />

                                    Explore Courses

                                </Link>

                            </div>

                        </motion.div>


                        {/* Visual */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1
                            }}
                            transition={{
                                duration: 0.7
                            }}
                            className="relative"
                        >

                            <div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-2xl">

                                <div className="rounded-2xl bg-indigo-600 p-8 text-white">

                                    <BookOpen size={42} />

                                    <h2 className="mt-8 text-2xl font-bold">
                                        Your learning journey
                                    </h2>

                                    <p className="mt-3 text-indigo-100">
                                        Courses → Lessons → Assignments → Progress
                                    </p>

                                </div>


                                <div className="mt-5 grid grid-cols-2 gap-4">

                                    <div className="rounded-2xl bg-gray-50 p-5">

                                        <p className="text-sm text-gray-500">
                                            Courses
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            Learn
                                        </p>

                                    </div>


                                    <div className="rounded-2xl bg-gray-50 p-5">

                                        <p className="text-sm text-gray-500">
                                            Feedback
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-gray-900">
                                            Grow
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </motion.div>

                    </div>

                </div>

            </section>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <Statistics />


            {/* =================================================
                WHY CHOOSE US
            ================================================= */}

            <WhyChooseUs />


            {/* =================================================
                COURSES ANCHOR
            ================================================= */}

            <section
                id="courses"
                className="py-20"
            >

                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

                    <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                        Courses
                    </span>

                    <h2 className="mt-5 text-3xl font-bold text-gray-900 sm:text-4xl">

                        Explore your learning journey

                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-500">

                        Discover courses, lessons and assignments
                        designed to help you keep learning.

                    </p>


                    <Link
                        to="/register"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
                    >

                        Get Started

                        <ArrowRight size={18} />

                    </Link>

                </div>

            </section>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="border-t border-gray-100 bg-gray-950 py-10 text-white">

                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

                    <div className="flex items-center justify-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">

                            <BookOpen size={21} />

                        </div>

                        <span className="text-xl font-bold">
                            SmartLearnSA
                        </span>

                    </div>


                    <p className="mt-4 text-sm text-gray-400">

                        Learn • Grow • Succeed

                    </p>


                    <p className="mt-6 text-xs text-gray-500">

                        © {new Date().getFullYear()} SmartLearnSA.
                        All rights reserved.

                    </p>

                </div>

            </footer>

        </div>
    );
}