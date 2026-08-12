import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout({
    children,
    role
}) {

    return (

        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <div className="flex">

                <Sidebar
                    role={role}
                />

                <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">

                    <div className="mx-auto max-w-7xl">

                        {children}

                    </div>

                </main>

            </div>

        </div>
    );
}