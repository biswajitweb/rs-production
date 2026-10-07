import React from 'react'

export default function Dashboard() {
    return (
        <>
           <section
                className="account-page active"
                id="dashboard"
            >

                <div className="page-header">

                    <div>
                        <h2>Dashboard</h2>

                        <p>
                            Welcome back! Manage your account and purchases.
                        </p>
                    </div>

                </div>


                <div className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon">📷</div>

                        <span>Purchased Photos</span>

                        <strong>24</strong>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">↓</div>

                        <span>Downloads</span>

                        <strong>18</strong>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">♡</div>

                        <span>Wishlist</span>

                        <strong>12</strong>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">▤</div>

                        <span>Total Orders</span>

                        <strong>8</strong>

                    </div>

                </div>


                

            </section>
        </>
    )
}
