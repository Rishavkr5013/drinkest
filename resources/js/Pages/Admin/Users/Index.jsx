import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

const Index = ({ auth, users = [] }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleStatusToggle = (user) => {
        const newStatus = user.email_verified_at ? "inactive" : "active";
        setProcessing(true);

        router.patch(
            `/admin/users/${user.id}/status`,
            { status: newStatus },
            {
                onSuccess: () => {
                    setProcessing(false);
                },
                onError: () => {
                    setProcessing(false);
                },
            }
        );
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const submitDelete = () => {
        setProcessing(true);

        router.delete(`/admin/users/${selectedUser.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedUser(null);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getUserStatus = (user) => {
        if (user.email_verified_at) {
            return { status: "Active", color: "bg-green-100 text-green-800" };
        }
        return { status: "Inactive", color: "bg-red-100 text-red-800" };
    };

    const getVerificationStatus = (user) => {
        const emailVerified = !!user.email_verified_at;
        const phoneVerified = !!user.phone_verified_at;

        if (emailVerified && phoneVerified) {
            return {
                text: "Fully Verified",
                color: "bg-green-100 text-green-800",
            };
        } else if (emailVerified || phoneVerified) {
            return {
                text: "Partially Verified",
                color: "bg-yellow-100 text-yellow-800",
            };
        }
        return { text: "Unverified", color: "bg-gray-100 text-gray-800" };
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Users Management
                </h2>
            }
        >
            <Head title="Users Management" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Users Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Manage all users in the system.
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">
                                {users.length}
                            </div>
                            <div className="text-sm text-gray-500">
                                Total Users
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="mt-6">
                        {users && users.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact Info
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Verification
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Activity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-96 min-w-96">
                                                Saved Locations
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => {
                                            const userStatus =
                                                getUserStatus(user);
                                            const verificationStatus =
                                                getVerificationStatus(user);

                                            return (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {user.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            ?.toUpperCase() ||
                                                                            "U"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name ||
                                                                        "N/A"}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID:{" "}
                                                                    {user.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {user.email && (
                                                                <div className="flex items-center">
                                                                    <svg
                                                                        className="w-4 h-4 mr-1 text-gray-400"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                                    </svg>
                                                                    {user.email}
                                                                </div>
                                                            )}
                                                            {user.phone && (
                                                                <div className="flex items-center mt-1">
                                                                    <svg
                                                                        className="w-4 h-4 mr-1 text-gray-400"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                                    </svg>
                                                                    {user.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userStatus.color}`}
                                                        >
                                                            {userStatus.status}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${verificationStatus.color}`}
                                                        >
                                                            {
                                                                verificationStatus.text
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div>
                                                            <div className="text-sm text-gray-900">
                                                                {user.orders_count ||
                                                                    0}{" "}
                                                                orders
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {user.locations_count ||
                                                                    0}{" "}
                                                                locations
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-900 w-96 min-w-96">
                                                        <div className="w-full break-words">
                                                            {user.locations &&
                                                            user.locations
                                                                .length > 0 ? (
                                                                <div className="space-y-2">
                                                                    {user.locations
                                                                        .slice(
                                                                            0,
                                                                            2
                                                                        )
                                                                        .map(
                                                                            (
                                                                                location,
                                                                                index
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="p-2 bg-gray-50 rounded border"
                                                                                >
                                                                                    <div className="flex justify-between items-start">
                                                                                        <div className="flex-1">
                                                                                            {location.address_type && (
                                                                                                <div className="text-xs font-semibold text-blue-600 mb-1">
                                                                                                    {
                                                                                                        location.address_type
                                                                                                    }
                                                                                                </div>
                                                                                            )}
                                                                                            <div className="font-medium text-gray-900 text-xs break-words leading-relaxed">
                                                                                                {location.house_name_or_number &&
                                                                                                location.road_name
                                                                                                    ? `${location.house_name_or_number}, ${location.road_name}`
                                                                                                    : location.house_name_or_number ||
                                                                                                      location.road_name ||
                                                                                                      location.address}
                                                                                            </div>
                                                                                            {location.landmark && (
                                                                                                <div className="text-xs text-gray-500 mt-1">
                                                                                                    Near:{" "}
                                                                                                    {
                                                                                                        location.landmark
                                                                                                    }
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-200">
                                                                                        Added:{" "}
                                                                                        {formatDate(
                                                                                            location.created_at
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    {user
                                                                        .locations
                                                                        .length >
                                                                        2 && (
                                                                        <div className="text-xs text-gray-500 text-center p-2 bg-gray-100 rounded">
                                                                            +
                                                                            {user
                                                                                .locations
                                                                                .length -
                                                                                2}{" "}
                                                                            more
                                                                            locations
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-500 text-xs">
                                                                    No saved
                                                                    locations
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={`/admin/users/${user.id}`}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusToggle(
                                                                        user
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className={`${
                                                                    user.email_verified_at
                                                                        ? "text-yellow-600 hover:text-yellow-900"
                                                                        : "text-green-600 hover:text-green-900"
                                                                } disabled:opacity-50`}
                                                            >
                                                                {user.email_verified_at
                                                                    ? "Deactivate"
                                                                    : "Activate"}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-8 rounded-lg text-center">
                                <p className="text-gray-500">No users found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete User Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Delete User
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete "{selectedUser?.name}"
                        (ID: {selectedUser?.id})? This action cannot be undone
                        and will remove all associated data including orders and
                        locations.
                    </p>

                    <div className="flex items-center justify-end space-x-3">
                        <SecondaryButton
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton
                            onClick={submitDelete}
                            disabled={processing}
                        >
                            {processing ? "Deleting..." : "Delete User"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default Index;
