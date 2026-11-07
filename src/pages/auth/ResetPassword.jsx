import React, { lazy, useEffect, useState } from 'react';
import { STATIC_IMAGE } from '../../utils/staticImage';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import '../../assets/css/password-requirement.css';
import { service } from '../../api/service';
import { useSelector } from 'react-redux';


const Spinner = lazy(() => 
    import('../../components/Spinner')
);
const Toast = lazy(() => 
    import('../../components/Toast')
);

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const {authToken} =  useSelector((state)=>state.user);

    const queryParams = new URLSearchParams(location.search);
    const key = queryParams.get('key') || '';
    const login = queryParams.get('login') || '';

    const [formData, setFormData] = useState({
        password: '',
        confirm_password: ''
    });

    const [touched, setTouched] = useState({
        password: false,
        confirm_password: false
    });

    const [loader, setLoader] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success',
    });
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

    useEffect(()=>{
        if(authToken !== null) {
            navigate(`/my-account`);
        }
    }, [authToken]);

    // Validate password requirements in real time.
    const passwordRules = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        special: /[^A-Za-z0-9\s]/.test(formData.password)
    };

    const completedRules = Object.values(passwordRules).filter(Boolean).length;
    const totalRules = Object.keys(passwordRules).length;

    const isPasswordValid = completedRules === totalRules;
    const passwordStrength = (completedRules / totalRules) * 100;

    const confirmPasswordError =
        formData.confirm_password &&
        formData.password !== formData.confirm_password
            ? 'Passwords do not match.'
            : '';

    const showPasswordErrors = touched.password || submitAttempted;
    const showConfirmError = touched.confirm_password || submitAttempted;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBlur = (event) => {
        const { name } = event.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitAttempted(true);

        if (!key.trim() || !login.trim()) {
            navigate('/sign-in', { replace: true });
            return;
        }

        if (
            !isPasswordValid ||
            !formData.confirm_password ||
            formData.password !== formData.confirm_password
        ) {
            return;
        }

        try {
            setLoader(true);
            const payload = {
                key,
                login,
                password : formData.password,
                confirm_password : formData.confirm_password
            };

            const response = await service.customer.resetPassword(payload);
            const resetResponse = response.data;
            if(resetResponse.success) {
                showToast(
                    resetResponse.message,
                    'success'
                );
                setTimeout(()=>{
                    navigate(`/sign-in`, {
                        replace : true
                    });
                }, 1000);
            } else {
                showToast(
                    resetResponse.message,
                    'error'
                );
            }
            
        } catch (error) {
            if(error) {
                showToast(
                    error.message,
                    'error'
                );
            }
        } finally {
            setLoader(false);
        }
    };

    const passwordRequirements = [
        ['length', '8+ characters'],
        ['uppercase', 'Uppercase letter (A-Z)'],
        ['lowercase', 'Lowercase letter (a-z)'],
        ['number', 'At least one number'],
        ['special', 'Special character']
    ];

    return (
        <>
            <main className="login-page">
                <div className="login-card">
                    <div className="login-logo">
                        <img src={STATIC_IMAGE.LOGO} alt="Logo" />
                    </div>

                    <div className="text-center">
                        <h1>Reset Password</h1>
                        <p className="login-subtitle">
                            Create a new password for your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate>
                        {/* New password */}
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                New Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={`form-control ${
                                    showPasswordErrors
                                        ? isPasswordValid
                                            ? 'is-valid'
                                            : 'is-invalid'
                                        : ''
                                }`}
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            {/* Password requirements checklist */}
                            {formData.password.length > 0 && (
                                <div className="password-requirements mt-3">
                                    <div className="password-requirements-title">
                                        <i className="bi bi-shield-lock me-2"></i>
                                        Password must contain:
                                    </div>

                                    <div className="password-rules-grid">
                                        {passwordRequirements.map(
                                            ([rule, label]) => (
                                                <div
                                                    key={rule}
                                                    className={`password-rule ${
                                                        passwordRules[rule]
                                                            ? 'rule-valid'
                                                            : ''
                                                    }`}
                                                >
                                                    <i
                                                        className={`bi ${
                                                            passwordRules[rule]
                                                                ? 'bi-check-circle-fill'
                                                                : 'bi-circle'
                                                        }`}
                                                    ></i>

                                                    <span>{label}</span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Password strength indicator */}
                                    <div className="password-strength mt-3">
                                        <div className="password-strength-header">
                                            <span>Password strength</span>

                                            <span
                                                className={
                                                    isPasswordValid
                                                        ? 'text-success fw-semibold'
                                                        : 'text-muted'
                                                }
                                            >
                                                {isPasswordValid
                                                    ? 'Strong'
                                                    : 'Requirements pending'}
                                            </span>
                                        </div>

                                        <div
                                            className="progress password-progress"
                                            role="progressbar"
                                            aria-label="Password requirements progress"
                                            aria-valuenow={passwordStrength}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            <div
                                                className={`progress-bar ${
                                                    isPasswordValid
                                                        ? 'bg-success'
                                                        : 'bg-primary'
                                                }`}
                                                style={{
                                                    width: `${passwordStrength}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showPasswordErrors && !isPasswordValid && (
                                <div className="invalid-feedback d-block">
                                    Please meet all password requirements.
                                </div>
                            )}
                        </div>

                        {/* Confirm password */}
                        <div className="mb-3">
                            <label
                                htmlFor="confirm_password"
                                className="form-label"
                            >
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                className={`form-control ${
                                    showConfirmError &&
                                    formData.confirm_password
                                        ? confirmPasswordError
                                            ? 'is-invalid'
                                            : 'is-valid'
                                        : ''
                                }`}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            {showConfirmError &&
                                !formData.confirm_password && (
                                    <div className="invalid-feedback d-block">
                                        Confirm password is required.
                                    </div>
                                )}

                            {showConfirmError && confirmPasswordError && (
                                <div className="invalid-feedback d-block">
                                    {confirmPasswordError}
                                </div>
                            )}

                            {formData.confirm_password &&
                                !confirmPasswordError && (
                                    <div className="text-success small mt-2">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        Passwords match.
                                    </div>
                                )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="btn custom-btn btn-primary login-btn"
                            disabled={loader}
                        >
                            {loader ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        aria-hidden="true"
                                    ></span>
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        <div className="register-text mt-3">
                            Remember your password?
                            <Link className="ms-2" to="/sign-in">
                                Back to Login
                            </Link>
                        </div>
                    </form>
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