import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";
import axios from "axios";

// Firebase Config
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function DeliveryPartnerLogin() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);

    const setupRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
                size: "invisible", // or "normal"
            }
        );
    };

    // Send OTP
    const sendOTP = async () => {
        setupRecaptcha();
        try {
            const result = await signInWithPhoneNumber(
                auth,
                phone,
                window.recaptchaVerifier
            );
            setConfirmationResult(result);
            alert("OTP sent successfully!");
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert(`Failed to send OTP: ${error.message}`);
        }
    };

    // Verify OTP
    const verifyOTP = async () => {
        if (!confirmationResult) return;

        try {
            const userCredential = await confirmationResult.confirm(otp);
            const idToken = await userCredential.user.getIdToken();

            const res = await axios.post(
                "http://localhost:8000/delivery-partner/login",
                { token: idToken },
                { withCredentials: true } // important for Laravel session
            );

            console.log("Logged in delivery partner:", res.data.partner);

            // Redirect to delivery partner dashboard
            router.visit("/delivery-partner/dashboard");
        } catch (error) {
            console.error("Authentication failed:", error);

            if (error.response?.status === 403) {
                alert(
                    "Access denied. Please contact the admin to create your delivery partner account."
                );
            } else if (error.response?.status === 401) {
                alert("Invalid OTP or authentication failed.");
            } else {
                alert("Login failed. Please try again.");
            }
        }
    };

    return (
        <>
            <Head title="Delivery Partner Login" />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Delivery Partner Login
                        </h2>
                        <p className="text-sm text-gray-600 mt-2">
                            Enter your phone number to receive an OTP
                        </p>
                    </div>

                    {!confirmationResult && (
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div id="recaptcha-container"></div>
                            <button
                                onClick={sendOTP}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Send OTP
                            </button>
                        </div>
                    )}

                    {confirmationResult && (
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                onClick={verifyOTP}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Verify OTP
                            </button>
                            <button
                                onClick={() => {
                                    setConfirmationResult(null);
                                    setOtp("");
                                }}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Back to Phone Number
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
