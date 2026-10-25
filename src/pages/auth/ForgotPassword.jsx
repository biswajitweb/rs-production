import React, { lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import { STATIC_IMAGE } from '../../utils/staticImage';
import { validateField } from '../../utils/validateField';
import { service } from '../../api/service';

const Spinner = lazy(() => import('../../components/Spinner'));
const Toast = lazy(() => import('../../components/Toast'));

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    const [touch, setTouched] = useState({
        email: false,
    });

    const [loader, setLoader] = useState(false);
    const [errors, setErrors] = useState({});

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success',
    });

    const handleBlur = (e) => {
        const { name, value } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value.trim()),
        }));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;

        setEmail(value);

        if (touch.email) {
            setErrors((prev) => ({
                ...prev,
                email: validateField('email', value.trim()),
            }));
        }
    };

    const showToast = (message, type = 'success') => {
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

    const onSendReset = async (e) => {
        e.preventDefault();

        setTouched({
            email: true,
        });

        const newErrors = {
            email: validateField('email', email.trim()),
        };

        setErrors(newErrors);

        const hasError = Object.values(newErrors).some(
            (error) => Boolean(error)
        );

        if (hasError) {
            return;
        }

        try {
            setLoader(true);
            const response = await service.customer.forgotPassword({
                email
            });
           const linkResponse = response.data;
           if(linkResponse.success === true) {
            showToast(
               linkResponse.message,
                'success'
            );
           } else {
            showToast(
               linkResponse.message,
                'error'
            );
           }
        } catch (error) {
            showToast(
                error?.response?.data?.message ||
                    'Unable to send the reset link. Please try again.',
                'error'
            );
        } finally {
            setLoader(false);
            setEmail('');
        }
    };

    return (
        <>
            <main className="login-page">
                <div className="login-card">
                    <div className="login-logo">
                        <img
                            src={STATIC_IMAGE.LOGO}
                            alt="Logo"
                        />
                    </div>

                    <div className="text-center">
                        <h1>Forgot Password?</h1>

                        <p className="login-subtitle">
                            Enter your registered email address to reset
                            your password.
                        </p>
                    </div>

                    <form onSubmit={onSendReset} noValidate>
                        <div className="mb-3">
                            <label
                                htmlFor="email"
                                className="form-label"
                            >
                                Email Address
                                <span className="text-danger"> *</span>
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={handleBlur}
                                className={`form-control ${
                                    touch.email && errors.email
                                        ? 'is-invalid'
                                        : touch.email && email.trim()
                                          ? 'is-valid'
                                          : ''
                                }`}
                                placeholder="Enter your email address"
                                autoComplete="email"
                                disabled={loader}
                            />

                            {touch.email && errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn custom-btn btn-primary login-btn"
                            disabled={loader}
                        >
                            {loader ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <div className="register-text mt-3 text-center">
                        Remember your password?

                        <Link className="ms-2" to="/sign-in">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </main>

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
