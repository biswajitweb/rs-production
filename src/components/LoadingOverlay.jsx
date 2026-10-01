import React from "react";

const LoadingOverlay = ({ loading = false, children }) => {
    return (
        <div className="loading-container">
            {children}

            {loading && (
                <div className="loading-overlay">
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