
import React, {
    lazy,
    useEffect,
    useRef,
    useState,
} from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { calculateTax } from "../../utils/calculateTax";
import { decryptData } from "../../utils/encryption";
import { service } from "../../api/service";
import { allAddressList } from "../../features/address/addressSlice";
import { loadRazorpayScript } from "../../utils/razorpay";
import { getRazorpayTheme } from "../../utils/getRazorpayTheme";


const Spinner = lazy(() => import("../../components/Spinner"));
const Toast = lazy(() => import("../../components/Toast"));

export default function Checkout() {

    const { authToken } = useSelector((state) => state.user);

    const { totalQuantity, totalAmount, itmes } = useSelector(
        (state) => state.cart
    );

    const { address } = useSelector((state) => state.address);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {info} = useSelector(state => state.site);
    
    

    const taxWithAmount = calculateTax(totalAmount);

    const [userInfo, setUserInfo] = useState({});
    const [userId, setUserId] = useState(0);

    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(true);
    const [paymentVerifying, setPaymentVerifying] = useState(false);

    const [orderLoader, setOrderLoader] = useState(false);
    const [addressLoading, setAddressLoading] = useState(true);

    // Prevent duplicate order/payment verification
    const orderLockRef = useRef(false);
    const verificationLockRef = useRef(false);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    /*
     * Show Toast
     */
    const showToast = (message, type = "success") => {
        setToast({
            show: true,
            message,
            type,
        });
    };

    /*
     * Close Toast
     */
    const closeToast = () => {
        setToast((prev) => ({
            ...prev,
            show: false,
        }));
    };

    /*
     * Load Razorpay SDK
     */
    useEffect(() => {

        let isMounted = true;

        const initRazorpay = async () => {

            try {

                setPaymentLoading(true);

                const loaded = await loadRazorpayScript();

                if (!isMounted) return;

                const isAvailable =
                    loaded &&
                    typeof window.Razorpay === "function";

                setRazorpayLoaded(isAvailable);

                if (!isAvailable) {
                    showToast(
                        "Unable to load Razorpay. Please refresh and try again.",
                        "error"
                    );
                }

            } catch (error) {

                console.error("Razorpay SDK error:", error);

                if (isMounted) {

                    setRazorpayLoaded(false);

                    showToast(
                        "Unable to load payment gateway. Please try again.",
                        "error"
                    );
                }

            } finally {

                if (isMounted) {
                    setPaymentLoading(false);
                }
            }
        };

        initRazorpay();

        return () => {
            isMounted = false;
        };

    }, []);

    /*
     * Redirect if Not Logged In or Cart Empty
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
     * Decrypt Logged-in User
     */
    useEffect(() => {

        let isMounted = true;

        const decryptAuth = async () => {

            if (!authToken) return;

            try {

                const userDecrypt = await decryptData(authToken);

                const userData = userDecrypt?.data;

                if (!userData?.id) {
                    throw new Error(
                        "Unable to read user information."
                    );
                }

                if (isMounted) {

                    setUserInfo(userData);

                    setUserId(Number(userData.id) || 0);
                }

            } catch (error) {

                console.error("Decrypt user error:", error);

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
     * Get User Addresses
     */
    useEffect(() => {

        if (!userId || userId <= 0) return;

        let isMounted = true;

        const getAddressBooks = async () => {

            try {

                setAddressLoading(true);

                await dispatch(allAddressList(userId));

            } catch (error) {

                console.error("Get address error:", error);

            } finally {

                if (isMounted) {
                    setAddressLoading(false);
                }
            }
        };

        getAddressBooks();

        return () => {
            isMounted = false;
        };

    }, [userId, dispatch]);

    /*
     * Get Default Address
     */
    const getDefaultAddress = () => {

        if (!Array.isArray(address)) return null;

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
     * Verify Razorpay Payment
     */
    const verifyRazorpayPayment = async (
        paymentResponse,
        orderId
    ) => {

        if (verificationLockRef.current) return;

        verificationLockRef.current = true;

        setPaymentVerifying(true);
        setOrderLoader(true);

        try {

            const response = await service.order.verifyPayment({

                order_id: orderId,

                razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                razorpay_signature:
                    paymentResponse.razorpay_signature,

                user_id: Number(userInfo.id),

            });

            const result =
                response?.data?.data || response?.data;

            if (!result?.success) {
                throw new Error(
                    result?.message ||
                    "Payment verification failed."
                );
            }

            showToast(
                "Payment verified successfully. Redirecting to your order confirmation...",
                "success"
            );

            /** Clear carts */
            

            navigate(
                `/order-success/${orderId}/user_id/${Number(userInfo.id)}`,
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "Payment verification error:",
                error
            );

            setPaymentVerifying(false);
            setOrderLoader(false);

            verificationLockRef.current = false;

            showToast(
                error?.response?.data?.message ||
                error?.response?.data?.data?.message ||
                "We couldn't verify your payment. If money was deducted, please contact support before making another payment.",
                "error"
            );
        }
    };

    /*
     * Place Order
     */
    const onPlaceOrder = async () => {

        if (orderLockRef.current) return;

        /*
         * Authentication Validation
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
         * Cart Validation
         */
        if (
            !Array.isArray(itmes) ||
            itmes.length === 0 ||
            Number(totalQuantity) <= 0
        ) {

            showToast("Your cart is empty.", "error");

            navigate("/", {
                replace: true,
            });

            return;
        }

        /*
         * Razorpay SDK Validation
         */
        if (
            !razorpayLoaded ||
            typeof window.Razorpay !== "function"
        ) {

            showToast(
                "Razorpay is not available. Please refresh and try again.",
                "error"
            );

            return;
        }

        /*
         * Default Address Validation
         */
        const defaultAddress = getDefaultAddress();

        if (!defaultAddress) {

            showToast(
                "Please add and select a default delivery address.",
                "error"
            );

            return;
        }

        /*
         * Prepare Line Items
         */
        const lineItems = itmes.map(
            ({ productId, quantity, product_code }) => ({
                product_id: productId,
                quantity: Number(quantity),
                product_code,
            })
        );

        /*
         * Filter Address
         */
        const {
            label,
            is_default,
            id,
            ...filterAddress
        } = defaultAddress;

        /*
         * WooCommerce Order Payload
         */
        const orderData = {

            customer_id: Number(userInfo.id),

            payment_method: "razorpay",

            payment_method_title: "Razorpay",

            set_paid: false,

            tax_rate: 18,

            billing: filterAddress,

            shipping: filterAddress,

            line_items: lineItems,

            customer_note: "",

        };

        try {

            orderLockRef.current = true;

            setOrderLoader(true);

            /*
             * STEP 1: Create WooCommerce Order
             */
            const response =
                await service.order.create(orderData);

            const orderResponse =
                response?.data?.data || response?.data;

            const orderId = Number(orderResponse?.id) || 0;

            if (orderId <= 0) {
                throw new Error(
                    "WooCommerce order could not be created."
                );
            }

            /*
             * STEP 2: Create Razorpay Order
             */
            const paymentResult =
                await service.order.createRazorpayOrder({

                    order_id: orderId,

                    user_id: Number(userInfo.id),

                });

            const paymentData =
                paymentResult?.data?.data ||
                paymentResult?.data;

            /*
             * STEP 3: Validate Razorpay Configuration
             */
            const razorpayKey = paymentData?.key_id;

            const razorpayOrderId =
                paymentData?.razorpay_order_id;

            const razorpayAmount =
                Number(paymentData?.amount);

            const razorpayCurrency =
                paymentData?.currency || "INR";

            if (!razorpayKey) {
                throw new Error(
                    "Razorpay Key ID is missing from WordPress API response."
                );
            }

            if (!razorpayKey.startsWith("rzp_")) {
                throw new Error(
                    "Invalid Razorpay Key ID."
                );
            }

            if (!razorpayOrderId) {
                throw new Error(
                    "Razorpay Order ID is missing."
                );
            }

            if (
                !Number.isFinite(razorpayAmount) ||
                razorpayAmount <= 0
            ) {
                throw new Error(
                    "Invalid Razorpay payment amount."
                );
            }

            /*
             * STEP 4: Razorpay Checkout Options
             */
            const options = {

                key: razorpayKey,

                amount: razorpayAmount,

                currency: razorpayCurrency,

                name: "R S Productions",

                description: `Order #${orderId}`,
                
                image: `https://rabisankar.com/site-logo/logo-icon.png`,

                order_id: razorpayOrderId,

                prefill: {

                    name: `${filterAddress.first_name || ""} ${filterAddress.last_name || ""}`,

                    email:
                        filterAddress.email ||
                        userInfo.email ||
                        "",

                    contact: filterAddress.phone || "",

                },

                notes: {
                    woocommerce_order_id: String(orderId),
                },

                theme: getRazorpayTheme(),

                /*
                 * Payment Success
                 */
                handler: async (paymentResponse) => {

                    await verifyRazorpayPayment(
                        paymentResponse,
                        orderId
                    );
                },

                /*
                 * Payment Modal Dismiss
                 */
                modal: {

                    ondismiss: function () {

                        if (verificationLockRef.current) return;

                        setOrderLoader(false);

                        orderLockRef.current = false;

                        showToast(
                            "Payment cancelled. You can try again.",
                            "warning"
                        );
                    },

                },

            };

            /*
             * STEP 5: Initialize Razorpay
             */
            const razorpay =
                new window.Razorpay(options);

            /*
             * Payment Failed
             */
            razorpay.on(
                "payment.failed",
                function (response) {

                    if (verificationLockRef.current) return;

                    console.error(
                        "Razorpay payment failed:",
                        response.error
                    );

                    setOrderLoader(false);

                    orderLockRef.current = false;

                    showToast(
                        response.error?.description ||
                        "Payment failed. Please try again.",
                        "error"
                    );
                }
            );

            /*
             * STEP 6: Open Razorpay Checkout
             */
            razorpay.open();

        } catch (error) {

            console.error(
                "Place order error:",
                error
            );

            const apiMessage =
                error?.response?.data?.message ||
                error?.response?.data?.data?.message ||
                error?.message ||
                "Unable to place order. Please try again.";

            showToast(apiMessage, "error");

            setOrderLoader(false);

            orderLockRef.current = false;
        }
    };

    /*
     * Address Status
     */
    const hasAddress =
        Array.isArray(address) && address.length > 0;

    const defaultAddress = getDefaultAddress();

    const hasDefaultAddress = Boolean(defaultAddress);

    /*
     * Disable Place Order Button
     */
    const disablePlaceOrder =
        orderLoader ||
        paymentVerifying ||
        addressLoading ||
        !hasAddress ||
        !hasDefaultAddress ||
        !razorpayLoaded ||
        paymentLoading;

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

                                {/* DELIVERY ADDRESS */}

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

                                    {addressLoading ? (

                                        <div className="text-center py-5">

                                            <Spinner
                                                centered={true}
                                                color="primary"
                                                label="Loading addresses..."
                                            />

                                        </div>

                                    ) : !hasAddress ? (

                                        <div className="card border-0 shadow-sm rounded-4 text-center p-4">

                                            <i className="bi bi-geo-alt text-primary fs-1 mb-3"></i>

                                            <h5>
                                                No Delivery Address Found
                                            </h5>

                                            <p className="text-muted">
                                                Add your delivery address to continue.
                                            </p>

                                            <Link
                                                to="/my-account/addresses"
                                                className="btn btn-primary rounded-pill"
                                            >
                                                Add Your First Address
                                            </Link>

                                        </div>

                                    ) : !hasDefaultAddress ? (

                                        <div className="alert alert-warning">
                                            Please select a default delivery address.
                                        </div>

                                    ) : (

                                        <div className="border border-success bg-success-subtle rounded-3 p-3">

                                            <div className="d-flex justify-content-between mb-3">

                                                <h6 className="fw-semibold">
                                                    {defaultAddress.label || "Address"}
                                                </h6>

                                                <span className="badge bg-success">
                                                    Default
                                                </span>

                                            </div>

                                            <div className="fw-semibold mb-2">
                                                {defaultAddress.first_name}{" "}
                                                {defaultAddress.last_name}
                                            </div>

                                            <div className="small text-secondary mb-2">

                                                {defaultAddress.address_1}

                                                <br />

                                                {defaultAddress.city},{" "}
                                                {defaultAddress.state}

                                                <br />

                                                {defaultAddress.country === "IN"
                                                    ? "India"
                                                    : defaultAddress.country}{" "}
                                                - {defaultAddress.postcode}

                                            </div>

                                            <div className="small text-secondary">

                                                <i className="bi bi-telephone me-2"></i>

                                                {defaultAddress.phone}

                                            </div>

                                            <Link
                                                to="/my-account/addresses"
                                                className="btn btn-outline-success btn-sm rounded-pill mt-3"
                                            >
                                                <i className="bi bi-pencil me-1"></i>
                                                Manage Addresses
                                            </Link>

                                        </div>

                                    )}

                                </div>

                                {/* YOUR ORDER */}

                                {Array.isArray(itmes) && itmes.length > 0 && (

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
                                                                <th>Product</th>
                                                                <th className="text-end">
                                                                    Subtotal
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>

                                                            {itmes.map((item, index) => (

                                                                <tr
                                                                    key={`${item.productId}-${item.variantId}-${index}`}
                                                                >

                                                                    <td>

                                                                        <Link
                                                                            className="text-decoration-none text-primary"
                                                                            to={`/product-details/${item.productId}/variants/${item.variantId}`}
                                                                        >
                                                                            {item.name} × {item.quantity}
                                                                        </Link>

                                                                    </td>

                                                                    <td className="text-end">
                                                                        ₹{" "}
                                                                        {(
                                                                            Number(item.price) *
                                                                            Number(item.quantity)
                                                                        ).toFixed(2)}
                                                                    </td>

                                                                </tr>

                                                            ))}

                                                            <tr>
                                                                <td>Subtotal</td>
                                                                <td className="text-end">
                                                                    ₹{Number(totalAmount).toFixed(2)}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>Tax (18%)</td>
                                                                <td className="text-end">
                                                                    ₹{(
                                                                        Number(taxWithAmount.total) -
                                                                        Number(totalAmount)
                                                                    ).toFixed(2)}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <strong>Total</strong>
                                                                </td>

                                                                <td className="text-end">
                                                                    <strong>
                                                                        ₹{Number(taxWithAmount.total).toFixed(2)}
                                                                    </strong>
                                                                </td>
                                                            </tr>

                                                        </tbody>

                                                    </table>

                                                </div>

                                                {/* RAZORPAY LOADING */}

                                                {paymentLoading && (

                                                    <div className="alert alert-light border small">

                                                        <Spinner
                                                            size="sm"
                                                            color="primary"
                                                        />

                                                        <span className="ms-2">
                                                            Loading Razorpay payment gateway...
                                                        </span>

                                                    </div>

                                                )}

                                                {/* RAZORPAY ERROR */}

                                                {!paymentLoading && !razorpayLoaded && (

                                                    <div className="alert alert-danger small">

                                                        <i className="bi bi-exclamation-circle me-2"></i>

                                                        Payment gateway could not be loaded.
                                                        Please refresh the page.

                                                    </div>

                                                )}

                                                {/* PLACE ORDER */}

                                                <button
                                                    type="button"
                                                    className="btn custom-btn btn-primary w-100"
                                                    onClick={onPlaceOrder}
                                                    disabled={disablePlaceOrder}
                                                >

                                                    {orderLoader && (
                                                        <Spinner
                                                            size="sm"
                                                            color="white"
                                                        />
                                                    )}

                                                    {orderLoader
                                                        ? " Processing Payment..."
                                                        : paymentLoading
                                                        ? " Loading Payment..."
                                                        : " Pay Now"}

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

            {/* FULL PAGE PAYMENT VERIFICATION OVERLAY */}

            {paymentVerifying && (

                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{
                        zIndex: 99999,
                        backgroundColor: "rgba(255, 255, 255, 0.97)",
                    }}
                >

                    <div
                        className="text-center p-4"
                        style={{
                            maxWidth: "450px",
                            width: "100%",
                        }}
                    >

                        <div className="mb-4">

                            <div
                                className="spinner-border text-primary"
                                style={{
                                    width: "3.5rem",
                                    height: "3.5rem",
                                }}
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Verifying payment...
                                </span>
                            </div>

                        </div>

                        <h4 className="fw-bold mb-3">
                            Verifying Your Payment
                        </h4>

                        <p className="text-muted mb-4">
                            Please wait while we securely verify your payment.
                            This may take a few moments.
                        </p>

                        <div className="alert alert-warning small text-start">

                            <i className="bi bi-shield-lock me-2"></i>

                            Please do not refresh, close, or navigate away
                            from this page.

                        </div>

                        <div className="text-secondary small">

                            <i className="bi bi-shield-check me-1"></i>

                            Your payment is being securely verified.

                        </div>

                    </div>

                </div>

            )}

            {/* TOAST */}

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
