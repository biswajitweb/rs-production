import React from "react";
import { ROUTES } from "../../routes/routeConfig";
import { Link, NavLink, Outlet } from "react-router-dom";

export default function MyAccountLayout() {

    const myAccountMenu = ROUTES.filter(
        (item) => item.is_show === "my-account"
    );

    return (
        <div className="my-account">
            <div className="account-layout">

                {/* ================= SIDEBAR ================= */}
                <aside className="account-sidebar">

                    <div className="account-user">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Profile"
                        />

                        <div className="account-user-info">
                            <h4>Biswajit Sahu</h4>
                            <span>
                                biswajit@example.com
                            </span>
                        </div>
                    </div>

                    <nav className="account-menu">

                        {Array.isArray(myAccountMenu) &&
                            myAccountMenu.length > 0 &&
                            myAccountMenu.map((item) => {
                                const relativePath = item.path
                                    .replace("/my-account/", "")
                                    .replace("/my-account", "");
                                
                                const isDashboard = item.path === "/my-account";

                            
                                return (
                                    <NavLink
                                        key={item.path}
                                        data-page={item.element}
                                        to={relativePath || "."}
                                        end={isDashboard}
                                        className={({ isActive }) =>
                                            `button ${
                                                isActive ? "active" : ""
                                            }`
                                        }
                                    >
                                        <span className="menu-icon">
                                            {item.icon}
                                        </span>

                                        {item.title}
                                    </NavLink>
                                );
                            })
                        }

                        <div className="menu-divider"></div>

                        <Link
                            to="/"
                            className="logout button"
                        >
                            <span className="menu-icon">
                                ↪
                            </span>
                            Logout
                        </Link>

                    </nav>
                </aside>

                {/* ================= CONTENT ================= */}
                <main className="account-content">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}