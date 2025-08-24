import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";

const Index = ({ auth, orders }) => {
    const handleStatusChange = (orderId, newStatus) => {
        router.patch(
            `/admin/orders/${orderId}/status`,
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Show success message
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
                    <p className="text-gray-600 mb-6">
                        Manage all orders in the system.
                    </p>

                    {/* Orders Table */}
                    <div className="mt-6">
                        {orders && orders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer Address
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Store
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order Items Details
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div>
                                                        <div className="font-medium">
                                                            {order.user?.name ||
                                                                "N/A"}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {order.user
                                                                ?.email ||
                                                                "N/A"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="max-w-xs">
                                                        {order.location ? (
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {
                                                                        order
                                                                            .location
                                                                            .address_line_1
                                                                    }
                                                                </div>
                                                                {order.location
                                                                    .address_line_2 && (
                                                                    <div className="text-gray-600">
                                                                        {
                                                                            order
                                                                                .location
                                                                                .address_line_2
                                                                        }
                                                                    </div>
                                                                )}
                                                                <div className="text-gray-600">
                                                                    {
                                                                        order
                                                                            .location
                                                                            .city
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        order
                                                                            .location
                                                                            .state
                                                                    }{" "}
                                                                    {
                                                                        order
                                                                            .location
                                                                            .postal_code
                                                                    }
                                                                </div>
                                                                {order.location
                                                                    .landmark && (
                                                                    <div className="text-xs text-gray-500 mt-1">
                                                                        Near:{" "}
                                                                        {
                                                                            order
                                                                                .location
                                                                                .landmark
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">
                                                                No address
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.store?.name || "N/A"}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    <div className="max-w-sm">
                                                        {order.items &&
                                                        order.items.length >
                                                            0 ? (
                                                            <div className="space-y-2">
                                                                {order.items.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="bg-gray-50 p-2 rounded border"
                                                                        >
                                                                            <div className="flex justify-between items-start">
                                                                                <div className="flex-1">
                                                                                    <div className="font-medium text-sm text-gray-900">
                                                                                        {item
                                                                                            .product
                                                                                            ?.name ||
                                                                                            "Unknown Product"}
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-600 mt-1">
                                                                                        Qty:{" "}
                                                                                        {
                                                                                            item.quantity
                                                                                        }{" "}
                                                                                        ×
                                                                                        $
                                                                                        {item.price
                                                                                            ? parseFloat(
                                                                                                  item.price
                                                                                              ).toFixed(
                                                                                                  2
                                                                                              )
                                                                                            : "0.00"}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <div className="text-sm font-semibold text-gray-900">
                                                                                        $
                                                                                        {item.price &&
                                                                                        item.quantity
                                                                                            ? (
                                                                                                  parseFloat(
                                                                                                      item.price
                                                                                                  ) *
                                                                                                  item.quantity
                                                                                              ).toFixed(
                                                                                                  2
                                                                                              )
                                                                                            : "0.00"}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {item
                                                                                .product
                                                                                ?.description && (
                                                                                <div className="text-xs text-gray-500 mt-1 truncate">
                                                                                    {
                                                                                        item
                                                                                            .product
                                                                                            .description
                                                                                    }
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                )}
                                                                <div className="pt-2 border-t border-gray-200">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-sm font-medium text-gray-700">
                                                                            Total
                                                                            Items:{" "}
                                                                            {order.items.reduce(
                                                                                (
                                                                                    sum,
                                                                                    item
                                                                                ) =>
                                                                                    sum +
                                                                                    item.quantity,
                                                                                0
                                                                            )}
                                                                        </span>
                                                                        <span className="text-sm font-semibold text-gray-900">
                                                                            $
                                                                            {order.items
                                                                                .reduce(
                                                                                    (
                                                                                        sum,
                                                                                        item
                                                                                    ) =>
                                                                                        sum +
                                                                                        parseFloat(
                                                                                            item.price ||
                                                                                                0
                                                                                        ) *
                                                                                            item.quantity,
                                                                                    0
                                                                                )
                                                                                .toFixed(
                                                                                    2
                                                                                )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-500">
                                                                No items
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    $
                                                    {order.total_amount
                                                        ? parseFloat(
                                                              order.total_amount
                                                          ).toFixed(2)
                                                        : "0.00"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
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
                                                        className={`text-xs font-semibold px-3 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                            order.status ===
                                                            "pending"
                                                                ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                                                                : order.status ===
                                                                  "processing"
                                                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                                                : order.status ===
                                                                  "delivered"
                                                                ? "bg-green-50 text-green-800 border-green-200"
                                                                : order.status ===
                                                                  "cancelled"
                                                                ? "bg-red-50 text-red-800 border-red-200"
                                                                : "bg-gray-50 text-gray-800 border-gray-200"
                                                        }`}
                                                    >
                                                        <option value="pending">
                                                            Pending
                                                        </option>
                                                        <option value="processing">
                                                            Processing
                                                        </option>
                                                        <option value="delivered">
                                                            Delivered
                                                        </option>
                                                        <option value="cancelled">
                                                            Cancelled
                                                        </option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.created_at
                                                        ? new Date(
                                                              order.created_at
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-8 rounded-lg text-center">
                                <p className="text-gray-500">
                                    No orders found.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Index;
