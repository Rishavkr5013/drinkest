import { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminHeader from "@/Components/Admin/AdminHeader";
import AdminSidebar from "@/Components/Admin/AdminSidebar";

export default function AdminLayout({ children, header }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Admin Dashboard" />

            {/* Header */}
            <AdminHeader onMenuToggle={toggleSidebar} />

            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} />

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Content */}
            <main
                className={`pt-16 transition-all duration-300 ease-in-out ${
                    sidebarOpen ? "lg:ml-64" : "ml-0"
                }`}
            >
                <div className="min-h-[calc(100vh-4rem)]">
                    {/* Optional Header Section */}
                    {header && (
                        <div className="bg-white shadow border-b border-gray-200">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                {header}
                            </div>
                        </div>
                    )}

                    {/* Page Content */}
                    <div className="flex-1">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
