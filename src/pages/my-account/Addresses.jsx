import React from 'react';

export default function Addresses() {
    return (
        <>
            
            <div className="page-header">
                <div>
                    <h2>Saved Addresses</h2>

                    <p>
                        Manage your billing and delivery addresses.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn-primary"
                >
                    + Add Address
                </button>
            </div>

            <div className="account-card">
                <div className="address-grid">

                    {/* Default Address */}
                    <div className="address-card default">
                        <span className="default-label">
                            Default
                        </span>

                        <h4>Home</h4>

                        <p>
                            Biswajit Sahu
                            <br />
                            Bhubaneswar
                            <br />
                            Odisha, India
                            <br />
                            751001
                            <br />
                            +91 98765 43210
                        </p>

                        <button
                            type="button"
                            className="btn-outline"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Office Address */}
                    <div className="address-card">
                        <h4>Office</h4>

                        <p>
                            Biswajit Sahu
                            <br />
                            Bhubaneswar
                            <br />
                            Odisha, India
                            <br />
                            751003
                            <br />
                            +91 98765 43210
                        </p>

                        <button
                            type="button"
                            className="btn-outline"
                        >
                            Edit
                        </button>
                    </div>

                </div>
            </div>
            
        </>
    );
}