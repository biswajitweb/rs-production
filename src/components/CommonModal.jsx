
import React from "react";

export default function CommonModal({
    show,
    title = "Modal Title",
    children,
    onClose,
    onSubmit,
    submitText = "Save changes",
    closeText = "Close",
    showFooter = true,
    size = "lg", // sm, lg, xl, fullscreen
    centered = true,
    scrollable = true,
    loading = false,
    errorMessage = "",
}) {
    if (!show) return null;

    const modalDialogClass = [
        "modal-dialog",
        size ? `modal-${size}` : "",
        centered ? "modal-dialog-centered" : "",
        scrollable ? "modal-dialog-scrollable" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <>
            {/* Modal Backdrop */}
            <div
                className="modal-backdrop fade show"
                onClick={() => {
                    if (!loading) onClose?.();
                }}
            />

            {/* Modal */}
            <div
                className="modal fade show d-block"
                tabIndex="-1"
                role="dialog"
                aria-modal="true"
                aria-labelledby="common-modal-title"
            >
                <div className={modalDialogClass}>
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5
                                className="modal-title"
                                id="common-modal-title"
                            >
                                {title}
                            </h5>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                disabled={loading}
                                aria-label="Close"
                            />
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            {children}
                        </div>

                        {/* Modal Footer */}
                        {showFooter && (
                            <div className="modal-footer d-flex justify-content-between align-items-center">
                                {/* Error Message - Left Side */}
                                <div className="me-auto">
                                    {errorMessage && (
                                        <small
                                            className="text-danger"
                                            role="alert"
                                            aria-live="polite"
                                        >
                                            <i className="ri-error-warning-line me-1" />
                                            {errorMessage}
                                        </small>
                                    )}
                                </div>

                                {/* Action Buttons - Right Side */}
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn custom-btn btn-secondary"
                                        onClick={onClose}
                                        disabled={loading}
                                    >
                                        {closeText}
                                    </button>

                                    {onSubmit && (
                                        <button
                                            type="button"
                                            className="btn custom-btn btn-primary"
                                            onClick={onSubmit}
                                            disabled={loading}
                                        >
                                            {loading && (
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                />
                                            )}

                                            {loading
                                                ? "Saving..."
                                                : submitText}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}