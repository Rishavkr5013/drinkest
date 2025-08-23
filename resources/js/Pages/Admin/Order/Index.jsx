import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

const Index = ({ auth }) => {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Orders Management
                </h2>
            }
        >
            <Head title="Orders Management" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <h1 className="text-2xl font-bold mb-4">
                        Orders Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage all orders in the system.
                    </p>

                    {/* Add your orders table/content here */}
                    <div className="mt-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">
                                Orders management interface coming soon...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
