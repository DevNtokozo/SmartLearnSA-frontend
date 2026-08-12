import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
    allowedRoles = []
}) {

    const storedUser =
        localStorage.getItem(
            "smartlearn-user"
        );


    if (!storedUser) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    let user;

    try {

        user =
            JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "Invalid stored user:",
            error
        );

        localStorage.removeItem(
            "smartlearn-user"
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    const role =
        user?.role;


    if (!role) {

        localStorage.removeItem(
            "smartlearn-user"
        );

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(role)
    ) {

        if (role === "TUTOR") {

            return (
                <Navigate
                    to="/tutor/dashboard"
                    replace
                />
            );
        }


        if (role === "STUDENT") {

            return (
                <Navigate
                    to="/student/dashboard"
                    replace
                />
            );
        }


        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return <Outlet />;
}