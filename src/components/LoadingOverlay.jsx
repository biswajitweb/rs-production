import React from "react";

const LoadingOverlay = ({ loading = false, children }) => {
    return (
        <div className="loading-container position-relative">
            {children}

            {loading && (
                <div className="loading-overlay d-flex align-items-center justify-content-center">
                    <div className="facebook-spinner">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoadingOverlay;
