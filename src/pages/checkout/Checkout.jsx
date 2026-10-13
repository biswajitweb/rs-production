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
    const [addressLoading, setAddressLoading] = useState(true);
    {/** For cash free */}
    const [cashfreeReady, setCashfreeReady] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{
        let isMounted = true;

        loadCashfreeSDK()
            .then(() => {
                if (isMounted) {
                    setCashfreeReady(true);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err.message);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);
    
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
        } catch (error) {
            console.error("Decrypt error:", error);
        }
    };

    useEffect(() => {
        decryptAuth();
    }, [authToken]);

    /*
     * Place order
     */
    const onPlaceOrder = async () => {
        /*
         * Prepare line items
         */
        const result = itmes.map(({ productId, quantity }) => ({
            product_id: productId,
            quantity,
        }));

        const getDefaultAddress = address.find(
            (item) =>
                item.is_default === true ||
                item.is_default === 1 ||
                item.is_default === "1"
        );

        const { label, is_default, id, ...filterAddress } = getDefaultAddress || {};

        /*
         * Order payload
         */
        const orderData = {
            customer_id: userInfo.id,

            payment_method: "cod",

            payment_method_title: "Cash on Delivery",

            tax_rate: 18,

            billing: filterAddress,

            shipping: filterAddress,

            line_items: result,

            customer_note: '',
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

                let paymentData = {
                    user_id : userInfo.id,
                    order_id : orderId,
                };

                

                // Create Cashfree payment session through WordPress.
                const result = await createCashfreePayment(paymentData);

                if (!result.payment_session_id) {
                    throw new Error("Payment session was not returned.");
                }

                // Check that the Cashfree SDK loaded.
                if (typeof window.Cashfree !== "function") {
                    throw new Error("Cashfree SDK is not loaded.");
                }
                //Initialize sandbox checkout.

                const cashfree = window.Cashfree({
                    mode: result.mode,
                });

                //Open the hosted Cashfree checkout.
                 const checkoutResponse = await cashfree.checkout({
                    paymentSessionId: result.payment_session_id,
                    redirectTarget: "_self",
                });

                console.log(checkoutResponse);
                

            
                

                
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
            setAddressLoading(true);
            await dispatch(allAddressList(userId));
        } catch (error) {
            if(error) {
                console.log(error.message);
            }
        } finally {
            setAddressLoading(false);
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
                                        {
                                            addressLoading ? (
                                                <div className="text-center w-100 py-5">
                                                    <Spinner
                                                        centered={true}
                                                        color="primary"
                                                        label="Loading addresses..."
                                                    />
                                                </div>

                                                
                                            ) : !Array.isArray(address) || address.length === 0 ? (
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
                                                <>
                                                <div className="row g-3">
                                                    {address
                                                        .filter(
                                                            (item) =>
                                                                item.is_default === true ||
                                                                item.is_default === 1 ||
                                                                item.is_default === "1"
                                                        )
                                                        .map((item) => {
                                                            const isDefault = true;
                                                            const isOffice = item.label === "Office";

                                                            return (
                                                                <div className="col-12 col-md-12" key={item.id}>
                                                                    <div className="h-100 border border-success bg-success-subtle rounded-3 p-3">
                                                                        {/* Card Header */}
                                                                        <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <div className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 bg-white text-success"
                                                                                    style={{ width: "42px", height: "42px" }}
                                                                                >
                                                                                    <i
                                                                                        className={`bi ${
                                                                                            isOffice
                                                                                                ? "bi-building"
                                                                                                : "bi-house-door"
                                                                                        } fs-5`}
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </div>

                                                                                <div>
                                                                                    <h6 className="mb-1 fw-semibold">
                                                                                        {item.label || "Address"}
                                                                                    </h6>
                                                                                    <div className="small text-muted">
                                                                                        {isOffice
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

                                                                        {/* Recipient */}
                                                                        <div className="mb-3">
                                                                            <div className="fw-semibold text-dark mb-2">
                                                                                {item.first_name} {item.last_name}
                                                                            </div>

                                                                            <div className="d-flex align-items-start gap-2 mb-2">
                                                                                <i className="bi bi-geo-alt text-muted mt-1" />
                                                                                <div className="small text-secondary text-break">
                                                                                    <div>{item.address_1}</div>
                                                                                    <div>
                                                                                        {item.city}, {item.state}
                                                                                    </div>
                                                                                    <div>
                                                                                        {item.country === "IN"
                                                                                            ? "India"
                                                                                            : item.country}{" "}
                                                                                        - {item.postcode}
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="d-flex align-items-center gap-2 small text-secondary">
                                                                                <i className="bi bi-telephone text-muted" />
                                                                                <span>{item.phone}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                                </>
                                            )
                                        }
                                        
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
                                                <div className="table-responsive">
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
                                                </div>
                                                    

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