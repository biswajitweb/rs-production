import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {logout} from '../features/auth/authSlice'

const MyAccountDropDown = ({ user }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const displayName =
        user?.first_name ||
        user?.display_name ||
        user?.username ||
        "My Account";

    const email = user?.email || "";

    const handleLogout = () => {
        localStorage.removeItem("auth");
        dispatch(logout());
        setShowDropdown(false);
        navigate("/");
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // Close with Escape
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setShowDropdown(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div
            ref={dropdownRef}
            className="position-relative"
        >
            {/* Account Button */}
            <button
                type="button"
                className="btn border-0 bg-transparent p-0 d-flex align-items-center gap-2"
                onClick={() => setShowDropdown((prev) => !prev)}
                aria-expanded={showDropdown}
                aria-haspopup="true"
            >
                {/* User Icon */}
                <span
                    className="account-avatar account-avatar-head"
                >
                    <i className="bi bi-person"></i>
                </span>

                {/* Name */}
                <span className="d-none d-lg-flex flex-column align-items-start">
                    <small className="text-muted account-welcome">
                        Welcome
                    </small>

                    <span className="fw-semibold text-dark account-name">
                        {displayName}
                    </span>
                </span>

                {/* Arrow */}
                <i
                    className={`bi bi-chevron-down text-muted account-chevron ${
                        showDropdown ? "account-chevron-open" : ""
                    }`}
                ></i>
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div
                    className="position-absolute bg-white shadow-lg border rounded-3 overflow-hidden"
                    style={{
                        top: "calc(100% + 12px)",
                        right: 0,
                        width: "285px",
                        zIndex: 1055,
                    }}
                >
                    {/* User Information */}
                    <div className="p-3 bg-light border-bottom">
                        <div className="d-flex align-items-center gap-3">
                            <span className="account-avatar account-avatar-lg">
                                <i className="bi bi-person"></i>
                            </span>

                            <div className="overflow-hidden">
                                <div className="fw-semibold text-dark text-truncate">
                                    {displayName}
                                </div>

                                {email && (
                                    <small className="text-muted text-truncate d-block">
                                        {email}
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Menu */}
                    <div className="p-2">
                        {/* My Account */}
                        <Link
                            to="/my-account"
                            className="dropdown-item account-item rounded-2"
                            onClick={() => setShowDropdown(false)}
                        >
                            <span className="account-item-icon">
                                <i className="bi bi-person"></i>
                            </span>

                            <span>
                                <strong>My Account</strong>
                                <small>
                                    Manage your profile
                                </small>
                            </span>
                        </Link>

                        {/* Orders */}
                        <Link
                            to="/my-account/orders"
                            className="dropdown-item account-item rounded-2"
                            onClick={() => setShowDropdown(false)}
                        >
                            <span className="account-item-icon">
                                <i className="bi bi-box-seam"></i>
                            </span>

                            <span>
                                <strong>My Orders</strong>
                                <small>
                                    Track your orders
                                </small>
                            </span>
                        </Link>
                        {/* Addresses */}
                        <Link
                            to="/my-account/addresses"
                            className="dropdown-item account-item rounded-2"
                            onClick={() => setShowDropdown(false)}
                        >
                            <span className="account-item-icon">
                                <i className="bi bi-geo-alt"></i>
                            </span>

                            <span>
                                <strong>Addresses</strong>
                                <small>
                                    Manage delivery addresses
                                </small>
                            </span>
                        </Link>

                        <hr className="dropdown-divider my-2" />

                        {/* Logout */}
                        <button
                            type="button"
                            className="dropdown-item account-item account-logout rounded-2"
                            onClick={handleLogout}
                        >
                            <span className="account-item-icon">
                                <i className="bi bi-box-arrow-right"></i>
                            </span>

                            <span>
                                <strong>Sign Out</strong>
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAccountDropDown;