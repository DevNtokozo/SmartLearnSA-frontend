import { motion } from "framer-motion";
import {
    ArrowRight,
    BookOpen,
    GraduationCap,
    Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {

    return (

        <div className="min-h-screen bg-white">

            <section className="relative overflow-hidden bg-linear-to-br from-indigo-700 via-indigo-600 to-slate-900">

                <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -30
                        }}
                        animate={{
                            opacity: 1,
                            x: 0
                        }}
                    >

                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">

                            <Sparkles size={16} />

                            Smart Learning for South Africa

                        </span>


                        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">

                            Learn.
                            <br />

                            Build.
                            <br />

                            Succeed.

                        </h1>


                        <p className="mt-6 max-w-xl text-lg leading-8 text-indigo-100">

                            SmartLearn helps students learn through structured courses,
                            engaging lessons and meaningful assignments.

                        </p>


                        <div className="mt-8 flex flex-wrap gap-4">

                            <Link
                                to="/student/courses"
                                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50"
                            >

                                Explore Courses

                                <ArrowRight size={18} />

                            </Link>


                            <Link
                                to="/login"
                                className="rounded-xl border border-white/30 px-5 py-3 font-semibold text-white hover:bg-white/10"
                            >

                                Sign In

                            </Link>

                        </div>

                    </motion.div>


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
                            delay: 0.15
                        }}
                        className="flex items-center justify-center"
                    >

                        <div className="grid w-full max-w-lg gap-4 sm:grid-cols-2">

                            <FeatureCard
                                icon={BookOpen}
                                title="Courses"
                                text="Structured learning paths."
                            />

                            <FeatureCard
                                icon={GraduationCap}
                                title="Lessons"
                                text="Learn step by step."
                            />

                        </div>

                    </motion.div>

                </div>

            </section>

        </div>
    );
}


function FeatureCard({
    icon: Icon,
    title,
    text
}) {

    return (

        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-white backdrop-blur">

            <Icon size={28} />

            <h2 className="mt-5 text-xl font-bold">
                {title}
            </h2>

            <p className="mt-2 text-sm text-indigo-100">
                {text}
            </p>

        </div>
    );
}