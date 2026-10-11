import React, { lazy, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { service } from '../../api/service';
import { FORM_ERROR_STYLE } from '../../utils/formStyles';
import SelectField from '../../components/form/SelectField';



const CommonModal = lazy(()=>
    import('../../components/CommonModal')
);

const InputField = lazy(()=>
    import('../../components/form/InputField')
);

const TextareaField =lazy(()=>
    import('../../components/form/TextareaField')
);

const CheckboxField =lazy(()=>
    import('../../components/form/CheckboxField')
);

export default function Addresses() {
    const [moadlId, setModalId] = useState('addressModal');
    const [showModal, setShowModal] = useState(false);
    const {address} = useSelector(state => state.address);
    const countryCode = "IN";
    const [states, setStates] = useState([]);


    const defaultAddress = {
        label: "",
        first_name: "",
        last_name: "",
        phone: "",
        address_1: "",
        city: "",
        state: "",
        postcode: "",
        country: "",
        is_default: false
    };

    const initialTouched  = {
        label: false,
        first_name: false,
        last_name: false,
        phone: false,
        address_1: false,
        city: false,
        state: false,
        postcode: false,
        country: false,
        is_default: false
    };

    const FIELD_ERRORS = {
        first_name: "First Name is required.",
        last_name: "Last Name is required.",
        phone: "Please provide a contact number.",
        state: "Please select a state.",
        city: "City is required.",
        postcode: "Post code is required.",
        address: "Address is required.",
    };

    const REQUIRED_FIELDS = Object.keys(defaultAddress);


    const [formData, setFormData] = useState(defaultAddress);
    const [touched, setTouched] = useState(initialTouched);
    const [errors, setErrors] = useState({});
    const [loader, setLoader] = useState(false);

    const getAllStates = async(code)=>{
        try {
            const response = await service.customer.states(code);
            const stateResponse = response.data;
            setStates(stateResponse?.states || []);
        } catch (error) {
            if(error) {
                console.log(error.message);
            }
        }
    }

    useEffect(()=>{
        if(countryCode) {
            getAllStates(countryCode);
        }
    }, [countryCode]);

    const onAddressChange = (event)=>{
        const {name, value, type, checked} = event.target;
        setFormData((prev)=>({
            ...prev,
            [name]: type === "checkbox" ? checked : value
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

        let errorMessage = "";
        // ----------------------------
        // Required Validation
        // ----------------------------
        if (!value.trim()) {
            errorMessage = FIELD_ERRORS[name];
        }
        // ----------------------------
        // Set Error
        // ----------------------------
        setErrors((prev) => {
            const updatedErrors = {
                ...prev
            };

            if (errorMessage) {
                updatedErrors[name] = errorMessage;

            } else {
                delete updatedErrors[name];
            }

            return updatedErrors;
        });

    }

    const onClose = ()=>{
        setShowModal(false);
        setFormData(defaultAddress);
        setTouched(initialTouched);
    }
    
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
                    className="custom-btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    + Add Address
                </button>
            </div>
            {
                address.length === 0 ? (
                    <>
                        <div className="text-center w-100 py-5 px-3">
                            <div className="mb-3">
                                <i
                                    className="bi bi-geo-alt"
                                    style={{
                                        fontSize: "48px",
                                        color: "#6c757d",
                                    }}
                                ></i>
                            </div>

                            <h4 className="mb-2">
                                No Address Found
                            </h4>

                            <p className="text-muted mb-4">
                                You haven't added any delivery address yet.
                                Add an address to make checkout faster and easier.
                            </p>
                        </div> 
                    </>
                ) : (
                    <>
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
                            </div>
                        </div>
                    </>
                )
            }
           

            
            
        
            <CommonModal
                show={showModal}
                title="Add User Address"
                onClose={onClose}
                onSubmit={handleSubmit}

            >
                <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-6">
                        <InputField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={onAddressChange}
                            placeholder="Enter your first name"
                            required = {true}
                            error={
                                errors.first_name
                            }
                            style={
                                touched.first_name &&
                                errors.first_name
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            onBlur={handleBlur}
                        />


                    </div>

                    <div className="col-6">
                        <InputField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={onAddressChange}
                            placeholder="Enter your last name"
                            required = {true}
                            error={
                                errors.last_name
                            }
                            style={
                                touched.last_name &&
                                errors.last_name
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            onBlur={handleBlur}
                        />

                    </div>

                   

                    {/* City */}
                    <div className="col-md-6">
                        
                        <label htmlFor="country" className="form-label">
                            Country
                        </label>
                        <select
                            name='country'
                            id="country"
                            value={formData.country}
                            onChange={onAddressChange}
                            className="form-control"
                        >
                            <option value="IN">India</option>
                        </select>
                    </div>

                    {/* State */}
                    <div className="col-md-6">
                        <SelectField
                            label="State"
                            name="state"
                            value={formData.state}
                            onChange={onAddressChange}
                            options={states}
                            placeholder="Select State"
                            required
                            style={
                                touched.state &&
                                errors.state
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                           
                        />
                    </div>

                    {/* Country */}
                    <div className="col-md-6">
                        <InputField
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={onAddressChange}
                            placeholder="Enter your city"
                            required = {true}
                            error={
                                errors.city
                            }
                            style={
                                touched.city &&
                                errors.city
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            onBlur={handleBlur}
                        />
                    </div>

                    {/* PIN Code */}
                    <div className="col-md-6">
                        <InputField
                            label="PIN Code"
                            name="postcode"
                            value={formData.postcode}
                            onChange={onAddressChange}
                            placeholder="Enter your post code"
                            required = {true}
                            error={
                                errors.postcode
                            }
                            style={
                                touched.postcode &&
                                errors.postcode
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            onBlur={handleBlur}
                        />

                    </div>

                    {/* Phone */}
                    <div className="col-12">
                        <InputField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={onAddressChange}
                            placeholder="Enter your mobile number"
                            required = {true}
                            error={
                                errors.phone
                            }
                            style={
                                touched.phone &&
                                errors.phone
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            onBlur={handleBlur}
                        />

                    </div>

                     {/* Address */}
                    <div className="col-12">
                       <TextareaField
                            label="Address"
                            name="address_1"
                            value = {formData.address_1}
                            onChange={onAddressChange}
                            placeholder='Enter full address'
                            required = {true}
                            error={
                                errors.address_1
                            }
                            style={
                                touched.address_1 &&
                                errors.address_1
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                            onBlur={handleBlur}
                        />
                    </div>

                    {/* Default Address */}
                    <div className="col-12">
                        <CheckboxField
                            label="Set as default address"
                            name="is_default"
                            checked={formData.is_default}
                            onChange={onAddressChange}
                        />
                    </div>
                </div>
            </CommonModal>


        </>
    );
}