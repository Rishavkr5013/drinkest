import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

const Index = ({ auth }) => {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Stats Cards */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold text-blue-600">
                                150
                            </div>
                            <div className="ml-2 text-sm text-gray-600">
                                Total Users
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold text-green-600">
                                25
                            </div>
                            <div className="ml-2 text-sm text-gray-600">
                                Active Stores
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold text-yellow-600">
                                89
                            </div>
                            <div className="ml-2 text-sm text-gray-600">
                                Pending Orders
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="text-2xl font-bold text-purple-600">
                                $12,450
                            </div>
                            <div className="ml-2 text-sm text-gray-600">
                                Revenue
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <h1 className="text-2xl font-bold mb-4">
                        Welcome to Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Manage your RapidNative platform from this central
                        dashboard.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">
                                Recent Activity
                            </h3>
                            <p className="text-sm text-gray-500">
                                No recent activity to display.
                            </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <button className="text-blue-600 hover:text-blue-800 text-sm block">
                                    Add New Store
                                </button>
                                <button className="text-blue-600 hover:text-blue-800 text-sm block">
                                    View All Orders
                                </button>
                                <button className="text-blue-600 hover:text-blue-800 text-sm block">
                                    Manage Users
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
