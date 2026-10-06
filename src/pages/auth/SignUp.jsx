import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { FORM_ERROR_STYLE } from '../../utils/formStyles';
import { service } from '../../api/service';

export default function SignUp() {

    const { authToken } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (authToken !== null) {
            navigate(`/my-account`);
        }
    }, [authToken, navigate]);

    /**
     * Initial Form Data
     */
    const initialFormData = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        terms: false
    };

    /**
     * Initial Touched Data
     */
    const initialTouched = {
        first_name: false,
        last_name: false,
        email: false,
        password: false,
        confirm_password: false,
        terms: false
    };

    const FIELD_ERRORS = {
        first_name: "First Name is required.",
        last_name: "Last Name is required.",
        email: "Email address is required.",
        password: "Password is required.",
        confirm_password: "Confirm Password is required.",
        terms: "You must agree to the Terms & Conditions."
    };

    const REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "email",
        "password",
        "confirm_password"
    ];

    const [fromData, setFromData] = useState(initialFormData);
    const [touched, setTouched] = useState(initialTouched);
    const [errors, setErrors] = useState({});
    const [isLoader, setIsLoader] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    /**
     * Handle input change
     */
    const handleOnChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFromData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        // Remove error while user fixes the field
        if (name === "terms" && checked) {
            setErrors((prev) => {
                const updatedErrors = { ...prev };
                delete updatedErrors.terms;
                return updatedErrors;
            });
        }
    };

    /**
     * Handle Blur
     */
    const handleOnBlur = (event) => {
        const { name, value, type, checked } = event.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true
        }));

        let error = "";

        /**
         * Terms validation
         */
        if (name === "terms") {
            if (!checked) {
                error = FIELD_ERRORS.terms;
            }
        }

        /**
         * Required validation
         */
        if (type !== "checkbox" && String(value).trim() === "") {
            error = FIELD_ERRORS[name];
        }

        /**
         * Email validation
         */
        if (
            name === "email" &&
            value.trim() !== "" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
            error = "Please enter a valid email address.";
        }

        /**
         * Confirm password validation
         */
        if (
            name === "confirm_password" &&
            value.trim() !== "" &&
            value !== fromData.password
        ) {
            error = "Passwords do not match.";
        }

        setErrors((prev) => {
            const updatedErrors = { ...prev };

            if (error) {
                updatedErrors[name] = error;
            } else {
                delete updatedErrors[name];
            }

            return updatedErrors;
        });
    };

    /**
     * Handle Register
     */
    const onHandleRegister = async() => {

        setErrorMessage('');
        // Mark all fields as touched
        setTouched({
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            confirm_password: true,
            terms: true
        });

        const validationErrors = {};

        /**
         * Required field validation
         */
        REQUIRED_FIELDS.forEach((field) => {
            const value = fromData[field];

            if (
                value === null ||
                value === undefined ||
                String(value).trim() === ""
            ) {
                validationErrors[field] = FIELD_ERRORS[field];
            }
        });

        /**
         * Email validation
         */
        if (
            fromData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromData.email)
        ) {
            validationErrors.email = "Please enter a valid email address.";
        }

        /**
         * Confirm password validation
         */
        if (
            fromData.confirm_password &&
            fromData.password !== fromData.confirm_password
        ) {
            validationErrors.confirm_password = "Passwords do not match.";
        }

        /**
         * Terms validation
         */
        if (!fromData.terms) {
            validationErrors.terms =
                "You must agree to the Terms & Conditions.";
        }

        setErrors(validationErrors);

        // Stop registration if validation fails
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            setIsLoader(true);
            const { confirm_password, terms, ...payload } = fromData;
            const finalPayload = {
                ...payload,
                billing: {},
                shipping: {},
                username : ''
            };
            const response = await service.customer.create(finalPayload);
            const userResponse = response.data;
            if(userResponse?.data?.id > 0 ) {
                navigate(`/sign-in`, {
                    replace : true
                });
            }
           
        } catch (error) {
            if(error) {
                setErrorMessage(error.message);
            }
        } finally {
            setIsLoader(false);
        }

        
    };

    return (
        <>
            <main className="signup-page">
                <div className="signup-card">

                    {/* Logo */}
                    <div className="signup-logo">
                        RS
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-4">
                        <h1>Create Your Account</h1>

                        <p className="signup-subtitle">
                            Join our photography community and discover original images.
                        </p>
                    </div>

                    {/* First Name */}
                    <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">
                            First Name
                        </label>

                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            className="form-control"
                            placeholder="Enter first name"
                            autoComplete="off"
                            value={fromData.first_name}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            style={
                                fromData.first_name === "" && touched.first_name
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />

                        {errors.first_name && (
                            <small className="text-danger">
                                {errors.first_name}
                            </small>
                        )}
                    </div>

                    {/* Last Name */}
                    <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">
                            Last Name
                        </label>

                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            className="form-control"
                            placeholder="Enter last name"
                            autoComplete="off"
                            value={fromData.last_name}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            style={
                                fromData.last_name === "" && touched.last_name
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />

                        {errors.last_name && (
                            <small className="text-danger">
                                {errors.last_name}
                            </small>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            autoComplete="off"
                            value={fromData.email}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            style={
                                fromData.email === "" && touched.email
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />

                        {errors.email && (
                            <small className="text-danger">
                                {errors.email}
                            </small>
                        )}
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Create a password"
                            autoComplete="off"
                            value={fromData.password}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            style={
                                fromData.password === "" && touched.password
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />

                        {errors.password && (
                            <small className="text-danger">
                                {errors.password}
                            </small>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-3">
                        <label
                            htmlFor="confirmPassword"
                            className="form-label"
                        >
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirm_password"
                            className="form-control"
                            placeholder="Confirm your password"
                            autoComplete="off"
                            value={fromData.confirm_password}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                            style={
                                fromData.confirm_password === "" &&
                                touched.confirm_password
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />

                        {errors.confirm_password && (
                            <small className="text-danger">
                                {errors.confirm_password}
                            </small>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="form-check mb-1">

                        <input
                            type="checkbox"
                            id="terms"
                            name="terms"
                            className="form-check-input"
                            checked={fromData.terms}
                            onChange={handleOnChange}
                            onBlur={handleOnBlur}
                        />

                        <label
                            htmlFor="terms"
                            className="form-check-label"
                        >
                            I agree to the{" "}
                            <Link to="/terms-conditions">
                                Terms & Conditions
                            </Link>
                        </label>
                    </div>

                    {/* Terms Error */}
                    {errors.terms && (
                        <small className="text-danger d-block mb-3">
                            {errors.terms}
                        </small>
                    )}

                    {/* Signup Button */}
                    <button
                        type="button"
                        className="signup-btn"
                        onClick={onHandleRegister}
                        disabled={isLoader}
                    >
                        {isLoader ? "Creating Account..." : "Create Account"}
                    </button>

                    {
                        errorMessage && (
                            <small className="text-danger d-block mb-3">
                                {errorMessage}
                            </small>
                        )
                    }

                    {/* Login */}
                    <div className="login-text">
                        Already have an account?{" "}
                        <Link to="/sign-in">
                            Login
                        </Link>
                    </div>

                </div>
            </main>
        </>
    );
}