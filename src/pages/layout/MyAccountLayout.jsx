import React, { useEffect, useState } from "react";
import { ROUTES } from "../../routes/routeConfig";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { decryptData } from "../../utils/encryption";

export default function MyAccountLayout() {

    const myAccountMenu = ROUTES.filter(
        (item) => item.is_show === "my-account"
    );

    const {authToken} =  useSelector((state)=>state.user);
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        decryptAuth();
    }, [authToken]);
    
    const decryptAuth = async () => {
        if (!authToken) {
            return;
        }
        try {
            const userDecrypt = await decryptData(authToken);
            setUserInfo(userDecrypt?.data);
        } catch (error) {
            console.error("Decrypt error:", error);
        }
    };


    return (
        <div className="my-account">
            <div className="account-layout">
                
                {/* ================= SIDEBAR ================= */}
                <aside className="account-sidebar">

                    <div className="account-user">
                        <img 
                            src=""
                            alt="Profile"
                        />
                       

                        <div className="account-user-info">
                            <h4>{userInfo?.first_name} {userInfo?.last_name}</h4>
                            <span>
                                {userInfo?.email}
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
                                           <i className={item.icon}></i>
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
                                <i className="bi bi-box-arrow-right"></i> 
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