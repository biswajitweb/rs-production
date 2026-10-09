import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { calculateTax } from "../../utils/calculateTax";
import { decryptData } from "../../utils/encryption";
import { service } from "../../api/service";
import { clearCart } from "../../features/cart/cartSlice";

const Spinner = lazy(() => import("../../components/Spinner"));

export default function Checkout() {
    const { authToken } = useSelector((state) => state.user);
    const {
        totalQuantity,
        totalAmount,
        itmes,
    } = useSelector((state) => state.cart);

    const taxWithAmount = calculateTax(totalAmount);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userInfo, setUserInfo] = useState({});
    const [orderLoader, setOrderLoader] = useState(false);

    /*
     * Checkout form
     */
    const initialFormData = {
        first_name: "",
        last_name: "",
        country: "IN",
        state: "",
        city: "",
        address_1: "",
        postcode: "",
        phone: "",
        email: "",
        order_notes: "",
    };

    const [filterUserData, setFilterUserData] = useState(initialFormData);

    /*
     * Validation errors
     */
    const [errors, setErrors] = useState({});

    /*
     * Touched fields
     */
    const [touched, setTouched] = useState({});

    /*
     * Redirect if not logged in or cart is empty
     */
    useEffect(() => {
        if (!authToken || !itmes || itmes.length === 0) {
            navigate("/");
        }
    }, [authToken, itmes, navigate]);

    /*
     * Decrypt logged-in user
     */
    const decryptAuth = async () => {
        if (!authToken) {
            return;
        }

        try {
            const userDecrypt = await decryptData(authToken);
            const userData = userDecrypt?.data;
            console.log(userData);
            
            setUserInfo(userData);
            setFilterUserData({
                first_name: userData?.first_name || "",
                last_name: userData?.last_name || "",
                country: userData?.country || "IN",
                state: userData?.billing?.state || "",
                city: userData?.billing?.city || "",
                address_1: userData?.billing?.address_1 || "",
                postcode: userData?.billing?.postcode || "",
                phone: userData?.billing?.phone || "",
                email: userData?.email || "",
                order_notes: "",
            });
        } catch (error) {
            console.error("Decrypt error:", error);
        }
    };

    useEffect(() => {
        decryptAuth();
    }, [authToken]);

    /*
     * Handle input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilterUserData((prev) => ({
            ...prev,
            [name]: value,
        }));

        /*
         * Validate immediately if field was already touched
         */
        if (touched[name]) {
            const error = validateField(name, value);

            setErrors((prev) => ({
                ...prev,
                [name]: error,
            }));
        }
    };

    /*
     * Handle input blur
     */
    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const error = validateField(name, value);

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    };

    /*
     * Validate individual field
     */
    const validateField = (name, value) => {
        const trimmedValue = value?.trim?.() || "";

        switch (name) {
            case "first_name":
                if (!trimmedValue) {
                    return "First name is required.";
                }

                if (trimmedValue.length < 2) {
                    return "First name must be at least 2 characters.";
                }

                if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
                    return "First name can contain only letters.";
                }

                return "";

            case "last_name":
                if (!trimmedValue) {
                    return "Last name is required.";
                }

                if (trimmedValue.length < 2) {
                    return "Last name must be at least 2 characters.";
                }

                if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
                    return "Last name can contain only letters.";
                }

                return "";

            case "country":
                if (!trimmedValue) {
                    return "Please select a country.";
                }

                return "";

            case "state":
                if (!trimmedValue) {
                    return "Please select a state.";
                }

                return "";

            case "city":
                if (!trimmedValue) {
                    return "City is required.";
                }

                if (trimmedValue.length < 2) {
                    return "City must be at least 2 characters.";
                }

                return "";

            case "address_1":
                if (!trimmedValue) {
                    return "Address is required.";
                }

                if (trimmedValue.length < 5) {
                    return "Please enter a valid address.";
                }

                return "";

            case "postcode":
                if (!trimmedValue) {
                    return "PIN code is required.";
                }

                if (!/^[0-9]{6}$/.test(trimmedValue)) {
                    return "PIN code must be exactly 6 digits.";
                }

                return "";

            case "phone":
                if (!trimmedValue) {
                    return "Phone number is required.";
                }

                if (!/^[6-9][0-9]{9}$/.test(trimmedValue)) {
                    return "Enter a valid 10-digit phone number.";
                }

                return "";

            case "email":
                if (!trimmedValue) {
                    return "Email address is required.";
                }

                if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                        trimmedValue
                    )
                ) {
                    return "Enter a valid email address.";
                }

                return "";

            default:
                return "";
        }
    };

    /*
     * Validate complete form
     */
    const validateForm = () => {
        const fields = [
            "first_name",
            "last_name",
            "country",
            "state",
            "city",
            "address_1",
            "postcode",
            "phone",
            "email",
        ];

        const newErrors = {};

        fields.forEach((field) => {
            const error = validateField(
                field,
                filterUserData[field]
            );

            if (error) {
                newErrors[field] = error;
            }
        });

        /*
         * Mark all fields as touched
         */
        const newTouched = {};

        fields.forEach((field) => {
            newTouched[field] = true;
        });

        setTouched(newTouched);
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /*
     * Check whether field has error
     */
    const hasError = (field) => {
        return touched[field] && errors[field];
    };

    /*
     * Place order
     */
    const onPlaceOrder = async () => {
        /*
         * Validate before API call
         */
        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        if (!userInfo?.id) {
            return;
        }

        if (!Array.isArray(itmes) || itmes.length === 0) {
            return;
        }

        /*
         * Prepare line items
         */
        const result = itmes.map(({ productId, quantity }) => ({
            product_id: productId,
            quantity,
        }));

        /*
         * Billing data
         */
        const billingData = {
            first_name: filterUserData.first_name,
            last_name: filterUserData.last_name,
            company: userInfo?.billing?.company || "",
            address_1: filterUserData.address_1,
            address_2: userInfo?.billing?.address_2 || "",
            city: filterUserData.city,
            state: filterUserData.state,
            postcode: filterUserData.postcode,
            country: filterUserData.country,
            email: filterUserData.email,
            phone: filterUserData.phone,
        };

        /*
         * Shipping data
         */
        const shippingData = {
            first_name: filterUserData.first_name,
            last_name: filterUserData.last_name,
            company: userInfo?.shipping?.company || "",
            address_1:
                userInfo?.shipping?.address_1 ||
                filterUserData.address_1,
            address_2: userInfo?.shipping?.address_2 || "",
            city:
                userInfo?.shipping?.city ||
                filterUserData.city,
            state:
                userInfo?.shipping?.state ||
                filterUserData.state,
            postcode:
                userInfo?.shipping?.postcode ||
                filterUserData.postcode,
            country:
                userInfo?.shipping?.country ||
                filterUserData.country,
        };

        /*
         * Order payload
         */
        const orderData = {
            customer_id: userInfo.id,

            payment_method: "cod",

            payment_method_title: "Cash on Delivery",

            tax_rate: 18,

            billing: billingData,

            shipping: shippingData,

            line_items: result,

            customer_note: filterUserData.order_notes,
        };
        try {
            setOrderLoader(true);

            const response = await service.order.create(orderData);
            const orderResponse = response?.data;
            const orderId = orderResponse?.data?.id;
            const createdAt = orderResponse?.data?.created_at;
            const total = orderResponse?.data?.total;
            if (orderId > 0) {
                /*
                 * Redirect to success page
                 */
                navigate(`/order-success`, {
                    replace: true,
                    state: {
                        orderId,
                        createdAt,
                        total
                    },
                });

                
            }
        } catch (error) {
            console.error("Place order error:", error);

            /*
             * Optional API error handling
             */
            const apiMessage =
                error?.response?.data?.message ||
                error?.response?.data?.data?.message ||
                "Unable to place order. Please try again.";

            console.error(apiMessage);
        } finally {
            setOrderLoader(false);
        }
    };

    return (
        <>
            <section className="checkout-page">
                <div className="container">
                    <div className="row">
                        <div className="col-12">

                            <h1 className="page-heading">
                                Checkout
                            </h1>

                            <div className="row">

                                {/* =========================
                                    BILLING DETAILS
                                ========================== */}

                                <div className="col-md-6">

                                    <h3 className="mb-4">
                                        Billing details
                                    </h3>

                                    <div className="row">

                                        {/* First Name */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="first_name"
                                                    className="form-label"
                                                >
                                                    First Name{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`form-control ${
                                                        hasError(
                                                            "first_name"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="first_name"
                                                    name="first_name"
                                                    value={
                                                        filterUserData.first_name
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    onBlur={
                                                        handleBlur
                                                    }
                                                    placeholder="Enter first name"
                                                />

                                                {hasError(
                                                    "first_name"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.first_name
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* Last Name */}
                                        <div className="col-md-6">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="last_name"
                                                    className="form-label"
                                                >
                                                    Last Name{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`form-control ${
                                                        hasError(
                                                            "last_name"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="last_name"
                                                    name="last_name"
                                                    value={
                                                        filterUserData.last_name
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    onBlur={
                                                        handleBlur
                                                    }
                                                    placeholder="Enter last name"
                                                />

                                                {hasError(
                                                    "last_name"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.last_name
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* Country */}
                                        <div className="col-md-12">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="country"
                                                    className="form-label"
                                                >
                                                    Country{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <select
                                                    className={`form-select ${
                                                        hasError(
                                                            "country"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="country"
                                                    name="country"
                                                    value={
                                                        filterUserData.country
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    onBlur={
                                                        handleBlur
                                                    }
                                                >
                                                    <option value="">
                                                        Select Country
                                                    </option>

                                                    <option value="IN">
                                                        India
                                                    </option>
                                                </select>

                                                {hasError(
                                                    "country"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.country
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* State */}
                                        <div className="col-md-12">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="state"
                                                    className="form-label"
                                                >
                                                    State{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <select
                                                    className={`form-select ${
                                                        hasError(
                                                            "state"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="state"
                                                    name="state"
                                                    value={
                                                        filterUserData.state
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    onBlur={
                                                        handleBlur
                                                    }
                                                >
                                                    <option value="">
                                                        Select State
                                                    </option>

                                                    <option value="OD">
                                                        Odisha
                                                    </option>

                                                    <option value="MH">
                                                        Maharashtra
                                                    </option>

                                                    <option value="GJ">
                                                        Gujarat
                                                    </option>

                                                    <option value="DL">
                                                        Delhi
                                                    </option>

                                                    <option value="KA">
                                                        Karnataka
                                                    </option>

                                                    <option value="WB">
                                                        West Bengal
                                                    </option>
                                                </select>

                                                {hasError(
                                                    "state"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.state
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="col-md-12">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="city"
                                                    className="form-label"
                                                >
                                                    Town / City{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`form-control ${
                                                        hasError(
                                                            "city"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="city"
                                                    name="city"
                                                    value={
                                                        filterUserData.city
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    onBlur={
                                                        handleBlur
                                                    }
                                                    placeholder="Enter city"
                                                />

                                                {hasError(
                                                    "city"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {errors.city}
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="col-md-12">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="address_1"
                                                    className="form-label"
                                                >
                                                    Address{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`form-control ${
                                                        hasError(
                                                            "address_1"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="address_1"
                                                    name="address_1"
                                                    value={
                                                        filterUserData.address_1
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    onBlur={
                                                        handleBlur
                                                    }
                                                    placeholder="House number and street name"
                                                />

                                                {hasError(
                                                    "address_1"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.address_1
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* PIN Code */}
                                        <div className="col-md-12">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="postcode"
                                                    className="form-label"
                                                >
                                                    PIN Code{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`form-control ${
                                                        hasError(
                                                            "postcode"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="postcode"
                                                    name="postcode"
                                                    value={
                                                        filterUserData.postcode
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    onBlur={
                                                        handleBlur
                                                    }
                                                    maxLength="6"
                                                    inputMode="numeric"
                                                    placeholder="6 digit PIN code"
                                                />

                                                {hasError(
                                                    "postcode"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.postcode
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="col-md-12">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="phone"
                                                    className="form-label"
                                                >
                                                    Phone{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`form-control ${
                                                        hasError(
                                                            "phone"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="phone"
                                                    name="phone"
                                                    value={
                                                        filterUserData.phone
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    onBlur={
                                                        handleBlur
                                                    }
                                                    maxLength="10"
                                                    inputMode="numeric"
                                                    placeholder="10 digit mobile number"
                                                />

                                                {hasError(
                                                    "phone"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.phone
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="col-md-12">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="email"
                                                    className="form-label"
                                                >
                                                    Email address{" "}
                                                    <span className="text-danger">
                                                        *
                                                    </span>
                                                </label>

                                                <input
                                                    type="email"
                                                    className={`form-control ${
                                                        hasError(
                                                            "email"
                                                        )
                                                            ? "is-invalid"
                                                            : ""
                                                    }`}
                                                    id="email"
                                                    name="email"
                                                    value={
                                                        filterUserData.email
                                                    }
                                                    readOnly
                                                />

                                                {hasError(
                                                    "email"
                                                ) && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.email
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                        </div>

                                        {/* Order Notes */}
                                        <div className="col-md-12">
                                            <div className="mb-3">

                                                <label
                                                    htmlFor="order_notes"
                                                    className="form-label"
                                                >
                                                    Order notes
                                                    (optional)
                                                </label>

                                                <textarea
                                                    className="form-control"
                                                    id="order_notes"
                                                    name="order_notes"
                                                    value={
                                                        filterUserData.order_notes
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    rows="4"
                                                    placeholder="Notes about your order"
                                                />

                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* =========================
                                    YOUR ORDER
                                ========================== */}

                                {Array.isArray(itmes) &&
                                    itmes.length > 0 && (
                                        <div className="col-md-6">

                                            <h3 className="mb-4">
                                                Your order
                                            </h3>

                                            <div className="card">

                                                <div className="card-body">

                                                    <table className="table">

                                                        <thead>
                                                            <tr>
                                                                <th className="product-name">
                                                                    Product
                                                                </th>

                                                                <th className="product-total">
                                                                    Subtotal
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>

                                                            {itmes.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={`${item.productId}-${index}`}
                                                                    >
                                                                        <td>
                                                                            <Link
                                                                                className="text-decoration-none text-primary"
                                                                                to={`/product-details/${item.productId}/variants/${item.variantId}`}
                                                                            >
                                                                                {
                                                                                    item.name
                                                                                }
                                                                                {" "}
                                                                                ×{" "}
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </Link>
                                                                            
                                                                        </td>

                                                                        <td>
                                                                            &#8377;{" "}
                                                                            {Number(
                                                                                item.price
                                                                            ) *
                                                                                Number(
                                                                                    item.quantity
                                                                                )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}

                                                            {/* Subtotal */}
                                                            <tr>
                                                                <td>
                                                                    Subtotal
                                                                </td>

                                                                <td>
                                                                    &#8377;{" "}
                                                                    {
                                                                        totalAmount
                                                                    }
                                                                </td>
                                                            </tr>

                                                            {/* Tax */}
                                                            <tr>
                                                                <td>
                                                                    Tax
                                                                </td>

                                                                <td>
                                                                    18%
                                                                </td>
                                                            </tr>

                                                            {/* Total */}
                                                            <tr>
                                                                <td>
                                                                    <b>
                                                                        Total
                                                                    </b>
                                                                </td>

                                                                <td>
                                                                    <b>
                                                                        &#8377;{" "}
                                                                        {
                                                                            taxWithAmount.total
                                                                        }
                                                                    </b>
                                                                </td>
                                                            </tr>

                                                        </tbody>

                                                    </table>

                                                    <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        onClick={
                                                            onPlaceOrder
                                                        }
                                                        disabled={
                                                            orderLoader
                                                        }
                                                    >

                                                        {orderLoader && (
                                                            <Spinner
                                                                size="sm"
                                                                color="white"
                                                            />
                                                        )}

                                                        {orderLoader
                                                            ? " Placing Order..."
                                                            : " Place Order"}

                                                    </button>

                                                </div>

                                            </div>

                                        </div>
                                    )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}