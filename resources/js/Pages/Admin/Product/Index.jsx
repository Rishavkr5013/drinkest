import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router, Link } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import PrimaryButton from "@/Components/PrimaryButton";

const Index = ({ auth, products = [] }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleToggleAvailability = (product) => {
        setProcessing(true);

        router.patch(
            `/admin/products/${product.id}/toggle-availability`,
            {},
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

    const handleDelete = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const submitDelete = () => {
        setProcessing(true);

        router.delete(`/admin/products/${selectedProduct.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedProduct(null);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(price);
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

    const getAvailabilityStatus = (product) => {
        if (product.is_available) {
            return {
                status: "Available",
                color: "bg-green-100 text-green-800",
            };
        }
        return { status: "Unavailable", color: "bg-red-100 text-red-800" };
    };

    const getCategoryColor = (category) => {
        const colors = {
            Beer: "bg-yellow-100 text-yellow-800",
            Wine: "bg-purple-100 text-purple-800",
            Spirits: "bg-blue-100 text-blue-800",
            Whiskey: "bg-amber-100 text-amber-800",
            Vodka: "bg-gray-100 text-gray-800",
            Rum: "bg-orange-100 text-orange-800",
            Gin: "bg-teal-100 text-teal-800",
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Products Management
                </h2>
            }
        >
            <Head title="Products Management" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Products Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Manage all products in the system.
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600">
                                    {products.length}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Total Products
                                </div>
                            </div>
                            <Link href="/admin/products/create">
                                <PrimaryButton>Add New Product</PrimaryButton>
                            </Link>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="mt-6">
                        {products && products.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Store
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-80">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => {
                                            const availabilityStatus =
                                                getAvailabilityStatus(product);

                                            return (
                                                <tr
                                                    key={product.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                                                                    <span className="text-sm font-medium text-white">
                                                                        {product.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            ?.toUpperCase() ||
                                                                            "P"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    ID:{" "}
                                                                    {product.id}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                                                                product.category
                                                            )}`}
                                                        >
                                                            {product.category}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                                        {formatPrice(
                                                            product.price
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        <div className="font-medium">
                                                            {product.store
                                                                ?.name ||
                                                                "No Store"}
                                                        </div>
                                                        {product.store && (
                                                            <div className="text-xs text-gray-500">
                                                                Store ID:{" "}
                                                                {
                                                                    product
                                                                        .store
                                                                        .id
                                                                }
                                                            </div>
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${availabilityStatus.color}`}
                                                        >
                                                            {
                                                                availabilityStatus.status
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-900 w-80">
                                                        <div className="max-w-xs break-words">
                                                            {product.description ? (
                                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                                    {product
                                                                        .description
                                                                        .length >
                                                                    100
                                                                        ? `${product.description.substring(
                                                                              0,
                                                                              100
                                                                          )}...`
                                                                        : product.description}
                                                                </p>
                                                            ) : (
                                                                <span className="text-gray-500 italic text-xs">
                                                                    No
                                                                    description
                                                                    provided
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(
                                                            product.created_at
                                                        )}
                                                    </td>

                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={`/admin/products/${product.id}`}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View
                                                            </Link>
                                                            <Link
                                                                href={`/admin/products/${product.id}/edit`}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    handleToggleAvailability(
                                                                        product
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                className={`${
                                                                    product.is_available
                                                                        ? "text-yellow-600 hover:text-yellow-900"
                                                                        : "text-green-600 hover:text-green-900"
                                                                } disabled:opacity-50`}
                                                            >
                                                                {product.is_available
                                                                    ? "Disable"
                                                                    : "Enable"}
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        product
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
                                <p className="text-gray-500 mb-4">
                                    No products found.
                                </p>
                                <Link href="/admin/products/create">
                                    <PrimaryButton>
                                        Add Your First Product
                                    </PrimaryButton>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Product Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Delete Product
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete "{selectedProduct?.name}
                        " (ID: {selectedProduct?.id})? This action cannot be
                        undone and will remove the product from all stores and
                        orders.
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
                            {processing ? "Deleting..." : "Delete Product"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default Index;
