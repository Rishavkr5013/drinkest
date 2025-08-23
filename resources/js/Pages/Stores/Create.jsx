import React, { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";

export default function CreateStore() {
    const [place, setPlace] = useState(null);
    const searchBoxRef = useRef(null);

    const { data, setData, post, errors } = useForm({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        delivery_radius: 5000,
    });

    const onPlacesChanged = () => {
        const places = searchBoxRef.current.getPlaces();
        if (places.length === 0) return;

        const selectedPlace = places[0];
        setPlace(selectedPlace);

        setData({
            ...data,
            address: selectedPlace.formatted_address,
            latitude: selectedPlace.geometry.location.lat(),
            longitude: selectedPlace.geometry.location.lng(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/api/stores");
    };

    return (
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
        >
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div>
                    <label className="block">Store Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="border p-2 w-full"
                    />
                    {errors.name && (
                        <div className="text-red-500">{errors.name}</div>
                    )}
                </div>

                <div>
                    <label className="block">Address</label>
                    <StandaloneSearchBox
                        onLoad={(ref) => (searchBoxRef.current = ref)}
                        onPlacesChanged={onPlacesChanged}
                    >
                        <input
                            type="text"
                            value={data.address}
                            onChange={(e) => setData("address", e.target.value)}
                            className="border p-2 w-full"
                            placeholder="Search address..."
                        />
                    </StandaloneSearchBox>
                    {errors.address && (
                        <div className="text-red-500">{errors.address}</div>
                    )}
                </div>

                <div>
                    <label className="block">Delivery Radius (meters)</label>
                    <input
                        type="number"
                        value={data.delivery_radius}
                        onChange={(e) =>
                            setData("delivery_radius", e.target.value)
                        }
                        className="border p-2 w-full"
                    />
                    {errors.delivery_radius && (
                        <div className="text-red-500">
                            {errors.delivery_radius}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Save Store
                </button>
            </form>
        </LoadScript>
    );
}
