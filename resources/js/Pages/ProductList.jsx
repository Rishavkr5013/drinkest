import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProductList({ storeId }) {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [step, setStep] = useState("products"); // "products" | "checkout" | "confirmation"
    const [order, setOrder] = useState(null);

    // Fetch products
    useEffect(() => {
        axios.get(`/api/products?store_id=${storeId}`).then((res) => {
            setProducts(res.data.data);
        });
    }, [storeId]);

    // Add product to cart
    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find((item) => item.product.id === product.id);
            if (exists) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    // Remove from cart
    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    // Place order
    const placeOrder = async () => {
        try {
            // const res = await axios.post("/api/orders", {
            //     store_id: storeId,
            //     user_location_id: 6, // TODO: replace with selected location
            //     items: cart.map((c) => ({
            //         product_id: c.product.id,
            //         quantity: c.quantity,
            //     })),
            // });
            const res = await axios.post(
                "/api/orders",
                {
                    store_id: 2,
                    user_location_id: 6,
                    items: cart.map((item) => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                    })),
                },
                { withCredentials: true }
            );

            setOrder(res.data.order);
            setCart([]);
            setStep("confirmation");
        } catch (err) {
            alert(err.response?.data?.error || "Failed to place order");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Products Step */}
            {step === "products" && (
                <>
                    <h1 className="text-2xl font-bold mb-6">Products</h1>
                    <div className="grid grid-cols-2 gap-4">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                className="border rounded-xl p-4 shadow-sm"
                            >
                                <h2 className="font-semibold text-lg">
                                    {p.name}
                                </h2>
                                <p className="text-gray-600 mb-3">₹{p.price}</p>
                                <button
                                    className="px-3 py-2 bg-green-500 text-white rounded-lg"
                                    onClick={() => addToCart(p)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Cart Preview */}
                    {cart.length > 0 && (
                        <div className="mt-8 border-t pt-6">
                            <h2 className="text-xl font-bold mb-4">
                                Your Cart
                            </h2>
                            <ul className="space-y-3">
                                {cart.map((item) => (
                                    <li
                                        key={item.product.id}
                                        className="flex justify-between items-center"
                                    >
                                        <span>
                                            {item.product.name} x{" "}
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                removeFromCart(item.product.id)
                                            }
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
                                onClick={() => setStep("checkout")}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Checkout Step */}
            {step === "checkout" && (
                <div>
                    <h1 className="text-2xl font-bold mb-6">Checkout</h1>
                    <p className="mb-4 text-gray-600">
                        Select delivery address (hardcoded for now)
                    </p>
                    <button
                        onClick={placeOrder}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg"
                    >
                        Confirm & Place Order
                    </button>
                    <button
                        onClick={() => setStep("products")}
                        className="ml-3 px-6 py-3 bg-gray-400 text-white rounded-lg"
                    >
                        Back
                    </button>
                </div>
            )}

            {/* Confirmation Step */}
            {step === "confirmation" && order && (
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-green-600 mb-4">
                        🎉 Order Placed!
                    </h1>
                    <p className="mb-2">
                        Order ID: <strong>{order.id}</strong>
                    </p>
                    <p className="mb-6">Total: ₹{order.total_amount}</p>
                    <button
                        onClick={() => setStep("products")}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
                    >
                        Back to Products
                    </button>
                </div>
            )}
        </div>
    );
}
