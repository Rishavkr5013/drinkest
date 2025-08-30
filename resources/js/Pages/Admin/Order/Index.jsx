import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";

const Index = ({ auth, orders, availablePartners }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
    } = useForm({
        delivery_partner_id: "",
    });

    const handleStatusChange = (orderId, newStatus) => {
        router.patch(
            `/admin/orders/${orderId}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log(
                        `Order ${orderId} status updated to ${newStatus}`
                    );
                },
                onError: (errors) => {
                    console.error("Error updating order status:", errors);
                },
            }
        );
    };

    const handleAssignDeliveryPartner = (orderId) => {
        if (!data.delivery_partner_id) {
            alert("Please select a delivery partner");
            return;
        }

        post(route("admin.orders.assign", orderId), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedOrder(null);
                setData("delivery_partner_id", "");
            },
            onError: (errors) => {
                console.error("Error assigning delivery partner:", errors);
            },
        });
    };

    const handleUnassignDeliveryPartner = (orderId) => {
        if (
            confirm(
                "Are you sure you want to unassign the delivery partner from this order?"
            )
        ) {
            destroy(route("admin.orders.unassign", orderId), {
                preserveScroll: true,
                onSuccess: () => {
                    console.log("Delivery partner unassigned successfully");
                },
                onError: (errors) => {
                    console.error(
                        "Error unassigning delivery partner:",
                        errors
                    );
                },
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "assigned":
                return "bg-purple-100 text-purple-800";
            case "dispatched":
                return "bg-indigo-100 text-indigo-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

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
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Orders Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Manage all orders and assign delivery partners.
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            Available Partners: {availablePartners.length}
                        </div>
                    </div>

                    {orders && orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Details
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer & Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Delivery Partner
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <div className="font-semibold text-gray-900">
                                                        Order #{order.id}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Store:{" "}
                                                        {order.store?.name ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Total: $
                                                        {order.total_amount
                                                            ? parseFloat(
                                                                  order.total_amount
                                                              ).toFixed(2)
                                                            : "0.00"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {order.created_at
                                                            ? new Date(
                                                                  order.created_at
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="font-medium text-gray-900">
                                                        {order.user?.name ||
                                                            "N/A"}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {order.user?.email ||
                                                            "N/A"}
                                                    </div>
                                                    {order.location && (
                                                        <div className="text-sm text-gray-600">
                                                            <div>
                                                                {order.location
                                                                    .house_name_or_number && (
                                                                    <span>
                                                                        {
                                                                            order
                                                                                .location
                                                                                .house_name_or_number
                                                                        }
                                                                        ,{" "}
                                                                    </span>
                                                                )}
                                                                {order.location
                                                                    .road_name && (
                                                                    <span>
                                                                        {
                                                                            order
                                                                                .location
                                                                                .road_name
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {order.location
                                                                .address && (
                                                                <div>
                                                                    {
                                                                        order
                                                                            .location
                                                                            .address
                                                                    }
                                                                </div>
                                                            )}
                                                            {order.location
                                                                .landmark && (
                                                                <div className="text-xs text-gray-500">
                                                                    Near:{" "}
                                                                    {
                                                                        order
                                                                            .location
                                                                            .landmark
                                                                    }
                                                                </div>
                                                            )}
                                                            {order.location
                                                                .address_type && (
                                                                <div className="text-xs text-blue-600 font-medium">
                                                                    {
                                                                        order
                                                                            .location
                                                                            .address_type
                                                                    }
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={
                                                        order.status ||
                                                        "pending"
                                                    }
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            order.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`text-xs font-semibold px-3 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                                                        order.status
                                                    )}`}
                                                >
                                                    <option value="pending">
                                                        Pending
                                                    </option>
                                                    <option value="confirmed">
                                                        Confirmed
                                                    </option>
                                                    <option value="assigned">
                                                        Assigned
                                                    </option>
                                                    <option value="dispatched">
                                                        Dispatched
                                                    </option>
                                                    <option value="delivered">
                                                        Delivered
                                                    </option>
                                                    <option value="cancelled">
                                                        Cancelled
                                                    </option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.assignment ? (
                                                    <div className="space-y-1">
                                                        <div className="font-medium text-gray-900">
                                                            {order.assignment
                                                                .delivery_partner
                                                                ?.name || "N/A"}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {order.assignment
                                                                .delivery_partner
                                                                ?.phone ||
                                                                "N/A"}
                                                        </div>
                                                        <div
                                                            className={`text-xs px-2 py-1 rounded ${getStatusColor(
                                                                order.assignment
                                                                    .status
                                                            )}`}
                                                        >
                                                            {order.assignment.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                order.assignment.status.slice(
                                                                    1
                                                                )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">
                                                        Not assigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {!order.assignment ? (
                                                        <div className="space-y-2">
                                                            {selectedOrder ===
                                                            order.id ? (
                                                                <div className="space-y-2">
                                                                    <select
                                                                        value={
                                                                            data.delivery_partner_id
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setData(
                                                                                "delivery_partner_id",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                                    >
                                                                        <option value="">
                                                                            Select
                                                                            Partner
                                                                        </option>
                                                                        {availablePartners.map(
                                                                            (
                                                                                partner
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        partner.id
                                                                                    }
                                                                                    value={
                                                                                        partner.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        partner.name
                                                                                    }{" "}
                                                                                    (
                                                                                    {partner.vehicle_type ||
                                                                                        "No vehicle"}

                                                                                    )
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                    <div className="flex space-x-2">
                                                                        <PrimaryButton
                                                                            onClick={() =>
                                                                                handleAssignDeliveryPartner(
                                                                                    order.id
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                processing
                                                                            }
                                                                            className="text-xs py-1 px-2"
                                                                        >
                                                                            Assign
                                                                        </PrimaryButton>
                                                                        <SecondaryButton
                                                                            onClick={() => {
                                                                                setSelectedOrder(
                                                                                    null
                                                                                );
                                                                                setData(
                                                                                    "delivery_partner_id",
                                                                                    ""
                                                                                );
                                                                            }}
                                                                            className="text-xs py-1 px-2"
                                                                        >
                                                                            Cancel
                                                                        </SecondaryButton>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <PrimaryButton
                                                                    onClick={() =>
                                                                        setSelectedOrder(
                                                                            order.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        availablePartners.length ===
                                                                        0
                                                                    }
                                                                    className="text-xs py-1 px-2"
                                                                >
                                                                    {availablePartners.length ===
                                                                    0
                                                                        ? "No Partners Available"
                                                                        : "Assign Partner"}
                                                                </PrimaryButton>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <DangerButton
                                                            onClick={() =>
                                                                handleUnassignDeliveryPartner(
                                                                    order.id
                                                                )
                                                            }
                                                            className="text-xs py-1 px-2"
                                                        >
                                                            Unassign
                                                        </DangerButton>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                            <p className="text-gray-500">No orders found.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
