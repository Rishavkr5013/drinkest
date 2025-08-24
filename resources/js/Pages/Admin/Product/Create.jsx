import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";

const Create = ({ auth, stores = [] }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        price: "",
        category: "",
        store_id: "",
        is_available: true,
    });

    const categories = [
        "Beer",
        "Wine",
        "Spirits",
        "Whiskey",
        "Vodka",
        "Rum",
        "Gin",
        "Brandy",
        "Tequila",
        "Cocktail",
        "Non-Alcoholic",
        "Other",
    ];

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.products.store"));
    };

    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create New Product
                </h2>
            }
        >
            <Head title="Create Product" />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Add New Product
                            </h1>
                            <p className="text-gray-600">
                                Create a new product for your store inventory.
                            </p>
                        </div>
                        <Link href={route("admin.products.index")}>
                            <SecondaryButton>Back to Products</SecondaryButton>
                        </Link>
                    </div>

                    <form onSubmit={submit} className="max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="md:col-span-2">
                                <InputLabel
                                    htmlFor="name"
                                    value="Product Name"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <InputLabel htmlFor="price" value="Price (₹)" />
                                <TextInput
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.price}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.price}
                                    className="mt-2"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <InputLabel
                                    htmlFor="category"
                                    value="Category"
                                />
                                <select
                                    id="category"
                                    name="category"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.category}
                                    className="mt-2"
                                />
                            </div>

                            {/* Store */}
                            <div>
                                <InputLabel htmlFor="store_id" value="Store" />
                                <select
                                    id="store_id"
                                    name="store_id"
                                    value={data.store_id}
                                    onChange={(e) =>
                                        setData("store_id", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Select Store</option>
                                    {stores.map((store) => (
                                        <option key={store.id} value={store.id}>
                                            {store.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.store_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Availability */}
                            <div>
                                <InputLabel
                                    htmlFor="is_available"
                                    value="Availability"
                                />
                                <div className="mt-1">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_available"
                                            name="is_available"
                                            checked={data.is_available}
                                            onChange={(e) =>
                                                setData(
                                                    "is_available",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Product is available for sale
                                        </span>
                                    </label>
                                </div>
                                <InputError
                                    message={errors.is_available}
                                    className="mt-2"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={4}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    placeholder="Enter product description..."
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-6 space-x-3">
                            <Link href={route("admin.products.index")}>
                                <SecondaryButton type="button">
                                    Cancel
                                </SecondaryButton>
                            </Link>
                            <PrimaryButton disabled={processing}>
                                {processing ? "Creating..." : "Create Product"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Create;
