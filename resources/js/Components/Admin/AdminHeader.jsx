import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function AdminHeader({ onMenuToggle }) {
    const { auth } = usePage().props;

    return (
        <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white h-16 z-50 flex items-center justify-between px-4 border-b border-gray-700">
            {/* Left side - Menu button and title */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuToggle}
                    className="p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-label="Toggle sidebar"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <h1 className="text-xl font-semibold">Drinkest Admin</h1>
            </div>

            {/* Right side - User dropdown */}
            <div className="flex items-center">
                <Dropdown>
                    <Dropdown.Trigger>
                        <span className="inline-flex rounded-md">
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-pink-400 hover:text-pink-300 focus:outline-none transition ease-in-out duration-150"
                            >
                                {auth.user.name}
                                <svg
                                    className="ml-2 -mr-0.5 h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </span>
                    </Dropdown.Trigger>

                    <Dropdown.Content>
                        <Dropdown.Link href={route("profile.edit")}>
                            Profile
                        </Dropdown.Link>
                        <Dropdown.Link
                            href={route("logout")}
                            method="post"
                            as="button"
                        >
                            Log Out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </header>
    );
}
