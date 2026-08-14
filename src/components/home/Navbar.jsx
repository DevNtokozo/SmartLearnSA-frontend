import { Link, useNavigate } from "react-router-dom";
import {
    LogOut,
    UserCircle
} from "lucide-react";

import {
    logout
} from "../../api/authApi";

import logo from "../../assets/logo.png";

export default function Navbar() {

    const navigate =
        useNavigate();

    const user =
        JSON.parse(
            localStorage.getItem(
                "smartlearn-user"
            ) || "null"
        );


    const handleLogout = async () => {

        try {

            await logout();

        } catch (error) {

            console.error(error);

        } finally {

            localStorage.removeItem(
                "smartlearn-user"
            );

            navigate(
                "/login",
                {
                    replace: true
                }
            );
        }
    };


    return (

        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* =================================================
                    LOGO
                ================================================= */}

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                    <img
                        src={logo}
                        alt="SmartLearnSA"
                        className="h-18 w-18 rounded-xl object-contain"
                    />


                    <div className="hidden sm:block">

                        <span className="text-xl font-bold text-gray-900">
                            SmartLearnSA
                        </span>

                        <p className="text-[10px] font-medium tracking-wide text-gray-400">
                            LEARN • GROW • SUCCEED
                        </p>

                    </div>

                </Link>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="flex items-center gap-3 sm:gap-4">

                    {user && (

                        <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex">

                            <UserCircle
                                size={20}
                            />

                            <span>

                                {user.firstName}
                                {" "}
                                {user.lastName}

                            </span>

                        </div>

                    )}


                    {user ? (

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        >

                            <LogOut
                                size={17}
                            />

                            <span>
                                Logout
                            </span>

                        </button>

                    ) : (

                        <div className="flex items-center gap-2">

                            <Link
                                to="/login"
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Register
                            </Link>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
}