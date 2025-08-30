import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        phone: "",
        email: "",
        vehicle_type: "",
        license_number: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.delivery-partners.store"));
    };

    return (
        <AdminLayout>
            <Head title="Add Delivery Partner" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    Add New Delivery Partner
                                </h2>
                                <Link
                                    href={route(
                                        "admin.delivery-partners.index"
                                    )}
                                >
                                    <SecondaryButton>
                                        Back to List
                                    </SecondaryButton>
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="name"
                                            value="Name *"
                                        />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                            placeholder="Enter partner name"
                                        />
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="phone"
                                            value="Phone Number *"
                                        />
                                        <TextInput
                                            id="phone"
                                            type="tel"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                            required
                                            placeholder="+91 98765 43210"
                                        />
                                        <InputError
                                            message={errors.phone}
                                            className="mt-2"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            This will be used for login
                                            authentication
                                        </p>
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="email"
                                            value="Email (Optional)"
                                        />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="partner@example.com"
                                        />
                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="vehicle_type"
                                            value="Vehicle Type"
                                        />
                                        <select
                                            id="vehicle_type"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.vehicle_type}
                                            onChange={(e) =>
                                                setData(
                                                    "vehicle_type",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select Vehicle Type
                                            </option>
                                            <option value="bike">Bike</option>
                                            <option value="scooter">
                                                Scooter
                                            </option>
                                            <option value="car">Car</option>
                                            <option value="bicycle">
                                                Bicycle
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                        <InputError
                                            message={errors.vehicle_type}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel
                                            htmlFor="license_number"
                                            value="License Number"
                                        />
                                        <TextInput
                                            id="license_number"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.license_number}
                                            onChange={(e) =>
                                                setData(
                                                    "license_number",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter license number"
                                        />
                                        <InputError
                                            message={errors.license_number}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <PrimaryButton disabled={processing}>
                                        {processing
                                            ? "Creating..."
                                            : "Create Delivery Partner"}
                                    </PrimaryButton>
                                    <Link
                                        href={route(
                                            "admin.delivery-partners.index"
                                        )}
                                    >
                                        <SecondaryButton type="button">
                                            Cancel
                                        </SecondaryButton>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
