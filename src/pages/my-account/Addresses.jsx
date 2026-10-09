import React, { lazy, useState } from 'react';
import { useDispatch } from 'react-redux';


const CommonModal = lazy(()=>
    import('../../components/CommonModal')
);

export default function Addresses() {
    const [moadlId, setModalId] = useState('addressModal');
    const [showModal, setShowModal] = useState(false);
    
    const handleSubmit = ()=>{

    }  
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
                    onClick={() => setShowModal(true)}
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
            
        
            <CommonModal
                show={showModal}
                title="Add User Address"
                onClose={() => setShowModal(false)}
                onSubmit={handleSubmit}
            >
                <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-6">
                        <label htmlFor="firstName" className="form-label">
                            First Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            defaultValue=""
                            placeholder="Enter first name"
                            required
                        />
                    </div>

                    <div className="col-6">
                        <label htmlFor="lastName" className="form-label">
                            Last Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="fullName"
                            defaultValue=""
                            placeholder="Enter last name"
                            required
                        />
                    </div>

                   

                    {/* City */}
                    <div className="col-md-6">
                        
                        <label htmlFor="country" className="form-label">
                            Country
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="country"
                            name="country"
                            placeholder="Enter country"
                            required
                        />
                    </div>

                    {/* State */}
                    <div className="col-md-6">
                        <label htmlFor="state" className="form-label">
                            State
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="state"
                            name="state"
                            placeholder="Enter state"
                            required
                        />
                    </div>

                    {/* Country */}
                    <div className="col-md-6">
                        <label htmlFor="city" className="form-label">
                            City
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            placeholder="Enter city"
                            required
                        />
                    </div>

                    {/* PIN Code */}
                    <div className="col-md-6">
                        <label htmlFor="postcode" className="form-label">
                            PIN Code
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="postcode"
                            name="postcode"
                            placeholder="Enter PIN code"
                            maxLength="6"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="col-12">
                        <label htmlFor="phone" className="form-label">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            placeholder="Enter phone number"
                            required
                        />
                    </div>

                     {/* Address */}
                    <div className="col-12">
                        <label htmlFor="address" className="form-label">
                            Address
                        </label>
                        <textarea
                            className="form-control"
                            id="address"
                            name="address"
                            rows="3"
                            placeholder="Enter full address"
                            required
                        />
                    </div>

                    {/* Default Address */}
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="isDefault"
                                name="isDefault"
                            />
                            <label
                                className="form-check-label"
                                htmlFor="isDefault"
                            >
                                Set as default address
                            </label>
                        </div>
                    </div>
                </div>
            </CommonModal>


        </>
    );
}