import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import axios from "axios";

export default function Dashboard({ auth, assignedOrders, stats }) {
    const { post } = useForm();
    const [loadingStatus, setLoadingStatus] = useState({});

    const handleLogout = async () => {
        try {
            await axios.post("/delivery-partner/logout");
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const toggleOnlineStatus = async () => {
        try {
            const response = await axios.post(
                "/delivery-partner/toggle-online"
            );
            if (response.data.success) {
                // Refresh the page to update the status
                window.location.reload();
            }
        } catch (error) {
            console.error("Error toggling online status:", error);
            alert("Failed to update online status");
        }
    };

    const updateOrderStatus = async (assignmentId, status, notes = "") => {
        setLoadingStatus((prev) => ({ ...prev, [assignmentId]: true }));

        try {
            const response = await axios.post(
                "/delivery-partner/update-order-status",
                {
                    assignment_id: assignmentId,
                    status: status,
                    notes: notes,
                }
            );

            if (response.data.success) {
                // Refresh the page to update the orders
                window.location.reload();
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update order status");
        } finally {
            setLoadingStatus((prev) => ({ ...prev, [assignmentId]: false }));
        }
    };

    return (
        <>
            <Head title="Delivery Partner Dashboard" />

            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Delivery Partner Dashboard
                                </h1>
                                <p className="text-gray-600">
                                    Welcome, {auth.deliveryPartner.name}!
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleOnlineStatus}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        auth.deliveryPartner.is_online
                                            ? "bg-green-100 text-green-800 border border-green-300"
                                            : "bg-red-100 text-red-800 border border-red-300"
                                    }`}
                                >
                                    {auth.deliveryPartner.is_online
                                        ? "🟢 Online"
                                        : "🔴 Offline"}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Stats Cards */}
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="text-2xl">📦</div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Deliveries
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {stats?.completedOrders ||
                                                        0}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="text-2xl">🚚</div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Active Orders
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {stats?.activeOrders || 0}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="text-2xl">⭐</div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Rating
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {
                                                        auth.deliveryPartner
                                                            .rating
                                                    }
                                                    /5.0
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="text-2xl">🚛</div>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Vehicle
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {auth.deliveryPartner
                                                        .vehicle_type ||
                                                        "Not specified"}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Orders Section */}
                        <div className="mt-8">
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Your Assigned Orders
                                    </h3>
                                    {assignedOrders &&
                                    assignedOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {assignedOrders.map(
                                                (assignment) => (
                                                    <div
                                                        key={assignment.id}
                                                        className="border border-gray-200 rounded-lg p-4"
                                                    >
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <h4 className="text-lg font-semibold text-gray-900">
                                                                    Order #
                                                                    {
                                                                        assignment
                                                                            .order
                                                                            .id
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-gray-600">
                                                                    Store:{" "}
                                                                    {assignment
                                                                        .order
                                                                        .store
                                                                        ?.name ||
                                                                        "N/A"}
                                                                </p>
                                                            </div>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                    assignment.status ===
                                                                    "assigned"
                                                                        ? "bg-blue-100 text-blue-800"
                                                                        : assignment.status ===
                                                                          "picked_up"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-green-100 text-green-800"
                                                                }`}
                                                            >
                                                                {assignment.status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    assignment.status
                                                                        .slice(
                                                                            1
                                                                        )
                                                                        .replace(
                                                                            "_",
                                                                            " "
                                                                        )}
                                                            </span>
                                                        </div>

                                                        {/* Customer Details */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                            <div>
                                                                <h5 className="font-medium text-gray-900">
                                                                    Customer
                                                                </h5>
                                                                <p className="text-sm text-gray-600">
                                                                    {assignment
                                                                        .order
                                                                        .user
                                                                        ?.name ||
                                                                        "N/A"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h5 className="font-medium text-gray-900">
                                                                    Delivery
                                                                    Address
                                                                </h5>
                                                                {assignment
                                                                    .order
                                                                    .location ? (
                                                                    <div className="text-sm text-gray-600">
                                                                        {assignment
                                                                            .order
                                                                            .location
                                                                            .house_name_or_number && (
                                                                            <p>
                                                                                {
                                                                                    assignment
                                                                                        .order
                                                                                        .location
                                                                                        .house_name_or_number
                                                                                }
                                                                                ,{" "}
                                                                                {
                                                                                    assignment
                                                                                        .order
                                                                                        .location
                                                                                        .road_name
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        {assignment
                                                                            .order
                                                                            .location
                                                                            .address && (
                                                                            <p>
                                                                                {
                                                                                    assignment
                                                                                        .order
                                                                                        .location
                                                                                        .address
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        {assignment
                                                                            .order
                                                                            .location
                                                                            .landmark && (
                                                                            <p className="text-xs text-gray-500">
                                                                                Near:{" "}
                                                                                {
                                                                                    assignment
                                                                                        .order
                                                                                        .location
                                                                                        .landmark
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        {assignment
                                                                            .order
                                                                            .location
                                                                            .address_type && (
                                                                            <p className="text-xs text-blue-600 font-medium">
                                                                                {
                                                                                    assignment
                                                                                        .order
                                                                                        .location
                                                                                        .address_type
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-gray-500">
                                                                        No
                                                                        address
                                                                        available
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Order Total */}
                                                        <div className="mb-4">
                                                            <div className="bg-gray-50 rounded p-3">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        Order
                                                                        Total
                                                                    </span>
                                                                    <span className="text-lg font-bold text-gray-900">
                                                                        $
                                                                        {parseFloat(
                                                                            assignment
                                                                                .order
                                                                                .total_amount ||
                                                                                0
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex space-x-3">
                                                            {assignment.status ===
                                                                "assigned" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateOrderStatus(
                                                                            assignment.id,
                                                                            "picked_up"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        loadingStatus[
                                                                            assignment
                                                                                .id
                                                                        ]
                                                                    }
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                                                >
                                                                    {loadingStatus[
                                                                        assignment
                                                                            .id
                                                                    ]
                                                                        ? "Updating..."
                                                                        : "Mark as Picked Up"}
                                                                </button>
                                                            )}
                                                            {assignment.status ===
                                                                "picked_up" && (
                                                                <button
                                                                    onClick={() =>
                                                                        updateOrderStatus(
                                                                            assignment.id,
                                                                            "delivered"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        loadingStatus[
                                                                            assignment
                                                                                .id
                                                                        ]
                                                                    }
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                                                >
                                                                    {loadingStatus[
                                                                        assignment
                                                                            .id
                                                                    ]
                                                                        ? "Updating..."
                                                                        : "Mark as Delivered"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="text-4xl mb-4">
                                                📭
                                            </div>
                                            <p className="text-gray-500">
                                                No orders assigned at the
                                                moment.
                                            </p>
                                            <p className="text-sm text-gray-400 mt-2">
                                                Make sure you're online to
                                                receive order assignments.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
