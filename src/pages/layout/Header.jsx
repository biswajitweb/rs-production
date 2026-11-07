
import React, { lazy, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { STATIC_IMAGE } from '../../utils/staticImage';
import { ROUTES } from '../../routes/routeConfig';
import { decryptData } from '../../utils/encryption';

const MyAccountDropDown = lazy(() =>
    import('../../components/MyAccountDropDown')
);

const HeaderSearch = lazy(() => import('./HeaderSearch'));

export default function Header() {

    const location = useLocation();
    const pathName = location.pathname;

    // =====================================
    // SEARCH BAR VISIBLE ROUTES
    // =====================================
    const matchRoute = ['/tribes', '/temples', '/books'];

    const isShowSearchBar = matchRoute.some((item) =>
        pathName === item || pathName.startsWith(`${item}/`)
    );

    // =====================================
    // PRIMARY NAVIGATION MENU
    // =====================================
    const primaryMenu = ROUTES.filter(
        (item) => item.is_show === 'top-menu'
    );

    const { totalQuantity } = useSelector(
        (state) => state.cart
    );

    const { authToken } = useSelector(
        (state) => state.user
    );

    const [userInfo, setUserInfo] = useState({});
    const [isSticky, setIsSticky] = useState(false);

    // =====================================
    // NORMALIZE URL
    // =====================================
    const normalizePath = (path = '') => {
        return path.replace(/\/+$/, '') || '/';
    };

    // =====================================
    // CHECK ACTIVE ROUTE
    // =====================================
    const isRouteActive = (routePath) => {

        if (!routePath) return false;

        // Ignore dynamic route patterns
        if (routePath.includes('/:')) return false;

        const currentPath = normalizePath(pathName);
        const targetPath = normalizePath(routePath);

        return (
            currentPath === targetPath ||
            currentPath.startsWith(`${targetPath}/`)
        );
    };

    // =====================================
    // GET ACTUAL CHILD CATEGORY URL
    // =====================================
    const getChildPath = (child) => {

        if (child.parentSlug) {
            return `/${child.parentSlug}`;
        }

        return child.path || '/';
    };

    // =====================================
    // STICKY HEADER
    // =====================================
    useEffect(() => {

        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll, {
            passive: true
        });

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

    // =====================================
    // DECRYPT USER AUTHENTICATION
    // =====================================
    useEffect(() => {

        let isMounted = true;

        const decryptAuth = async () => {

            if (!authToken) {
                setUserInfo({});
                return;
            }

            try {

                const userDecrypt = await decryptData(authToken);

                if (isMounted) {
                    setUserInfo(userDecrypt?.data || {});
                }

            } catch (error) {

                console.error('Decrypt error:', error);

                if (isMounted) {
                    setUserInfo({});
                }
            }
        };

        decryptAuth();

        return () => {
            isMounted = false;
        };

    }, [authToken]);

    return (

        <header
            className={`rs-header-area ${
                isSticky ? 'sticky-header-1' : ''
            }`}
        >

            <div className="container">

                <div className="row">

                    <div className="col-md-12">

                        <div className="header-wrap">

                            {/* =====================================
                                LEFT HEADER
                            ===================================== */}

                            <div className="header-col-left">

                                <nav className="navbar navbar-expand-lg">

                                    {/* LOGO */}
                                    <Link to="/" className="logo-wrap">

                                        <img
                                            src={STATIC_IMAGE.LOGO}
                                            alt="R S Productions"
                                        />

                                        <span className="logo-text">
                                            R S Productions
                                        </span>

                                    </Link>

                                    {/* MOBILE TOGGLE */}
                                    <button
                                        className="navbar-toggler"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#headerMenu"
                                        aria-controls="headerMenu"
                                        aria-expanded="false"
                                        aria-label="Toggle navigation"
                                    >
                                        <span className="navbar-toggler-icon"></span>
                                    </button>

                                    {/* NAVIGATION */}
                                    <div
                                        className="collapse navbar-collapse"
                                        id="headerMenu"
                                    >

                                        <ul className="navbar-nav">

                                            {primaryMenu.flatMap((item) => {

                                                // If parent has children, show children directly
                                                if (Array.isArray(item.children) && item.children.length > 0) {

                                                    return item.children.map((child) => {

                                                        const childPath = getChildPath(child);
                                                        const isActive = isRouteActive(childPath);

                                                        return (
                                                            <li key={child.id} className="nav-item">

                                                                <NavLink
                                                                    to={childPath}
                                                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                                                >
                                                                    {child.title}
                                                                </NavLink>

                                                            </li>
                                                        );
                                                    });
                                                }

                                                // Otherwise show the main menu
                                                const isActive = isRouteActive(item.path);

                                                return [
                                                    <li key={item.id} className="nav-item">

                                                        <NavLink
                                                            to={item.path}
                                                            className={`nav-link ${isActive ? 'active' : ''}`}
                                                        >
                                                            {item.title}
                                                        </NavLink>

                                                    </li>
                                                ];

                                            })}

                                        </ul>

                                    </div>

                                </nav>

                            </div>

                            {/* =====================================
                                RIGHT HEADER
                            ===================================== */}

                            <div className="header-col-right">

                                <div className="acount-wrap">

                                    <ul>

                                        {/* SEARCH */}
                                        <HeaderSearch
                                            isShow={isShowSearchBar}
                                        />

                                        {/* HELP */}
                                        <li>

                                            <Link
                                                className="btn-cart"
                                                to="/help"
                                            >

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-question-lg"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09-.006-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"
                                                    />
                                                </svg>

                                            </Link>

                                        </li>

                                        {/* CART */}
                                        <li>

                                            <Link
                                                className="btn-cart"
                                                to="/cart"
                                            >

                                                <span className="number">
                                                    {totalQuantity}
                                                </span>

                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    fill="currentColor"
                                                    className="bi bi-cart"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path
                                                        d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"
                                                    />
                                                </svg>

                                            </Link>

                                        </li>

                                        {/* USER ACCOUNT */}
                                        <li>

                                            {!authToken ? (

                                                <Link
                                                    className="btn custom-btn btn-primary btn-signin"
                                                    to="/sign-in"
                                                >
                                                    Sign in
                                                </Link>

                                            ) : (

                                                <MyAccountDropDown
                                                    user={userInfo}
                                                />

                                            )}

                                        </li>

                                    </ul>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </header>

    );
}
