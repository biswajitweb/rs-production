
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
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    {closeText}
                                </button>

                                {onSubmit && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
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
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
