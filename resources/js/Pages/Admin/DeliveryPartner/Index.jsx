import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Index({ deliveryPartners }) {
    const { delete: destroy, post } = useForm();

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this delivery partner?")) {
            destroy(route("admin.delivery-partners.destroy", id));
        }
    };

    const toggleOnlineStatus = (id) => {
        post(route("admin.delivery-partners.toggle-online", id));
    };

    return (
        <AdminLayout>
            <Head title="Delivery Partners" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    Delivery Partners
                                </h2>
                                <Link
                                    href={route(
                                        "admin.delivery-partners.create"
                                    )}
                                >
                                    <PrimaryButton>
                                        Add New Partner
                                    </PrimaryButton>
                                </Link>
                            </div>

                            {deliveryPartners.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        No delivery partners found.
                                    </p>
                                    <Link
                                        href={route(
                                            "admin.delivery-partners.create"
                                        )}
                                        className="mt-4 inline-block"
                                    >
                                        <PrimaryButton>
                                            Create First Partner
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Phone
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Vehicle Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rating
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {deliveryPartners.map((partner) => (
                                                <tr key={partner.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {partner.name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {partner.phone}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {partner.email ||
                                                                "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {partner.vehicle_type ||
                                                                "N/A"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() =>
                                                                toggleOnlineStatus(
                                                                    partner.id
                                                                )
                                                            }
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                partner.is_online
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {partner.is_online
                                                                ? "Online"
                                                                : "Offline"}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            ⭐ {partner.rating}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <Link
                                                            href={route(
                                                                "admin.delivery-partners.show",
                                                                partner.id
                                                            )}
                                                        >
                                                            <SecondaryButton>
                                                                View
                                                            </SecondaryButton>
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin.delivery-partners.edit",
                                                                partner.id
                                                            )}
                                                        >
                                                            <SecondaryButton>
                                                                Edit
                                                            </SecondaryButton>
                                                        </Link>
                                                        <DangerButton
                                                            onClick={() =>
                                                                handleDelete(
                                                                    partner.id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </DangerButton>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
