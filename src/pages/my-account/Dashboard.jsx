
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

import { service } from "../../api/service";
import { decryptData } from "../../utils/encryption";

export default function Dashboard() {

    const { authToken } = useSelector((state) => state.user || {});

    const [userId, setUserId] = useState(0);
    const [isDecrypting, setIsDecrypting] = useState(true);

    /*
     * Decrypt logged-in user
     */
    useEffect(() => {

        let cancelled = false;

        const decryptAuth = async () => {

            if (!authToken) {
                setUserId(0);
                setIsDecrypting(false);
                return;
            }

            setIsDecrypting(true);

            try {

                const userDecrypt = await decryptData(authToken);
                const userData = userDecrypt?.data;

                if (!cancelled) {
                    setUserId(Number(userData?.id) || 0);
                }

            } catch (error) {

                console.error("Authentication decrypt error:", error);

                if (!cancelled) {
                    setUserId(0);
                }

            } finally {

                if (!cancelled) {
                    setIsDecrypting(false);
                }

            }

        };

        decryptAuth();

        return () => {
            cancelled = true;
        };

    }, [authToken]);


    /*
     * Fetch dashboard data
     */
    const {
        data: dashboardData,
        isPending,
        isError,
        error,
        refetch
    } = useQuery({

        queryKey: ["customer-dashboard", userId],

        queryFn: async () => {

            const response = await service.customer.getDashboard(userId);

            return response?.data?.data ?? response?.data ?? {};

        },

        enabled: !!userId && !isDecrypting,

        staleTime: 5 * 60 * 1000,

        gcTime: 10 * 60 * 1000,

        refetchOnWindowFocus: false,

        retry: 1

    });


    /*
     * Dashboard statistics
     */
    const stats = [
        {
            icon: "bi bi-bag-check",
            label: "Total Orders",
            value: dashboardData?.statistics?.total_orders ?? 0,
            color: "warning"
        },

        {
            icon: "bi bi-currency-rupee",
            label: "Total Spent",
            value: dashboardData?.statistics?.total_spent ?? 0,
            isCurrency: true,
            color: "success"
        },

        {
            icon: "bi bi-clock-history",
            label: "Processing Orders",
            value: dashboardData?.statistics?.processing_orders ?? 0,
            color: "info"
        },

        {
            icon: "bi bi-check-circle",
            label: "Completed Orders",
            value: dashboardData?.statistics?.completed_orders ?? 0,
            color: "success"
        },

        {
            icon: "bi bi-wallet2",
            label: "Pending Payments",
            value: dashboardData?.statistics?.pending_payments ?? 0,
            color: "warning"
        }

    ];


    /*
     * Format currency
     */
    const formatCurrency = (amount) => {

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(Number(amount) || 0);

    };


    /*
     * Loading state
     */
    if (isDecrypting || isPending) {

        return (

            <section className="account-page active" id="dashboard">

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-3 text-muted">
                        Loading your dashboard...
                    </p>

                </div>

            </section>

        );

    }


    /*
     * Authentication state
     */
    if (!userId) {

        return (

            <section className="account-page active" id="dashboard">

                <div className="alert alert-warning">
                    Please log in to view your dashboard.
                </div>

            </section>

        );

    }


    /*
     * Error state
     */
    if (isError) {

        return (

            <section className="account-page active" id="dashboard">

                <div className="alert alert-danger d-flex justify-content-between align-items-center">

                    <span>
                        {error?.message || "Unable to load dashboard data."}
                    </span>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => refetch()}
                    >
                        Retry
                    </button>

                </div>

            </section>

        );

    }


    return (

        <section className="account-page active" id="dashboard">

            {/* Dashboard Header */}
            <div className="page-header">

                <div>

                    <h2>Dashboard</h2>

                    <p>
                        Welcome back! Manage your account and purchases.
                    </p>

                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => refetch()}
                >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                </button>

            </div>


            {/* Statistics Grid */}
            <div className="stats-grid">

                {stats.map((item) => (

                    <div
                        className="stat-card"
                        key={item.label}
                    >

                        <div className={`stat-icon text-${item.color}`}>

                            <i className={item.icon}></i>

                        </div>

                        <span>{item.label}</span>

                        <strong>
                            {item.isCurrency
                                ? formatCurrency(item.value)
                                : Number(item.value).toLocaleString("en-IN")
                            }
                        </strong>

                    </div>

                ))}

            </div>


           

        </section>

    );

}
