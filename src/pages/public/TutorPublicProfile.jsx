import { useEffect, useState } from "react";
import {
    Link,
    useParams
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Loader2
} from "lucide-react";

import {
    getPublicTutorProfile
} from "../../api/tutorApi";

export default function TutorPublicProfile() {

    const { id } =
        useParams();

    const [tutor, setTutor] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadTutor();

    }, [id]);


    const loadTutor = async () => {

        try {

            setLoading(true);

            const data =
                await getPublicTutorProfile(id);

            setTutor(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load tutor profile."
            );

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <Loader2
                    size={40}
                    className="animate-spin text-indigo-600"
                />

            </div>
        );
    }


    if (error || !tutor) {

        return (
            <div className="mx-auto max-w-3xl">

                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                    <h1 className="text-xl font-bold text-gray-900">
                        Tutor not found
                    </h1>

                    <p className="mt-2 text-red-600">
                        {error}
                    </p>

                    <Link
                        to="/student/courses"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
                    >

                        <ArrowLeft size={18} />

                        Back to Courses

                    </Link>

                </div>

            </div>
        );
    }


    return (

        <div className="mx-auto max-w-4xl space-y-8">

            <Link
                to="/student/courses"
                className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
            >

                <ArrowLeft size={18} />

                Back to Courses

            </Link>


            <motion.section
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white sm:p-10">

                    <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">

                        {tutor.profilePicture ? (

                            <img
                                src={tutor.profilePicture}
                                alt={`${tutor.firstName} ${tutor.lastName}`}
                                className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white/20"
                            />

                        ) : (

                            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold">

                                {tutor.firstName?.charAt(0)}
                                {tutor.lastName?.charAt(0)}

                            </div>
                        )}


                        <div className="mt-6 sm:ml-6 sm:mt-0">

                            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-100">
                                SmartLearnSA Tutor
                            </p>

                            <h1 className="mt-2 text-3xl font-bold">
                                {tutor.firstName} {tutor.lastName}
                            </h1>

                            {tutor.qualification && (

                                <p className="mt-2 text-indigo-100">
                                    {tutor.qualification}
                                </p>

                            )}

                        </div>

                    </div>

                </div>


                <div className="space-y-8 p-8">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                <GraduationCap size={20} />

                            </div>

                            <h2 className="text-xl font-bold text-gray-900">
                                About Your Tutor
                            </h2>

                        </div>


                        <p className="mt-4 leading-8 text-gray-600">

                            {tutor.bio ||
                                "This tutor has not added a biography yet."}

                        </p>

                    </div>


                    <div className="border-t border-gray-100 pt-8">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">

                                <BookOpen size={20} />

                            </div>

                            <h2 className="text-xl font-bold text-gray-900">
                                Teaching Approach
                            </h2>

                        </div>


                        <p className="mt-4 leading-8 text-gray-600">

                            Learn through structured courses, lessons,
                            assignments and feedback designed to support
                            steady academic progress.

                        </p>

                    </div>

                </div>

            </motion.section>

        </div>
    );
}