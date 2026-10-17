import React, { useEffect } from "react";
import "../assets/css/toast.css";

export default function Toast({
    show = false,
    message = "",
    type = "success",
    title,
    duration = 3000,
    onClose,
}) {
    useEffect(() => {
        if (!show || !duration) return;

        const timer = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [show, duration, onClose]);

    if (!show) return null;

    const toastConfig = {
        success: {
            title: "Success",
            icon: "✓",
        },
        error: {
            title: "Error",
            icon: "×",
        },
        warning: {
            title: "Warning",
            icon: "!",
        },
        info: {
            title: "Info",
            icon: "i",
        },
    };

    const config = toastConfig[type] || toastConfig.info;

    const typeClass = `toast-${type}`;

    const toastTitle = title || config.title;

    const icon = config.icon;

    return (
        <div className={`toast-wrapper ${typeClass}`}>
            <div
                className="toast show"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="toast-body">

                    <div className="toast-icon">
                        {icon}
                    </div>

                    <div className="toast-content">
                        <div className="toast-title">
                            {toastTitle}
                        </div>

                        <div className="toast-message">
                            {message}
                        </div>
                    </div>

                </div>

                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                />

                {duration > 0 && (
                    <div
                        className="toast-progress"
                        style={{
                            animationDuration: `${duration}ms`,
                        }}
                    />
                )}
            </div>
        </div>
    );
}