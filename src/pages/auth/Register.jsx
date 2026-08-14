import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import { motion } from "framer-motion";

import {
    BookOpen,
    Eye,
    EyeOff,
    GraduationCap,
    Lock,
    Mail,
    Phone,
    User
} from "lucide-react";

import {
    register
} from "../../api/authApi";


const GRADE_OPTIONS = [
    "GRADE_R",
    "GRADE_1",
    "GRADE_2",
    "GRADE_3",
    "GRADE_4",
    "GRADE_5",
    "GRADE_6",
    "GRADE_7",
    "GRADE_8",
    "GRADE_9",
    "GRADE_10",
    "GRADE_11",
    "GRADE_12",
    "UNIVERSITY"
];


const formatGrade = (grade) => {

    if (grade === "UNIVERSITY") {
        return "University";
    }

    return grade.replace(
        "GRADE_",
        "Grade "
    );
};


export default function Register() {

    const navigate = useNavigate();


    // =========================================================
    // FORM
    // =========================================================

    const [form, setForm] = useState({

        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",

        role: "STUDENT",

        grade: "",
        school: "",

        qualification: "",
        bio: ""

    });


    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

        setError("");
    };


    // =========================================================
    // HANDLE ROLE
    // =========================================================

    const handleRoleChange = (
        role
    ) => {

        setForm(previous => ({

            ...previous,

            role,

            grade:
                role === "STUDENT"
                    ? previous.grade
                    : "",

            school:
                role === "STUDENT"
                    ? previous.school
                    : "",

            qualification:
                role === "TUTOR"
                    ? previous.qualification
                    : "",

            bio:
                role === "TUTOR"
                    ? previous.bio
                    : ""

        }));

        setError("");
    };


    // =========================================================
    // VALIDATE
    // =========================================================

    const validateForm = () => {

        if (!form.firstName.trim()) {

            return "First name is required.";
        }


        if (!form.lastName.trim()) {

            return "Last name is required.";
        }


        if (!form.email.trim()) {

            return "Email address is required.";
        }


        if (!form.password) {

            return "Password is required.";
        }


        if (form.password.length < 6) {

            return "Password must contain at least 6 characters.";
        }


        if (form.role === "STUDENT") {

            if (!form.grade) {

                return "Please select your grade.";
            }


            if (!form.school.trim()) {

                return "School or institution is required.";
            }
        }


        if (form.role === "TUTOR") {

            if (!form.qualification.trim()) {

                return "Qualification is required.";
            }
        }


        return "";
    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(
                validationError
            );

            return;
        }


        try {

            setLoading(true);


            const registrationData = {

                firstName:
                    form.firstName.trim(),

                lastName:
                    form.lastName.trim(),

                email:
                    form.email.trim(),

                password:
                    form.password,

                phone:
                    form.phone.trim()
                    || null,

                role:
                    form.role,

                grade:
                    form.role === "STUDENT"
                        ? form.grade
                        : null,

                school:
                    form.role === "STUDENT"
                        ? form.school.trim()
                        : null,

                qualification:
                    form.role === "TUTOR"
                        ? form.qualification.trim()
                        : null,

                bio:
                    form.role === "TUTOR"
                        ? form.bio.trim()
                        : null

            };


            await register(
                registrationData
            );


            setSuccess(
                "Registration successful. Redirecting to login..."
            );


            setTimeout(() => {

                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );

            }, 800);

        } catch (error) {

            console.error(
                "Registration failed:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Registration failed. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-10">

            <div className="mx-auto max-w-2xl">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.5
                    }}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl sm:p-10"
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">

                            <BookOpen size={30} />

                        </div>


                        <h1 className="mt-6 text-3xl font-bold text-gray-900">
                            Create Your Account
                        </h1>


                        <p className="mt-2 text-gray-500">
                            Join SmartLearnSA and start your learning journey.
                        </p>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                        >

                            {error}

                        </motion.div>

                    )}


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
                            className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                        >

                            {success}

                        </motion.div>

                    )}


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                    >

                        {/* NAME */}

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    First Name *
                                </label>

                                <div className="relative">

                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="First name"
                                        className="w-full rounded-xl border border-gray-300 py-3.5 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Last Name *
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Last name"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>

                        </div>


                        {/* EMAIL + PHONE */}

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Email Address *
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-gray-300 py-3.5 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Phone
                                </label>

                                <div className="relative">

                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="072 000 0000"
                                        className="w-full rounded-xl border border-gray-300 py-3.5 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Password *
                            </label>

                            <div className="relative">

                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="new-password"
                                    placeholder="At least 6 characters"
                                    className="w-full rounded-xl border border-gray-300 py-3.5 pl-11 pr-12 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            previous =>
                                                !previous
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                >

                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}

                                </button>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div>

                            <label className="mb-3 block text-sm font-semibold text-gray-700">
                                Register as *
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRoleChange(
                                            "STUDENT"
                                        )
                                    }
                                    className={`rounded-2xl border p-5 text-left transition ${
                                        form.role === "STUDENT"
                                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                                            : "border-gray-200 hover:border-indigo-300"
                                    }`}
                                >

                                    <GraduationCap
                                        size={27}
                                        className="text-indigo-600"
                                    />

                                    <p className="mt-3 font-bold text-gray-900">
                                        Student
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-gray-500">
                                        Learn through courses, lessons and assignments.
                                    </p>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRoleChange(
                                            "TUTOR"
                                        )
                                    }
                                    className={`rounded-2xl border p-5 text-left transition ${
                                        form.role === "TUTOR"
                                            ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                                            : "border-gray-200 hover:border-indigo-300"
                                    }`}
                                >

                                    <BookOpen
                                        size={27}
                                        className="text-indigo-600"
                                    />

                                    <p className="mt-3 font-bold text-gray-900">
                                        Tutor
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-gray-500">
                                        Create courses and support students.
                                    </p>

                                </button>

                            </div>

                        </div>


                        {/* STUDENT */}

                        {form.role === "STUDENT" && (

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -10
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                className="space-y-5 rounded-2xl bg-gray-50 p-5"
                            >

                                <h2 className="font-bold text-gray-900">
                                    Student Information
                                </h2>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Grade *
                                    </label>

                                    <select
                                        name="grade"
                                        value={form.grade}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >

                                        <option value="">
                                            Select grade
                                        </option>

                                        {GRADE_OPTIONS.map(
                                            grade => (

                                                <option
                                                    key={grade}
                                                    value={grade}
                                                >

                                                    {formatGrade(
                                                        grade
                                                    )}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">

                                        {form.grade === "UNIVERSITY"
                                            ? "University / Institution *"
                                            : "School *"}

                                    </label>

                                    <input
                                        type="text"
                                        name="school"
                                        value={form.school}
                                        onChange={handleChange}
                                        required
                                        placeholder={
                                            form.grade === "UNIVERSITY"
                                                ? "University or institution"
                                                : "School name"
                                        }
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>

                            </motion.div>
                        )}


                        {/* TUTOR */}

                        {form.role === "TUTOR" && (

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -10
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                className="space-y-5 rounded-2xl bg-gray-50 p-5"
                            >

                                <h2 className="font-bold text-gray-900">
                                    Tutor Information
                                </h2>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Qualification *
                                    </label>

                                    <input
                                        type="text"
                                        name="qualification"
                                        value={
                                            form.qualification
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        placeholder="e.g. BSc Mathematics"
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Bio
                                    </label>

                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="Tell students about yourself..."
                                        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />

                                </div>

                            </motion.div>
                        )}


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"}

                        </button>

                    </form>


                    {/* LOGIN */}

                    <div className="mt-8 text-center">

                        <p className="text-sm text-gray-500">

                            Already have an account?

                            {" "}

                            <Link
                                to="/login"
                                className="font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Sign in
                            </Link>

                        </p>

                    </div>

                </motion.div>

            </div>

        </div>
    );
}