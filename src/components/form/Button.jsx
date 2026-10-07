import React from "react";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    size = "",
    onClick,
    disabled = false,
    loading = false,
    loadingText = "Loading...",
    icon = "",
    iconPosition = "left",
    className = "",
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn-${variant} ${
                size ? `btn-${size}` : ""
            } ${className}`}
        >
            {loading ? (
                <>
                    <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                    />

                    {loadingText}
                </>
            ) : (
                <>
                    {icon && iconPosition === "left" && (
                        <i className={`${icon} me-1`} />
                    )}

                    {children}

                    {icon && iconPosition === "right" && (
                        <i className={`${icon} ms-1`} />
                    )}
                </>
            )}
        </button>
    );
}