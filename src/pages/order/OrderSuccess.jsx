import React, { lazy, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { clearCart } from '../../features/cart/cartSlice';
import { formatDate } from '../../utils/formatDate';
import { verifyCashfreePayment } from '../../api/cashfreeService';
import { service } from '../../api/service';

const Toast = lazy(()=>
    import('../../components/Toast')
);

const Spinner = lazy(() => 
    import("../../components/Spinner")
);


export default function OrderSuccess() {
    const { order_id, user_id } = useParams();

    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const [loader, setLoader] = useState(true);
    const [paymentData, setPaymentData] = useState(null);

    const [downloadLoader, setDownloadLoader] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({
            show: true,
            message,
            type,
        });
    };

    const closeToast = () => {
        setToast((prev) => ({
            ...prev,
            show: false,
        }));
    };

    useEffect(() => {
        let cancelled = false;

        if (!user_id || !order_id) {
            navigate('/my-account', { replace: true });
            return;
        }

        const verifyPayment = async () => {
            try {
                setLoader(true);
                setMessage('');

                const requestData = {
                    user_id,
                    order_id,
                };

                const response = await verifyCashfreePayment(requestData);

                if (cancelled) return;

                setPaymentData(response);
                setStatus(response?.payment_status || 'failed');

                /*
                 * Clear cart only when payment is successful.
                 */
                if (
                    response?.payment_status?.toLowerCase() === 'success' ||
                    response?.payment_status?.toLowerCase() === 'paid'
                ) {
                    dispatch(clearCart());
                }
            } catch (error) {
                if (cancelled) return;

                setStatus('failed');
                setMessage(
                    error?.message ||
                    'We could not verify your payment. Please try again.'
                );
            } finally {
                if (!cancelled) {
                    setLoader(false);
                }
            }
        };

        verifyPayment();

        return () => {
            cancelled = true;
        };
    }, [order_id, user_id, navigate, dispatch]);

    const formattedPaymentStatus = paymentData?.payment_status
        ? paymentData.payment_status.charAt(0).toUpperCase() +
          paymentData.payment_status.slice(1).toLowerCase()
        : '';

    const isPaymentSuccess =
        status?.toLowerCase() === 'success' ||
        status?.toLowerCase() === 'paid';
    
    const downloadFile = async()=>{
        if(paymentData.payment_status === "SUCCESS" && paymentData.transaction_id ) {
            setDownloadLoader(true);
            const {order_id} = paymentData;
            let tokenData = {
                user_id,
                order_id
            }
            try {
                const response = await service.order.generate_token(tokenData);
                const tokenResponse =  response.data;
                if(tokenResponse.success === true || tokenResponse.token) {
                    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                    const downloadWindow = window.open('about:blank', '_blank');
                    const downloadUrl = new URL(`${API_BASE_URL}/custom-store/v1/order/download-image`);
                    downloadUrl.searchParams.set('token', tokenResponse.token);
                    downloadWindow.location.replace(downloadUrl.toString());
                }
            } catch (error) {
                if(error) {
                    showToast(
                        error.message,
                        "error"
                    );
                }
            } finally {
                setDownloadLoader(false);
            }
            
        }
        
    }

    /*
     * Payment verification loader
     */
    if (loader) {
        return (
            <section className="order-success-section">
                <div className="success-container">

                    <div className="payment-verification-card text-center">

                        <div className="payment-verification-icon">
                            <div className="verification-spinner"></div>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="currentColor"
                                className="bi bi-shield-check"
                                viewBox="0 0 16 16"
                            >
                                <path d="M5.072.56a1 1 0 0 1 .856 0l4.5 2.25A1 1 0 0 1 11 3.694v3.897c0 2.69-1.405 5.088-3.5 6.409a7.7 7.7 0 0 1-1.5.7 7.7 7.7 0 0 1-1.5-.7C2.405 12.679 1 10.281 1 7.591V3.694a1 1 0 0 1 .572-.884z" />

                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M5.854 8.646a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L7 9.793z"
                                />
                            </svg>
                        </div>

                        <h2 className="payment-verification-title">
                            Verifying your payment
                        </h2>

                        <p className="payment-verification-message">
                            Please wait while we confirm your payment.
                            <br />
                            Do not close or refresh this page.
                        </p>

                        <div className="payment-progress">
                            <div className="payment-progress-bar"></div>
                        </div>

                        <div className="payment-verification-status">
                            <span className="status-dot"></span>
                            Securely processing your order
                        </div>

                        <small className="payment-verification-note">
                            This usually takes only a few seconds.
                        </small>

                    </div>

                </div>
            </section>
        );
    }

    /*
     * Payment verification failed
     */
    if (!isPaymentSuccess) {
        return (
            <section className="order-success-section">
                <div className="success-container">

                    <div className="payment-failed-card text-center">

                        <div className="payment-failed-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="38"
                                height="38"
                                fill="currentColor"
                                className="bi bi-exclamation-lg"
                                viewBox="0 0 16 16"
                            >
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.9.9 0 1 1 1.8 0l-.35 4.2a.55.55 0 0 1-1.1 0z" />
                            </svg>
                        </div>

                        <h2>Payment Verification Failed</h2>

                        <p>
                            {message ||
                                'We were unable to confirm your payment. Please check your order status or contact support.'}
                        </p>

                        <div className="payment-failed-order">
                            <span>Order Number</span>
                            <strong>
                                #{`PHOTO-${order_id}`}
                            </strong>
                        </div>

                        <div className="success-buttons">

                            <Link
                                to="/my-account"
                                className="btn-primary-custom"
                            >
                                View My Orders
                            </Link>

                            <Link
                                to="/contact-us"
                                className="btn-outline-custom"
                            >
                                Contact Support
                            </Link>

                        </div>

                    </div>

                </div>
            </section>
        );
    }

    /*
     * Successful payment
     */
    return (
        <>
            <section className="order-success-section">
                <div className="success-container">

                    <div className="success-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-check2"
                            viewBox="0 0 16 16"
                        >
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
                        </svg>
                    </div>

                    <h1>Order Successful!</h1>

                    <p className="success-message">
                        Thank you for your purchase. Your order has been
                        successfully placed and your photos are ready to download.
                    </p>

                    <div className="order-info">

                        <div className="info-item">
                            <span>Order Number</span>
                            <strong>
                                #{`PHOTO-${order_id}`}
                            </strong>
                        </div>

                        <div className="info-item">
                            <span>Order Date</span>
                            <strong>
                                {formatDate(paymentData?.created_at)}
                            </strong>
                        </div>

                        <div className="info-item">
                            <span>Payment Status</span>

                            <strong className="paid">
                                <i className="fa-solid fa-circle-check me-1"></i>
                                {formattedPaymentStatus}
                            </strong>
                        </div>

                        <div className="info-item">
                            <span>Total Amount</span>

                            <strong>
                                ₹{paymentData?.total}
                            </strong>
                        </div>

                    </div>

                    <div className="download-box">

                        <div className="download-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-box-arrow-down"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"
                                />

                                <path
                                    fillRule="evenodd"
                                    d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"
                                />
                            </svg>
                        </div>

                        <div>
                            <h3>Your photos are ready</h3>

                            <p>
                                You can download your purchased photos from your
                                account.
                            </p>
                        </div>

                    </div>

                    <div className="success-buttons">

                        {
                            (paymentData.transaction_id && paymentData.payment_status === "SUCCESS") &&
                                <button
                                    
                                    className="btn-primary-custom"
                                    onClick={downloadFile}
                                    disabled={downloadLoader}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        className="bi bi-box-arrow-down"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"
                                        />

                                        <path
                                            fillRule="evenodd"
                                            d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"
                                        />
                                    </svg>
                                    {
                                        downloadLoader ? "Preparing Download..." : "View Downloads"
                                    }

                                    
                            </button>
                        }
                        

                        <Link
                            to="/"
                            className="btn-outline-custom"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-images"
                                viewBox="0 0 16 16"
                            >
                                <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />

                                <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a.5.5 0 0 1-1-1z" />
                            </svg>

                            Continue Shopping
                        </Link>

                    </div>

                    <p className="support-text">
                        Need help with your order?
                        <Link
                            to="/contact-us"
                            className="ms-1"
                        >
                            Contact Support
                        </Link>
                    </p>

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