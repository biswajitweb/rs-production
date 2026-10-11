
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center p-4">
                <h1
                    className="display-1 fw-bold text-primary mb-0"
                    style={{ fontSize: "clamp(6rem, 20vw, 12rem)" }}
                >
                    404
                </h1>

                <h2 className="fw-semibold mb-3">
                    Page Not Found
                </h2>

                <p className="text-secondary mb-4">
                    Sorry, the page you are looking for doesn't exist,
                    has been moved, or the URL is incorrect.
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3">
                    <Link
                        to="/"
                        className="btn btn-primary px-4 py-2"
                    >
                        <i className="bi bi-house-door me-2"></i>
                        Go to Home
                    </Link>

                    <button
                        type="button"
                        className="btn btn-outline-secondary px-4 py-2"
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

