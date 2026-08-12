import { NavLink } from "react-router-dom";
import {
    BookOpen,
    ClipboardList,
    FileText,
    LayoutDashboard,
    Users
} from "lucide-react";

export default function Sidebar({
    role
}) {

    const tutorLinks = [
        {
            to: "/tutor/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            to: "/tutor/courses",
            label: "Courses",
            icon: BookOpen
        },
        {
            to: "/tutor/lessons",
            label: "Lessons",
            icon: FileText
        },
        {
            to: "/tutor/assignments",
            label: "Assignments",
            icon: ClipboardList
        },
       
    ];


    const studentLinks = [
        {
            to: "/student/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            to: "/student/courses",
            label: "Courses",
            icon: BookOpen
        },
        {
            to: "/student/assignments",
            label: "Assignments",
            icon: ClipboardList
        },
         {
            to: "/student/submissions",
            label: "My Submissions",
            icon: FileText
        },
    ];

    const adminLinks = [
    {
        to: "/admin/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard
    },
    {
        to: "/admin/users",
        label: "Users",
        icon: Users
    },
    {
        to: "/admin/courses",
        label: "Courses",
        icon: BookOpen
    }
];


    const links =
    role === "TUTOR"
        ? tutorLinks
        : role === "ADMIN"
            ? adminLinks
            : studentLinks;


    return (

        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:block">

            <div className="sticky top-16 p-4">

                <nav className="space-y-2">

                    {links.map(link => {

                        const Icon =
                            link.icon;

                        return (

                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`
                                }
                            >

                                <Icon size={19} />

                                {link.label}

                            </NavLink>

                        );
                    })}

                </nav>

            </div>

        </aside>
    );
}