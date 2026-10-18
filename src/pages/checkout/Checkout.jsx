import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { calculateTax } from "../../utils/calculateTax";
import { decryptData } from "../../utils/encryption";
import { service } from "../../api/service";
import { allAddressList } from "../../features/address/addressSlice";
import { loadCashfreeSDK } from "../../utils/loadCashfree";
import { createCashfreePayment } from "../../api/cashfreeService";

const Spinner = lazy(() => import("../../components/Spinner"));

const Toast = lazy(() => import("../../components/Toast"));

export default function Checkout() {
    const { authToken } = useSelector((state) => state.user);

    const {
        totalQuantity,
        totalAmount,
        itmes,
    } = useSelector((state) => state.cart);

    const { address } = useSelector(
        (state) => state.address
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const taxWithAmount = calculateTax(totalAmount);

    const [userInfo, setUserInfo] = useState({});
    const [userId, setUserId] = useState(0);

    const [orderLoader, setOrderLoader] = useState(false);
    const [addressLoading, setAddressLoading] =
        useState(true);

    const [cashfreeReady, setCashfreeReady] =
        useState(false);

    const [cashfreeLoading, setCashfreeLoading] =
        useState(true);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    /*
     * Show toast
     */
    const showToast = (
        message,
        type = "success"
    ) => {
        setToast({
            show: true,
            message,
            type,
        });
    };

    /*
     * Close toast
     */
    const closeToast = () => {
        setToast((prev) => ({
            ...prev,
            show: false,
        }));
    };

    /*
     * Load Cashfree SDK
     */
    useEffect(() => {
        let isMounted = true;

        const initializeCashfree = async () => {
            try {
                setCashfreeLoading(true);

                await loadCashfreeSDK();

                if (
                    isMounted &&
                    typeof window.Cashfree ===
                        "function"
                ) {
                    setCashfreeReady(true);
                }
            } catch (error) {
                console.error(
                    "Cashfree SDK loading error:",
                    error
                );

                if (isMounted) {
                    setCashfreeReady(false);

                    showToast(
                        "Unable to load payment gateway. Please refresh and try again.",
                        "error"
                    );
                }
            } finally {
                if (isMounted) {
                    setCashfreeLoading(false);
                }
            }
        };

        initializeCashfree();

        return () => {
            isMounted = false;
        };
    }, []);

    /*
     * Redirect if user is not logged in
     * or cart is empty
     */
    useEffect(() => {
        if (
            !authToken ||
            !Array.isArray(itmes) ||
            itmes.length === 0
        ) {
            navigate("/", {
                replace: true,
            });
        }
    }, [authToken, itmes, navigate]);

    /*
     * Decrypt logged-in user
     */
    useEffect(() => {
        let isMounted = true;

        const decryptAuth = async () => {
            if (!authToken) {
                return;
            }

            try {
                const userDecrypt =
                    await decryptData(authToken);

                const userData =
                    userDecrypt?.data;

                if (!userData) {
                    throw new Error(
                        "Unable to read user information."
                    );
                }

                if (isMounted) {
                    setUserInfo(userData);
                    setUserId(
                        Number(userData.id) || 0
                    );
                }
            } catch (error) {
                console.error(
                    "Decrypt user error:",
                    error
                );

                if (isMounted) {
                    setUserInfo({});
                    setUserId(0);
                }
            }
        };

        decryptAuth();

        return () => {
            isMounted = false;
        };
    }, [authToken]);

    /*
     * Get user addresses
     */
    useEffect(() => {
        if (!userId || userId <= 0) {
            return;
        }

        const getAddressBooks = async () => {
            try {
                setAddressLoading(true);

                await dispatch(
                    allAddressList(userId)
                );
            } catch (error) {
                console.error(
                    "Get address error:",
                    error
                );
            } finally {
                setAddressLoading(false);
            }
        };

        getAddressBooks();
    }, [userId, dispatch]);

    /*
     * Get default address
     */
    const getDefaultAddress = () => {
        if (!Array.isArray(address)) {
            return null;
        }

        return (
            address.find(
                (item) =>
                    item.is_default === true ||
                    item.is_default === 1 ||
                    item.is_default === "1"
            ) || null
        );
    };

    /*
     * Place order
     */
    const onPlaceOrder = async () => {
        /*
         * Prevent duplicate clicks
         */
        if (orderLoader) {
            return;
        }

        /*
         * Check authentication
         */
        if (!authToken || !userInfo?.id) {
            showToast(
                "Please login before placing your order.",
                "error"
            );

            navigate("/login");
            return;
        }

        /*
         * Check cart
         */
        if (
            !Array.isArray(itmes) ||
            itmes.length === 0 ||
            totalQuantity <= 0
        ) {
            showToast(
                "Your cart is empty.",
                "error"
            );

            navigate("/", {
                replace: true,
            });

            return;
        }

        /*
         * Check Cashfree SDK
         */
        if (
            !cashfreeReady ||
            typeof window.Cashfree !==
                "function"
        ) {
            showToast(
                "Payment gateway is still loading. Please try again.",
                "error"
            );

            return;
        }

        /*
         * Get default address
         */
        const defaultAddress =
            getDefaultAddress();

        if (!defaultAddress) {
            showToast(
                "Please add and select a default delivery address.",
                "error"
            );

            return;
        }

        /*
         * Prepare line items
         */
        const lineItems = itmes.map(
            ({
                productId,
                quantity,
                product_code,
            }) => ({
                product_id: productId,
                quantity: Number(quantity),
                product_code,
            })
        );

        /*
         * Remove address-only fields
         */
        const {
            label,
            is_default,
            id,
            ...filterAddress
        } = defaultAddress;

        /*
         * WooCommerce order payload
         */
        const orderData = {
            customer_id: userInfo.id,

            /*
             * Use Cashfree instead of COD
             */
            payment_method: "cashfree",

            payment_method_title: "Cashfree",

            tax_rate: 18,

            billing: filterAddress,

            shipping: filterAddress,

            line_items: lineItems,

            customer_note: "",
        };

        try {
            setOrderLoader(true);

            /*
             * ==========================================
             * STEP 1
             * Create WooCommerce order
             * ==========================================
             */
            const response =
                await service.order.create(
                    orderData
                );

            const orderResponse =
                response?.data;

            const orderDataResponse =
                orderResponse?.data;

            const orderId =
                Number(orderDataResponse?.id) || 0;

            if (orderId <= 0) {
                throw new Error(
                    "Order could not be created."
                );
            }

            /*
             * ==========================================
             * STEP 2
             * Create Cashfree payment session
             * ==========================================
             */
            const paymentData = {
                user_id: Number(userInfo.id),
                order_id: orderId,
            };
            

            const paymentResult =
                await createCashfreePayment(
                    paymentData
                );

            if (
                !paymentResult?.payment_session_id
            ) {
                throw new Error(
                    "Cashfree payment session was not returned."
                );
            }

            /*
             * ==========================================
             * STEP 3
             * Verify Cashfree SDK
             * ==========================================
             */
            if (
                typeof window.Cashfree !==
                "function"
            ) {
                throw new Error(
                    "Cashfree SDK is not loaded."
                );
            }

            /*
             * ==========================================
             * STEP 4
             * Initialize Cashfree
             * ==========================================
             */
            const cashfree =
                window.Cashfree({
                    mode:
                        paymentResult.mode ||
                        "sandbox",
                });

            /*
             * ==========================================
             * STEP 5
             * Open Cashfree Checkout
             * ==========================================
             *
             * IMPORTANT:
             *
             * redirectTarget "_self" means Cashfree
             * redirects the current browser window.
             *
             * Do NOT show a toast after checkout().
             */
            await cashfree.checkout({
                paymentSessionId:
                    paymentResult.payment_session_id,

                redirectTarget: "_self",
            });
        } catch (error) {
            console.error(
                "Place order error:",
                error
            );

            const apiMessage =
                error?.response?.data?.message ||
                error?.response?.data?.data
                    ?.message ||
                error?.message ||
                "Unable to place order. Please try again.";

            showToast(
                apiMessage,
                "error"
            );
        } finally {
            setOrderLoader(false);
        }
    };

    /*
     * Address status
     */
    const hasAddress =
        Array.isArray(address) &&
        address.length > 0;

    /*
     * Default address
     */
    const defaultAddress =
        getDefaultAddress();

    const hasDefaultAddress =
        Boolean(defaultAddress);

    /*
     * Disable place order button
     */
    const disablePlaceOrder =
        orderLoader ||
        addressLoading ||
        !hasAddress ||
        !hasDefaultAddress ||
        !cashfreeReady ||
        cashfreeLoading;

    return (
        <>
            <section className="checkout-page">
                <div className="container">
                    <div className="row">
                        <div className="col-12">

                            <h1 className="page-heading">
                                Checkout
                            </h1>

                            <div className="row g-4">

                                {/* =========================
                                    DELIVERY ADDRESS
                                ========================== */}

                                <div className="col-md-6">

                                    <div className="d-flex justify-content-between align-items-center mb-4">

                                        <h3 className="mb-0">
                                            Delivery Address
                                        </h3>

                                        <Link
                                            to="/my-account/addresses"
                                            className="btn btn-primary btn-sm rounded-pill px-3 py-2"
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Add Address
                                        </Link>

                                    </div>

                                    <div className="row">

                                        {addressLoading ? (
                                            <div className="text-center w-100 py-5">

                                                <Spinner
                                                    centered={
                                                        true
                                                    }
                                                    color="primary"
                                                    label="Loading addresses..."
                                                />

                                            </div>
                                        ) : !hasAddress ? (
                                            <div className="col-12">

                                                <div className="card border-0 shadow-sm rounded-4 text-center p-4">

                                                    <div className="mb-3">

                                                        <div
                                                            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light"
                                                            style={{
                                                                width: "80px",
                                                                height: "80px",
                                                            }}
                                                        >
                                                            <i
                                                                className="bi bi-geo-alt text-primary"
                                                                style={{
                                                                    fontSize:
                                                                        "2.5rem",
                                                                }}
                                                            />
                                                        </div>

                                                    </div>

                                                    <h5 className="fw-semibold mb-2">
                                                        No Delivery
                                                        Address Found
                                                    </h5>

                                                    <p className="text-muted mb-4">
                                                        You haven't added
                                                        a delivery address
                                                        yet. Add your
                                                        address to make
                                                        checkout faster
                                                        and easier.
                                                    </p>

                                                    <Link
                                                        to="/my-account/addresses"
                                                        className="btn btn-primary rounded-pill px-4 py-2"
                                                    >
                                                        <i className="bi bi-plus-circle me-2"></i>
                                                        Add Your First
                                                        Address
                                                    </Link>

                                                </div>

                                            </div>
                                        ) : !hasDefaultAddress ? (
                                            <div className="col-12">

                                                <div className="alert alert-warning rounded-3">

                                                    <i className="bi bi-exclamation-triangle me-2"></i>

                                                    Please select a
                                                    default delivery
                                                    address before
                                                    placing your order.

                                                </div>

                                            </div>
                                        ) : (
                                            <div className="col-12">

                                                <div className="border border-success bg-success-subtle rounded-3 p-3">

                                                    <div className="d-flex align-items-start justify-content-between gap-2 mb-3">

                                                        <div className="d-flex align-items-center gap-2">

                                                            <div
                                                                className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 bg-white text-success"
                                                                style={{
                                                                    width: "42px",
                                                                    height: "42px",
                                                                }}
                                                            >
                                                                <i
                                                                    className={`bi ${
                                                                        defaultAddress.label ===
                                                                        "Office"
                                                                            ? "bi-building"
                                                                            : "bi-house-door"
                                                                    } fs-5`}
                                                                />
                                                            </div>

                                                            <div>

                                                                <h6 className="mb-1 fw-semibold">
                                                                    {defaultAddress.label ||
                                                                        "Address"}
                                                                </h6>

                                                                <div className="small text-muted">
                                                                    {defaultAddress.label ===
                                                                    "Office"
                                                                        ? "Work address"
                                                                        : "Personal address"}
                                                                </div>

                                                            </div>

                                                        </div>

                                                        <span className="badge rounded-pill bg-success text-white px-2 py-2 flex-shrink-0">

                                                            <i className="bi bi-check2 me-1" />

                                                            Default

                                                        </span>

                                                    </div>

                                                    <div className="mb-3">

                                                        <div className="fw-semibold text-dark mb-2">

                                                            {
                                                                defaultAddress.first_name
                                                            }{" "}
                                                            {
                                                                defaultAddress.last_name
                                                            }

                                                        </div>

                                                        <div className="d-flex align-items-start gap-2 mb-2">

                                                            <i className="bi bi-geo-alt text-muted mt-1" />

                                                            <div className="small text-secondary text-break">

                                                                <div>
                                                                    {
                                                                        defaultAddress.address_1
                                                                    }
                                                                </div>

                                                                <div>
                                                                    {
                                                                        defaultAddress.city
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        defaultAddress.state
                                                                    }
                                                                </div>

                                                                <div>
                                                                    {defaultAddress.country ===
                                                                    "IN"
                                                                        ? "India"
                                                                        : defaultAddress.country}{" "}
                                                                    -{" "}
                                                                    {
                                                                        defaultAddress.postcode
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                        <div className="d-flex align-items-center gap-2 small text-secondary">

                                                            <i className="bi bi-telephone text-muted" />

                                                            <span>
                                                                {
                                                                    defaultAddress.phone
                                                                }
                                                            </span>

                                                        </div>

                                                    </div>

                                                    <div className="mt-3">

                                                        <Link
                                                            to="/my-account/addresses"
                                                            className="btn btn-outline-success btn-sm rounded-pill px-3"
                                                        >
                                                            <i className="bi bi-pencil me-1"></i>
                                                            Manage Addresses
                                                        </Link>

                                                    </div>

                                                </div>

                                            </div>
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

                                            <div className="card border-0 shadow-sm">

                                                <div className="card-body">

                                                    <div className="table-responsive">

                                                        <table className="table align-middle">

                                                            <thead>
                                                                <tr>

                                                                    <th>
                                                                        Product
                                                                    </th>

                                                                    <th className="text-end">
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
                                                                            key={`${item.productId}-${item.variantId}-${index}`}
                                                                        >

                                                                            <td>

                                                                                <Link
                                                                                    className="text-decoration-none text-primary"
                                                                                    to={`/product-details/${item.productId}/variants/${item.variantId}`}
                                                                                >
                                                                                    {
                                                                                        item.name
                                                                                    }{" "}
                                                                                    ×{" "}
                                                                                    {
                                                                                        item.quantity
                                                                                    }
                                                                                </Link>

                                                                            </td>

                                                                            <td className="text-end">

                                                                                &#8377;{" "}

                                                                                {(
                                                                                    Number(
                                                                                        item.price
                                                                                    ) *
                                                                                    Number(
                                                                                        item.quantity
                                                                                    )
                                                                                ).toFixed(
                                                                                    2
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

                                                                    <td className="text-end">

                                                                        &#8377;{" "}

                                                                        {Number(
                                                                            totalAmount
                                                                        ).toFixed(
                                                                            2
                                                                        )}

                                                                    </td>

                                                                </tr>

                                                                {/* Tax */}

                                                                <tr>

                                                                    <td>
                                                                        Tax
                                                                    </td>

                                                                    <td className="text-end">
                                                                        18%
                                                                    </td>

                                                                </tr>

                                                                {/* Total */}

                                                                <tr>

                                                                    <td>
                                                                        <strong>
                                                                            Total
                                                                        </strong>
                                                                    </td>

                                                                    <td className="text-end">

                                                                        <strong>

                                                                            &#8377;{" "}

                                                                            {Number(
                                                                                taxWithAmount.total
                                                                            ).toFixed(
                                                                                2
                                                                            )}

                                                                        </strong>

                                                                    </td>

                                                                </tr>

                                                            </tbody>

                                                        </table>

                                                    </div>

                                                    {/* Cashfree loading */}

                                                    {cashfreeLoading && (
                                                        <div className="alert alert-light border small mb-3">

                                                            <Spinner
                                                                size="sm"
                                                                color="primary"
                                                            />

                                                            <span className="ms-2">
                                                                Loading payment
                                                                gateway...
                                                            </span>

                                                        </div>
                                                    )}

                                                    {/* Cashfree error */}

                                                    {!cashfreeLoading &&
                                                        !cashfreeReady && (
                                                            <div className="alert alert-danger small mb-3">

                                                                <i className="bi bi-exclamation-circle me-2"></i>

                                                                Payment gateway
                                                                could not be
                                                                loaded. Please
                                                                refresh the page
                                                                and try again.

                                                            </div>
                                                        )}

                                                   {
                                                    /**
                                                     * <button
                                                        type="button"
                                                        className="btn custom-btn btn-primary w-100"
                                                        onClick={
                                                            onPlaceOrder
                                                        }
                                                        disabled={
                                                            disablePlaceOrder
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
                                                            : cashfreeLoading
                                                            ? " Loading Payment..."
                                                            : " Place Order"}

                                                    </button>
                                                     */
                                                   }
                                                    

                                                </div>

                                            </div>

                                        </div>
                                    )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                duration={3000}
                onClose={closeToast}
            />
        </>
    );
}