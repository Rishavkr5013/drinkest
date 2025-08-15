import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

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

export default function PhoneLogin() {
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

    const sendOTP = async () => {
        setupRecaptcha();
        try {
            const result = await signInWithPhoneNumber(
                auth,
                phone,
                window.recaptchaVerifier
            );
            setConfirmationResult(result);
            alert("OTP sent!");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const verifyOTP = async () => {
        try {
            const userCredential = await confirmationResult.confirm(otp);
            const idToken = await userCredential.user.getIdToken();
            router.post("/firebase-login", { token: idToken }); // Send to Laravel
        } catch (error) {
            console.error(error);
            alert("Invalid OTP");
        }
    };

    return (
        <div>
            <h2>Login with Phone</h2>
            <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
            />
            <div id="recaptcha-container"></div>
            <button onClick={sendOTP}>Send OTP</button>

            {confirmationResult && (
                <>
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                    />
                    <button onClick={verifyOTP}>Verify OTP</button>
                </>
            )}
        </div>
    );
}
