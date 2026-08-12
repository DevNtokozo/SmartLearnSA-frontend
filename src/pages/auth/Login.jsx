import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    BookOpen,
    Eye,
    EyeOff,
    Lock,
    Mail
} from "lucide-react";

import { login } from "../../api/authApi";


export default function Login() {

    const navigate = useNavigate();


    // =========================================================
    // FORM STATE
    // =========================================================

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);


    // =========================================================
    // HANDLE INPUT CHANGE
    // =========================================================

    /**
     * @param {import("react").ChangeEvent<HTMLInputElement>} event
     */
    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };


    // =========================================================
    // LOGIN
    // =========================================================

    /**
     * @param {import("react").FormEvent<HTMLFormElement>} event
     */
    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (!form.email.trim()) {

            setError(
                "Email address is required."
            );

            return;
        }


        if (!form.password) {

            setError(
                "Password is required."
            );

            return;
        }


        try {

            setLoading(true);


            // -------------------------------------------------
            // LOGIN
            // -------------------------------------------------

            const response = await login({
                email: form.email.trim(),
                password: form.password
            });


            // -------------------------------------------------
            // GET USER
            // -------------------------------------------------

            const user = response;


            if (!user) {

                throw new Error(
                    "Invalid login response."
                );
            }


            // -------------------------------------------------
            // STORE USER
            // -------------------------------------------------

            localStorage.setItem(
                "smartlearn-user",
                JSON.stringify(user)
            );


            // -------------------------------------------------
            // ROLE
            // -------------------------------------------------

            const role = user.role;


            // -------------------------------------------------
            // REDIRECT
            // -------------------------------------------------

            if (role === "TUTOR") {

                navigate(
                    "/tutor/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }


            if (role === "STUDENT") {

                navigate(
                    "/student/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }


            if (role === "ADMIN") {

                navigate(
                    "/admin/dashboard",
                    {
                        replace: true
                    }
                );

                return;
            }


            navigate(
                "/",
                {
                    replace: true
                }
            );

        } catch (caughtError) {

            console.error(
                "Login failed:",
                caughtError
            );


            // Axios error handling for JS/JSX
            const axiosError =
                /** @type {{
                    response?: {
                        data?: {
                            message?: string,
                            error?: string
                        }
                    },
                    message?: string
                }} */
                (caughtError);


            setError(
                axiosError.response?.data?.message ||
                axiosError.response?.data?.error ||
                axiosError.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-slate-100 px-4 py-12">

            <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center justify-center">

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
                    className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-xl sm:p-10"
                >

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <div className="text-center">

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.8
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1
                            }}
                            transition={{
                                duration: 0.4,
                                delay: 0.1
                            }}
                            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg"
                        >

                            <BookOpen size={30} />

                        </motion.div>


                        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                            Welcome Back
                        </h1>


                        <p className="mt-2 text-gray-500">
                            Sign in to your SmartLearnSA account.
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
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                    >

                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Email Address
                            </label>


                            <div className="relative">

                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />


                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            PASSWORD
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold text-gray-700"
                            >
                                Password
                            </label>


                            <div className="relative">

                                <Lock
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />


                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-11 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            previous =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                                >

                                    {showPassword ? (

                                        <EyeOff
                                            size={19}
                                        />

                                    ) : (

                                        <Eye
                                            size={19}
                                        />

                                    )}

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            SUBMIT
                        ================================================= */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign In"}

                        </button>

                    </form>

                    <div className="mt-6 text-center">

                    <p className="text-sm text-gray-500">

                     Don't have an account?

                     {" "}

                     <Link
                      to="/register"
                      className="font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        Create one
                      </Link>

                      </p>

                       </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="mt-8 text-center">

                        <p className="text-sm text-gray-500">
                            SmartLearnSA
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Learn • Grow • Succeed
                        </p>

                    </div>

                </motion.div>

            </div>

        </div>
    );
}