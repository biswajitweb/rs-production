import React, { lazy, useState } from 'react'
import { FORM_ERROR_STYLE } from '../../utils/formStyles';
import TextareaField from '../../components/form/TextareaField';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { service } from '../../api/service';

const InputField =lazy(()=>
    import('../../components/form/InputField')
);

const Spinner = lazy(()=>
    import('../../components/Spinner')
);

const Toast = lazy(()=>
    import('../../components/Toast')
);

export default function ContactUs() {

    const {store} = useSelector(state => state.site.info);
    
    

    // --------------------------------
    // Default Form Data
    // --------------------------------
    const defaultContactUsData = {
        name: "",
        email: "",
        mobile: "",
        subject : "",
        message : ""
    };

    const REQUIRED_FIELDS = Object.keys(defaultContactUsData);

    // --------------------------------
    // Initial Touched State
    // --------------------------------
    const initialTouched = {
        name: false,
        email: false,
        mobile: false,
        subject : false,
        message : false
    };

    // --------------------------------
    // Required Field Errors
    // --------------------------------
    const FIELD_ERRORS = {
        name: "Name is required.",
        email: "Email is required.",
        mobile: "Mobile is required.",
        subject: "Subject is required.",
        message: "Message is required."
    };

    const [formData, setFormData] = useState(defaultContactUsData);
    const [touched, setTouched] = useState(initialTouched);
    const [errors, setErrors] = useState({});
    const [loader, setLoader] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState({
        message : '',
        type: 'danger'
    });

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });
    
    const showToast = (message, type = "success") => {
        setToast({
            show: true,
            message,
            type,
        });
    };

    const closeToast = () => {
        setToast((prev) => ({
            ...prev,
            show: false,
        }));
    };
    

    // --------------------------------
    // Handle Input Change
    // --------------------------------
    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => {

            const updatedErrors = {
                ...prev
            };

            return updatedErrors;
        });
    };

    // --------------------------------
    // Handle Blur
    // --------------------------------
    const handleBlur = (event) => {

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

                updatedErrors[name] =
                    errorMessage;

            } else {

                delete updatedErrors[name];
            }

            return updatedErrors;
        });
    };

    const onSendMessage = async()=>{
        // --------------------------------
        // Mark All Fields as Touched
        // --------------------------------
        const touchedFields =
            REQUIRED_FIELDS.reduce(
                (acc, field) => {

                    acc[field] = true;

                    return acc;

                },
                {}
            );

        setTouched(touchedFields);

        // Validate all fields
        const newErrors = {};

        REQUIRED_FIELDS.forEach((field) => {
            if (!formData[field].trim()) {
                newErrors[field] = FIELD_ERRORS[field];
            }
        });

        setErrors(newErrors);

        // Stop if validation fails
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        try {
            setLoader(true);
            const response = await service.contact.sendMessage(formData);
            const messageResponse = response.data;
            if(messageResponse.status === 1) {
                 showToast(
                    "All items have been removed from your cart!",
                    "success"
                );
            } else {
                showToast(
                    messageResponse.message,
                    "error"
                );
            }
            setFormData(defaultContactUsData);
            setTouched(initialTouched);           
        } catch (error) {
            if(error) {
                showToast(
                    error.message,
                    "error"
                );
            }
        } finally {
            setLoader(false);
        }
       
        
        
    }

    return (
        <>
        <section className="contact-section">
            <div className="container">

                <div className="contact-header">
                    <span className="contact-label">GET IN TOUCH</span>
                    <h1>Contact Us</h1>
                    <p>
                        Have a question or want to know more about our services?
                        Send us a message and we’ll be happy to help.
                    </p>
                </div>

                <div className="contact-grid">

        
                    <div className="contact-info">

                        <h2>Contact Info</h2>
                        <p className="info-intro">
                            Feel free to reach out to us through the details below.
                        </p>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/>
                                    <circle cx="12" cy="9" r="2.5"/>
                                </svg>
                            </div>
                            <div>
                                <span>Address</span>
                                {store?.woocommerce_store_address && (
                                    <p>{store.woocommerce_store_address}</p>
                                )}
                               
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                                    <path d="m4 7 8 6 8-6"/>
                                </svg>
                            </div>
                            <div>
                                {store?.woocommerce_pos_store_email && (
                                   <span>
                                        <Link to={`mailto:${store.woocommerce_pos_store_email}`}>{store.woocommerce_pos_store_email}</Link>
                                    </span>
                                )}
                                
                                <p>For photo purchases, licensing, payments, downloads, and general enquiries.</p>
                            </div>
                        </div>

                
                        <div className="contact-item">
                            <div className="contact-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M6.6 3.5 9 3l2 5-2.2 1.8a14 14 0 0 0 5.4 5.4L16 13l5 2 .5 2.4a2 2 0 0 1-2.2 2.3C10.6 18.8 5.2 13.4 4.3 4.7A2 2 0 0 1 6.6 3.5Z"/>
                                </svg>
                            </div>
                            <div>
                                {store?.woocommerce_pos_store_phone && (
                                   <span><Link to={`tel:${store?.woocommerce_pos_store_phone}`}>{store.woocommerce_pos_store_phone}</Link></span>
                                )}
                               
                                <p>Contact us for photo licensing, pricing, purchase assistance, and customer support.</p>
                            </div>
                        </div>

                    </div>


                    <div className="contact-form-wrapper">

                        <h2>Contact Form</h2>
                        <p className="form-intro">
                            Fill out the form below and we will get back to you soon.
                        </p>

                        <form className="contact-form">

                            <div className="form-row">

                                <div className="form-group">
                                    <InputField
                                        label="Your Name"
                                        name="name"
                                        type="text"
                                        value={
                                            formData.name
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={
                                            touched.name &&
                                            formData.name === ''
                                                ? FORM_ERROR_STYLE
                                                : {}
                                        }
                                        required
                                        error={
                                            errors.name
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <InputField
                                        label="Email Address"
                                        name="email"
                                        type="text"
                                        value={
                                            formData.email
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={
                                            touched.email &&
                                            formData.email === ""
                                                ? FORM_ERROR_STYLE
                                                : {}
                                        }
                                        required
                                        error={
                                            errors.email
                                        }
                                    />
                                </div>

                            </div>

                            <div className="form-group">
                                <InputField
                                    label="Phone Number"
                                    name="mobile"
                                    type="tel"
                                    value={
                                        formData.mobile
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={
                                        touched.mobile &&
                                        formData.mobile === ""
                                            ? FORM_ERROR_STYLE
                                            : {}
                                    }
                                    required
                                    error={
                                        errors.mobile
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <InputField
                                    label="Subject"
                                    name="subject"
                                    type="text"
                                    value={
                                        formData.subject
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={
                                        touched.subject &&
                                        formData.subject === ""
                                            ? FORM_ERROR_STYLE
                                            : {}
                                    }
                                    required
                                    error={
                                        errors.subject
                                    }
                                />
                            </div>

                            <div className="form-group">
                               <TextareaField
                                    label="Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter message"
                                    required
                                    error={errors.message}
                                    style={
                                        touched.message &&
                                        formData.message === ""
                                            ? FORM_ERROR_STYLE
                                            : {}
                                    }
                                    max = "500"
                                />
                            </div>

                            <button 
                                type="button" 
                                className="btn custom-btn btn-primary contact-btn"
                                onClick={onSendMessage}
                                disabled={loader}
                                >
                                Send Message
                                {
                                    loader && <Spinner
                                        color = "white"
                                        size='md'
                                    />
                                }

                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M5 12h13"/>
                                    <path d="m13 6 6 6-6 6"/>
                                </svg>
                            </button>

                        </form>

                    </div>

                </div>

            </div>
        </section>

         <Toast
            show={toast.show}
            message={toast.message}
            type={toast.type}
            duration={3000}
            onClose={closeToast}
        />

        </>
    )
}
