import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { calculateTax } from "../../utils/calculateTax";
import { decryptData } from "../../utils/encryption";
import { service } from "../../api/service";
import { clearCart } from "../../features/cart/cartSlice";
import { allAddressList } from "../../features/address/addressSlice";

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
    const {address} = useSelector(state => state.address);
    
    const [userInfo, setUserInfo] = useState({});
    const [orderLoader, setOrderLoader] = useState(false);
    const [userId, setUserId] = useState(0);
    

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
            setUserInfo(userData);
            setUserId(userData.id);
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

    const getAddressBooks = async(userId)=>{
        try {
            await dispatch(allAddressList(userId));
        } catch (error) {
            if(error) {
                console.log(error.message);
            }
        }
    }

    useEffect(()=>{
        if(userId > 0) {
            getAddressBooks(userId);
        }
    }, [userId]);

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
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h3 className="mb-0">Delivery Address</h3>

                                        <Link
                                            to="/my-account/addresses"
                                            className="btn btn-primary btn-sm rounded-pill px-3 py-2"
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Add Address
                                        </Link>
                                    </div>

                                    <div className="row">
                                        {address.length === 0 ? (
                                            <div className="col-12">
                                                <div className="card border-0 shadow-sm rounded-4 text-center p-4">
                                                    <div className="mb-3">
                                                        <div
                                                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light"
                                                            style={{ width: "80px", height: "80px" }}
                                                        >
                                                            <i
                                                                className="bi bi-geo-alt text-primary"
                                                                style={{ fontSize: "2.5rem" }}
                                                            ></i>
                                                        </div>
                                                    </div>

                                                    <h5 className="fw-semibold mb-2">
                                                        No Delivery Address Found
                                                    </h5>

                                                    <p className="text-muted mb-4">
                                                        You haven't added a delivery address yet.
                                                        Add your address to make checkout faster and easier.
                                                    </p>

                                                    <div>
                                                        <Link
                                                            to="/my-account/addresses"
                                                            className="btn btn-primary rounded-pill px-4 py-2"
                                                        >
                                                            <i className="bi bi-plus-circle me-2"></i>
                                                            Add Your First Address
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
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
                                                        className="btn custom-btn btn-primary"
                                                        onClick={
                                                            onPlaceOrder
                                                        }
                                                        disabled={orderLoader || address.length === 0}
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