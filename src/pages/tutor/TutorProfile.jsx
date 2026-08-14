import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Camera,
    Loader2,
    Save,
    UserCircle
} from "lucide-react";

import {
    getTutorProfile,
    updateTutorProfile
} from "../../api/tutorApi";

export default function TutorProfile() {

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        profilePicture: "",
        qualification: "",
        bio: ""
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    useEffect(() => {

        loadProfile();

    }, []);


    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getTutorProfile();

            setForm({
                firstName:
                    data.firstName || "",

                lastName:
                    data.lastName || "",

                phone:
                    data.phone || "",

                profilePicture:
                    data.profilePicture || "",

                qualification:
                    data.qualification || "",

                bio:
                    data.bio || ""
            });

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load profile."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;

        setForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            await updateTutorProfile(
                form
            );

            setSuccess(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );

        } finally {

            setSaving(false);
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
            className="mx-auto max-w-4xl"
        >

            <div>

                <p className="text-sm font-semibold text-indigo-600">
                    Tutor Account
                </p>

                <h1 className="mt-1 text-3xl font-bold text-gray-900">
                    My Profile
                </h1>

                <p className="mt-2 text-gray-500">
                    Update the information students see about you.
                </p>

            </div>


            {error && (

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>

            )}


            {success && (

                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                    {success}
                </div>

            )}


            <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
            >

                {/* PROFILE */}

                <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-8">

                    {form.profilePicture ? (

                        <img
                            src={form.profilePicture}
                            alt="Tutor profile"
                            className="h-28 w-28 rounded-full object-cover"
                        />

                    ) : (

                        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">

                            <UserCircle
                                size={60}
                            />

                        </div>
                    )}

                    <p className="text-sm text-gray-500">
                        Add a profile picture URL below.
                    </p>

                </div>


                {/* BASIC INFORMATION */}

                <div>

                    <h2 className="text-lg font-bold text-gray-900">
                        Personal Information
                    </h2>


                    <div className="mt-5 grid gap-5 sm:grid-cols-2">

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                First Name
                            </label>

                            <input
                                type="text"
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Last Name
                            </label>

                            <input
                                type="text"
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Phone
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>


                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Profile Picture URL
                            </label>

                            <input
                                type="url"
                                name="profilePicture"
                                value={form.profilePicture}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                        </div>

                    </div>

                </div>


                {/* PROFESSIONAL INFORMATION */}

                <div className="border-t border-gray-100 pt-8">

                    <h2 className="text-lg font-bold text-gray-900">
                        Professional Information
                    </h2>


                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Qualification
                        </label>

                        <input
                            type="text"
                            name="qualification"
                            value={form.qualification}
                            onChange={handleChange}
                            placeholder="e.g. BSc Mathematics and Information Systems"
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                    </div>


                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            About Me
                        </label>

                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            rows={6}
                            maxLength={1000}
                            placeholder="Tell students about your experience, teaching approach and subjects..."
                            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 leading-7 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />

                        <p className="mt-2 text-xs text-gray-400">
                            {form.bio.length}/1000
                        </p>

                    </div>

                </div>


                {/* SAVE */}

                <div className="flex justify-end border-t border-gray-100 pt-6">

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {saving ? (

                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Saving...

                            </>

                        ) : (

                            <>
                                <Save
                                    size={18}
                                />

                                Save Changes

                            </>
                        )}

                    </button>

                </div>

            </form>

        </motion.div>
    );
}