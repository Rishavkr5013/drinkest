import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

const Index = ({ auth, stores = [] }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        delivery_radius: "5000",
    });

    const resetForm = () => {
        setFormData({
            name: "",
            address: "",
            delivery_radius: "5000",
        });
        setErrors({});
    };

    const handleCreate = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const handleEdit = (store) => {
        setSelectedStore(store);
        setFormData({
            name: store.name,
            address: store.address,
            delivery_radius: store.delivery_radius || "5000",
        });
        setErrors({});
        setShowEditModal(true);
    };

    const handleDelete = (store) => {
        setSelectedStore(store);
        setShowDeleteModal(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post("/admin/stores", formData, {
            onSuccess: () => {
                setShowCreateModal(false);
                resetForm();
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.patch(`/admin/stores/${selectedStore.id}`, formData, {
            onSuccess: () => {
                setShowEditModal(false);
                resetForm();
                setSelectedStore(null);
                setProcessing(false);
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const submitDelete = () => {
        setProcessing(true);

        router.delete(`/admin/stores/${selectedStore.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedStore(null);
                setProcessing(false);
            },
            onError: () => {
                setProcessing(false);
            },
        });
    };

    const formatRadius = (radius) => {
        if (radius >= 1000) {
            return `${(radius / 1000).toFixed(1)} km`;
        }
        return `${radius} m`;
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Stores Management
                </h2>
            }
        >
            <Head title="Stores Management" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 text-gray-900">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Stores Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Manage all stores in the system.
                            </p>
                        </div>
                        <PrimaryButton onClick={handleCreate}>
                            Add New Store
                        </PrimaryButton>
                    </div>

                    {/* Stores Table */}
                    <div className="mt-6">
                        {stores && stores.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Store Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Address
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Delivery Radius
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
                                        {stores.map((store) => (
                                            <tr
                                                key={store.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">
                                                        {store.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900 max-w-xs">
                                                        {store.address || "N/A"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {store.latitude &&
                                                    store.longitude ? (
                                                        <div>
                                                            <div className="text-xs text-gray-600">
                                                                Lat:{" "}
                                                                {parseFloat(
                                                                    store.latitude
                                                                ).toFixed(6)}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Lng:{" "}
                                                                {parseFloat(
                                                                    store.longitude
                                                                ).toFixed(6)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            No coordinates
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {formatRadius(
                                                            store.delivery_radius
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {store.created_at
                                                        ? new Date(
                                                              store.created_at
                                                          ).toLocaleDateString()
                                                        : "N/A"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    store
                                                                )
                                                            }
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    store
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-8 rounded-lg text-center">
                                <p className="text-gray-500 mb-4">
                                    No stores found.
                                </p>
                                <PrimaryButton onClick={handleCreate}>
                                    Add Your First Store
                                </PrimaryButton>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Store Modal */}
            <Modal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Add New Store
                    </h2>

                    <form onSubmit={submitCreate} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Store Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={formData.name}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Enter store name"
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="address" value="Address" />
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        address: e.target.value,
                                    }))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={3}
                                placeholder="Enter complete store address"
                                required
                            />
                            <InputError
                                message={errors.address}
                                className="mt-2"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                💡 Coordinates will be automatically detected
                                from the address
                            </p>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="delivery_radius"
                                value="Delivery Radius (meters)"
                            />
                            <select
                                id="delivery_radius"
                                name="delivery_radius"
                                value={formData.delivery_radius}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        delivery_radius: e.target.value,
                                    }))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="1000">1 km</option>
                                <option value="2000">2 km</option>
                                <option value="3000">3 km</option>
                                <option value="5000">5 km</option>
                                <option value="10000">10 km</option>
                                <option value="15000">15 km</option>
                                <option value="20000">20 km</option>
                            </select>
                            <InputError
                                message={errors.delivery_radius}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <SecondaryButton
                                onClick={() => setShowCreateModal(false)}
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? "Creating..." : "Create Store"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Edit Store Modal */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Edit Store
                    </h2>

                    <form onSubmit={submitEdit} className="space-y-4">
                        <div>
                            <InputLabel
                                htmlFor="edit_name"
                                value="Store Name"
                            />
                            <TextInput
                                id="edit_name"
                                name="name"
                                value={formData.name}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }))
                                }
                                placeholder="Enter store name"
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="edit_address"
                                value="Address"
                            />
                            <textarea
                                id="edit_address"
                                name="address"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        address: e.target.value,
                                    }))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows={3}
                                placeholder="Enter complete store address"
                                required
                            />
                            <InputError
                                message={errors.address}
                                className="mt-2"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                💡 Coordinates will be automatically updated if
                                address changes
                            </p>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="edit_delivery_radius"
                                value="Delivery Radius (meters)"
                            />
                            <select
                                id="edit_delivery_radius"
                                name="delivery_radius"
                                value={formData.delivery_radius}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        delivery_radius: e.target.value,
                                    }))
                                }
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="1000">1 km</option>
                                <option value="2000">2 km</option>
                                <option value="3000">3 km</option>
                                <option value="5000">5 km</option>
                                <option value="10000">10 km</option>
                                <option value="15000">15 km</option>
                                <option value="20000">20 km</option>
                            </select>
                            <InputError
                                message={errors.delivery_radius}
                                className="mt-2"
                            />
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <SecondaryButton
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? "Updating..." : "Update Store"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Store Modal */}
            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            >
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Delete Store
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete "{selectedStore?.name}"?
                        This action cannot be undone.
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
                            {processing ? "Deleting..." : "Delete Store"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
};

export default Index;
