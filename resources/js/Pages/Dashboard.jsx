// import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
// import { Head, useForm } from "@inertiajs/react";
// import { useState, useRef } from "react";
// import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
// import axios from "axios";

// export default function Dashboard() {
//     const [place, setPlace] = useState(null);
//     const searchBoxRef = useRef(null);

//     const { data, setData, errors } = useForm({
//         address: "",
//         latitude: "",
//         longitude: "",
//     });

//     const [message, setMessage] = useState(null);
//     const [blocked, setBlocked] = useState(false);

//     const onPlacesChanged = async () => {
//         const places = searchBoxRef.current.getPlaces();
//         if (places.length === 0) return;

//         const selectedPlace = places[0];
//         setPlace(selectedPlace);

//         const address = selectedPlace.formatted_address;
//         const lat = selectedPlace.geometry.location.lat();
//         const lng = selectedPlace.geometry.location.lng();

//         setData({ ...data, address, latitude: lat, longitude: lng });

//         // Call API to check radius
//         try {
//             const res = await axios.post("/api/user-location/check-radius", {
//                 address,
//                 store_id: storeId,
//             });

//             if (res.data.allowed) {
//                 setMessage("✅ Address is within delivery area.");
//                 setBlocked(false);
//             }
//         } catch (err) {
//             setMessage(
//                 "❌ " +
//                     (err.response?.data?.message ||
//                         "Address is outside delivery area.")
//             );
//             setBlocked(true);
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (blocked) {
//             alert("Cannot save: address outside delivery area.");
//             return;
//         }
//         // Save user location logic here
//         alert("Address saved successfully!");
//     };

//     return (
//         <AuthenticatedLayout
//             header={
//                 <h2 className="text-xl font-semibold leading-tight text-gray-800">
//                     Dashboard
//                 </h2>
//             }
//         >
//             <LoadScript
//                 googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
//                 libraries={["places"]}
//             >
//                 <form
//                     onSubmit={handleSubmit}
//                     className="space-y-4 p-4 border rounded"
//                 >
//                     <div>
//                         <label className="block mb-1">Address</label>
//                         <StandaloneSearchBox
//                             onLoad={(ref) => (searchBoxRef.current = ref)}
//                             onPlacesChanged={onPlacesChanged}
//                         >
//                             <input
//                                 type="text"
//                                 value={data.address}
//                                 onChange={(e) =>
//                                     setData("address", e.target.value)
//                                 }
//                                 placeholder="Enter your address"
//                                 className="border p-2 w-full"
//                             />
//                         </StandaloneSearchBox>
//                         {errors.address && (
//                             <div className="text-red-500">{errors.address}</div>
//                         )}
//                     </div>

//                     {message && (
//                         <div
//                             className={`p-2 rounded ${
//                                 blocked
//                                     ? "bg-red-100 text-red-600"
//                                     : "bg-green-100 text-green-600"
//                             }`}
//                         >
//                             {message}
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
//                         disabled={blocked}
//                     >
//                         Save Address
//                     </button>
//                 </form>
//             </LoadScript>
//         </AuthenticatedLayout>
//     );
// }

import React, { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

export default function Dashboard({ storeId }) {
    const [place, setPlace] = useState(null);
    const searchBoxRef = useRef(null);

    const { data, setData, errors } = useForm({
        address: "",
        latitude: "",
        longitude: "",
    });

    const [message, setMessage] = useState(null);
    const [blocked, setBlocked] = useState(false);

    // Called when user selects a place from Google autocomplete
    const onPlacesChanged = async () => {
        const places = searchBoxRef.current.getPlaces();
        if (places.length === 0) return;

        const selectedPlace = places[0];
        setPlace(selectedPlace);

        const address = selectedPlace.formatted_address;
        const lat = selectedPlace.geometry.location.lat();
        const lng = selectedPlace.geometry.location.lng();

        setData({ ...data, address, latitude: lat, longitude: lng });

        await checkRadius(address, lat, lng);
    };

    // Check delivery radius via API
    const checkRadius = async (address, lat, lng) => {
        try {
            const res = await axios.post("/api/user-location/check-radius", {
                address,
                store_id: 2,
                latitude: lat,
                longitude: lng,
            });
            console.log(res);

            if (res.data.allowed) {
                setMessage("✅ Address is within delivery area.");
                setBlocked(false);
            }
        } catch (err) {
            setMessage(
                "❌ " +
                    (err.response?.data?.message ||
                        "Address is outside delivery area.")
            );
            setBlocked(true);
        }
    };

    // Use browser geolocation
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Optional: reverse geocode
                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode(
                    { location: { lat, lng } },
                    async (results, status) => {
                        if (status === "OK" && results[0]) {
                            const address = results[0].formatted_address;
                            setData({
                                ...data,
                                address,
                                latitude: lat,
                                longitude: lng,
                            });

                            await checkRadius(address, lat, lng);
                        } else {
                            alert(
                                "Unable to fetch address from your location."
                            );
                            setData({ ...data, latitude: lat, longitude: lng });
                            await checkRadius("", lat, lng);
                        }
                    }
                );
            },
            (error) => {
                alert("Error fetching location: " + error.message);
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (blocked) {
            alert("Cannot save: address outside delivery area.");
            return;
        }

        try {
            const res = await axios.post("/api/user-locations", {
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
            });

            alert("Address saved successfully!");
            console.log(res.data.location);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save address");
        }
    };

    return (
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-4 p-4 border rounded max-w-md mx-auto"
            >
                <div>
                    <label className="block mb-1 font-semibold">Address</label>
                    <StandaloneSearchBox
                        onLoad={(ref) => (searchBoxRef.current = ref)}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            placeholder="Enter your address"
                            className={`border p-2 w-full rounded ${
                                blocked ? "border-red-500" : ""
                            }`}
                        />
                    </StandaloneSearchBox>
                    {errors.address && (
                        <div className="text-red-500">{errors.address}</div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleUseMyLocation}
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Use My Current Location
                </button>

                {message && (
                    <div
                        className={`p-2 rounded ${
                            blocked
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                        }`}
                    >
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded w-full disabled:opacity-50"
                    disabled={blocked}
                >
                    Save Address
                </button>
            </form>
        </LoadScript>
    );
}
