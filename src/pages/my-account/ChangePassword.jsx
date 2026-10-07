import React, { lazy, useState } from 'react';
import { FORM_ERROR_STYLE } from '../../utils/formStyles';

const InputField = lazy(() =>
    import('../../components/form/InputField')
);

const Button = lazy(() =>
    import('../../components/form/Button')
);

export default function ChangePassword() {

    // --------------------------------
    // Default Form Data
    // --------------------------------
    const defaultPasswordData = {
        current_password: "",
        new_password: "",
        confirm_password: ""
    };

    const REQUIRED_FIELDS = Object.keys(defaultPasswordData);

    // --------------------------------
    // Initial Touched State
    // --------------------------------
    const initialTouched = {
        current_password: false,
        new_password: false,
        confirm_password: false
    };

    // --------------------------------
    // Required Field Errors
    // --------------------------------
    const FIELD_ERRORS = {
        current_password: "Current password is required.",
        new_password: "New password is required.",
        confirm_password: "Confirm password is required."
    };

    const [formData, setFormData] = useState(defaultPasswordData);
    const [touched, setTouched] = useState(initialTouched);
    const [errors, setErrors] = useState({});
    const [loader, setLoader] = useState(false);

    // --------------------------------
    // Strong Password Validation
    // --------------------------------
    const validateStrongPassword = (password) => {

        if (!password) {
            return "New password is required.";
        }

        if (password.length < 8) {
            return "Password must be at least 8 characters.";
        }

        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }

        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }

        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number.";
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`+=;']/ .test(password)) {
            return "Password must contain at least one special character.";
        }

        return "";
    };

    // --------------------------------
    // Handle Input Change
    // --------------------------------
    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => {

            const updatedErrors = {
                ...prev
            };

            // ----------------------------
            // Current Password
            // ----------------------------
            if (name === "current_password") {

                if (value.trim()) {
                    delete updatedErrors.current_password;
                }

            }

            // ----------------------------
            // New Password
            // ----------------------------
            if (name === "new_password") {

                if (!value.trim()) {

                    updatedErrors.new_password =
                        FIELD_ERRORS.new_password;

                } else {

                    const passwordError =
                        validateStrongPassword(value);

                    if (passwordError) {
                        updatedErrors.new_password =
                            passwordError;
                    } else {
                        delete updatedErrors.new_password;
                    }
                }

                // Revalidate confirm password
                if (formData.confirm_password) {

                    if (
                        value !== formData.confirm_password
                    ) {
                        updatedErrors.confirm_password =
                            "Passwords do not match.";
                    } else {
                        delete updatedErrors.confirm_password;
                    }
                }
            }

            // ----------------------------
            // Confirm Password
            // ----------------------------
            if (name === "confirm_password") {

                if (!value.trim()) {

                    updatedErrors.confirm_password =
                        FIELD_ERRORS.confirm_password;

                } else if (
                    value !== formData.new_password
                ) {

                    updatedErrors.confirm_password =
                        "Passwords do not match.";

                } else {

                    delete updatedErrors.confirm_password;
                }
            }

            return updatedErrors;
        });
    };

    // --------------------------------
    // Handle Blur
    // --------------------------------
    const handleBlur = (event) => {

        const {
            name,
            value
        } = event.target;

        // Mark field as touched
        setTouched((prev) => ({
            ...prev,
            [name]: true
        }));

        let errorMessage = "";

        // ----------------------------
        // Required Validation
        // ----------------------------
        if (!value.trim()) {

            errorMessage = FIELD_ERRORS[name];

        }

        // ----------------------------
        // New Password Validation
        // ----------------------------
        if (
            name === "new_password" &&
            value.trim()
        ) {

            errorMessage =
                validateStrongPassword(value);
        }

        // ----------------------------
        // Confirm Password Validation
        // ----------------------------
        if (
            name === "confirm_password" &&
            value.trim()
        ) {

            if (
                value !== formData.new_password
            ) {

                errorMessage =
                    "Passwords do not match.";
            }
        }

        // ----------------------------
        // Set Error
        // ----------------------------
        setErrors((prev) => {

            const updatedErrors = {
                ...prev
            };

            if (errorMessage) {

                updatedErrors[name] =
                    errorMessage;

            } else {

                delete updatedErrors[name];
            }

            return updatedErrors;
        });
    };

    // --------------------------------
    // Submit / Update Password
    // --------------------------------
    const onPasswordUpdate = async () => {

        // --------------------------------
        // Mark All Fields as Touched
        // --------------------------------
        const touchedFields =
            REQUIRED_FIELDS.reduce(
                (acc, field) => {

                    acc[field] = true;

                    return acc;

                },
                {}
            );

        setTouched(touchedFields);

        const validationErrors = {};

        // --------------------------------
        // Required Field Validation
        // --------------------------------
        REQUIRED_FIELDS.forEach((field) => {

            const value = formData[field];

            if (
                value === null ||
                value === undefined ||
                String(value).trim() === ""
            ) {

                validationErrors[field] =
                    FIELD_ERRORS[field];
            }
        });

        // --------------------------------
        // Strong Password Validation
        // --------------------------------
        if (
            formData.new_password &&
            formData.new_password.trim()
        ) {

            const passwordError =
                validateStrongPassword(
                    formData.new_password
                );

            if (passwordError) {

                validationErrors.new_password =
                    passwordError;
            }
        }

        // --------------------------------
        // Confirm Password Validation
        // --------------------------------
        if (
            formData.confirm_password &&
            formData.confirm_password.trim()
        ) {

            if (
                formData.new_password !==
                formData.confirm_password
            ) {

                validationErrors.confirm_password =
                    "Passwords do not match.";
            }
        }

        // --------------------------------
        // Stop if Validation Failed
        // --------------------------------
        if (
            Object.keys(validationErrors).length > 0
        ) {

            setErrors(validationErrors);

            return;
        }

        // --------------------------------
        // API Request
        // --------------------------------
        try {

            setLoader(true);

            const {
                confirm_password,
                ...payload
            } = formData;

            console.log("Password Payload:", payload);

            /*
            Example:

            await changePassword(payload);
            */

        } catch (error) {

            console.error(
                "Change password error:",
                error?.message
            );

        } finally {

            setLoader(false);
        }
    };

    return (
        <>
            {/* --------------------------------
                Page Header
            -------------------------------- */}
            <div className="page-header">

                <div>

                    <h2>
                        Change Password
                    </h2>

                    <p>
                        Update your account password.
                    </p>

                </div>

            </div>


            {/* --------------------------------
                Account Card
            -------------------------------- */}
            <div className="account-card">

                <div className="password-box">

                    <p className="password-help">
                        For your security, use a strong
                        password that you don't use on
                        another website.
                    </p>


                    {/* --------------------------------
                        Current Password
                    -------------------------------- */}
                    <div className="form-group">

                        <InputField
                            label="Current Password"
                            name="current_password"
                            type="password"
                            placeholder="Enter current password"
                            value={
                                formData.current_password
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={
                                touched.current_password &&
                                errors.current_password
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            required
                            error={
                                errors.current_password
                            }
                        />

                    </div>


                    {/* --------------------------------
                        New Password
                    -------------------------------- */}
                    <div className="form-group">

                        <InputField
                            label="New Password"
                            name="new_password"
                            type="password"
                            placeholder="Enter new password"
                            value={
                                formData.new_password
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={
                                touched.new_password &&
                                errors.new_password
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            required
                            error={
                                errors.new_password
                            }
                        />

                    </div>


                    {/* --------------------------------
                        Confirm Password
                    -------------------------------- */}
                    <div className="form-group">

                        <InputField
                            label="Confirm Password"
                            name="confirm_password"
                            type="password"
                            placeholder="Enter confirm password"
                            value={
                                formData.confirm_password
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={
                                touched.confirm_password &&
                                errors.confirm_password
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            required
                            error={
                                errors.confirm_password
                            }
                        />

                    </div>


                    {/* --------------------------------
                        Update Button
                    -------------------------------- */}
                    <Button
                        type="button"
                        className="btn-primary"
                        onClick={onPasswordUpdate}
                        loading={loader}
                        variant="primary"
                        loadingText="Updating Password..."
                    >
                        Update Password
                    </Button>

                </div>

            </div>
        </>
    );
}