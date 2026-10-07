import React from 'react'

export default function AccountDetails() {
    return (
        <>
            <div className="page-header">

                <div>

                    <h2>Account Details</h2>

                    <p>
                        Update your account and contact information.
                    </p>

                </div>

            </div>
            <div className="account-card">

                    <form>

                        <div className="form-grid">


                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    value="Biswajit"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    value="Sahu"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value="biswajit@example.com"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value="+91 98765 43210"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Country
                                </label>

                                <select>

                                    <option selected>
                                        India
                                    </option>

                                    <option>
                                        Other
                                    </option>

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    State
                                </label>

                                <input
                                    type="text"
                                    value="Odisha"
                                />

                            </div>


                            <div className="form-group full">

                                <label>
                                    Address
                                </label>

                                <textarea>Odisha, India</textarea>

                            </div>


                        </div>


                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            Save Changes
                        </button>

                    </form>

                </div>

        </>
    )
}
