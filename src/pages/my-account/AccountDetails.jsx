import React, { lazy, useState } from 'react'
import { FORM_ERROR_STYLE } from '../../utils/formStyles';


const InputField = lazy(() =>
    import('../../components/form/InputField')
);

const SelectField = lazy(()=> 
    import('../../components/form/SelectField') 
);

const TextareaField = lazy(()=>
    import('../../components/form/TextareaField')
);

const Button = lazy(() =>
    import('../../components/form/Button')
);

export default function AccountDetails() {

    // --------------------------------
    // Default Form Data
    // --------------------------------
    const defaultPasswordData = {
        first_name: "",
        last_name: "",
        email: "",
        phone : "",
        country : "",
        state : "",
        address_1 : ""
    };

    const initialTouched = {
        first_name: false,
        last_name: false,
        email: false,
        phone : false,
        country : false,
        state : false,
        address_1 : false
    };

    // --------------------------------
    // Required Field Errors
    // --------------------------------
    const FIELD_ERRORS = {
        first_name: "First Name is required.",
        last_name: "Last Name is required.",
        email: "Email is required.",
        phone: "Phone number is required.",
        country: "Country is required.",
        state: "State is required.",
        address_1: "Address is required."
    };

    const REQUIRED_FIELDS = Object.keys(defaultPasswordData);

    const [formData, setFormData] = useState(defaultPasswordData);
    const [touched, setTouched] = useState(initialTouched);
    const [errors, setErrors] = useState({});
    const [loader, setLoader] = useState(false);

    const handleChange = (event)=>{
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleBlur = (event)=>{
        const {
            name,
            value
        } = event.target;

        // Mark field as touched
        setTouched((prev) => ({
            ...prev,
            [name]: true
        }));

        
    }

    const countryOptions = [
        {
            value: "IN",
            label: "India"
        }
    ];

    const stateOptions = [
        {
            value: "OD",
            label: "Odisha"
        }
    ];
    
    const onSaveChanges = ()=>{
        const touchedField = REQUIRED_FIELDS.reduce((acc, field)=>{
            acc[field] = true;
            return acc;
        }, {});
        setTouched(touchedField);
        const validationErrors = {};
        REQUIRED_FIELDS.forEach((field)=>{
            const value = formData[field];
            if (
                value === null ||
                value === undefined ||
                String(value).trim() === ""
            ) {
                validationErrors[field] = FIELD_ERRORS[field];
            }
        })
        
        
        
    }

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
                <div className="form-grid">
                    <div className="form-group">
                        <InputField
                            label="First Name"
                            name="first_name"
                            type="text"
                            placeholder="Enter first name"
                            value={
                                formData.first_name
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={
                                touched.first_name &&
                                errors.first_name
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            required
                            error={
                                errors.first_name
                            }
                        />

                    </div>
                    <div className="form-group">
                        <InputField
                            label="Last Name"
                            name="last_name"
                            type="text"
                            placeholder="Enter last name"
                            value={
                                formData.last_name
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={
                                touched.last_name &&
                                errors.last_name
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            required
                            error={
                                errors.last_name
                            }
                        />

                    </div>

                    <div className="form-group">
                        <InputField
                            label="Email Address"
                            name="email"
                            type="text"
                            placeholder="Enter email"
                            value={
                                formData.email
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={
                                touched.email &&
                                errors.email
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            required
                            error={
                                errors.email
                            }
                        />
                    </div>


                    <div className="form-group">
                        <InputField
                            label="Phone Number"
                            name="phone"
                            type="text"
                            placeholder="Enter phone number"
                            value={
                                formData.phone
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={
                                touched.phone &&
                                errors.phone
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            required
                            error={
                                errors.phone
                            }
                        />

                    </div>
                    <div className="form-group">
                        <SelectField
                            label="Country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            options={countryOptions}
                            placeholder="Select"
                            required
                            error={errors.country}
                        />

                    </div>


                    <div className="form-group">
                        <SelectField
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            options={stateOptions}
                            placeholder="Select"
                            required
                            error={errors.state}
                        />
                    </div>
                    <div className="form-group full">
                        <TextareaField
                            label="Address"
                            name="address_1"
                            value={formData.address_1}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            rows={5}
                            required
                        />

                    </div>
                </div>
            <Button
                type="button"
                className="btn-primary"
                onClick={onSaveChanges}
                loading={loader}
                variant="primary"
                loadingText="Saveing Changes..."
            >
                Save Changes
            </Button>

        </div>

        </>
    )
}
