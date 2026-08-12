import { Link, useNavigate } from "react-router-dom";
import {
    BookOpen,
    LogOut,
    UserCircle
} from "lucide-react";

import {
    logout
} from "../../api/authApi";

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
                { replace: true }
            );
        }
    };


    return (

        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">

            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                <Link
                    to="/"
                    className="flex items-center gap-2"
                >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">

                        <BookOpen
                            size={21}
                        />

                    </div>

                    <span className="text-xl font-bold text-gray-900">
                        SmartLearn
                    </span>

                </Link>


                <div className="flex items-center gap-4">

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

                            Logout

                        </button>

                    ) : (

                        <Link
                            to="/login"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            Login
                        </Link>

                    )}

                </div>

            </div>

        </header>
    );
}