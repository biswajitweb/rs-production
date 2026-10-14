import React, { lazy, useState } from 'react'
import { FORM_ERROR_STYLE } from '../../utils/formStyles';
import TextareaField from '../../components/form/TextareaField';

const InputField =lazy(()=>
    import('../../components/form/InputField')
);

export default function ContactUs() {
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

    const onSendMessage = ()=>{
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
    }

    return (
        <>
        <section class="contact-section">
            <div class="container">

                <div class="contact-header">
                    <span class="contact-label">GET IN TOUCH</span>
                    <h1>Contact Us</h1>
                    <p>
                        Have a question or want to know more about our services?
                        Send us a message and we’ll be happy to help.
                    </p>
                </div>

                <div class="contact-grid">

        
                    <div class="contact-info">

                        <h2>Contact Info</h2>
                        <p class="info-intro">
                            Feel free to reach out to us through the details below.
                        </p>

                        <div class="contact-item">
                            <div class="contact-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/>
                                    <circle cx="12" cy="9" r="2.5"/>
                                </svg>
                            </div>
                            <div>
                                <span>Address</span>
                                <p>611/998 (1st Floor), BJB Nagar, Bhubaneswar, Odisha</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <div class="contact-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                                    <path d="m4 7 8 6 8-6"/>
                                </svg>
                            </div>
                            <div>
                                <span><a href="mailto:rsrath13@gmail.com">rsrath13@gmail.com</a></span>
                                <p>For photo purchases, licensing, payments, downloads, and general enquiries.</p>
                            </div>
                        </div>

                
                        <div class="contact-item">
                            <div class="contact-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M6.6 3.5 9 3l2 5-2.2 1.8a14 14 0 0 0 5.4 5.4L16 13l5 2 .5 2.4a2 2 0 0 1-2.2 2.3C10.6 18.8 5.2 13.4 4.3 4.7A2 2 0 0 1 6.6 3.5Z"/>
                                </svg>
                            </div>
                            <div><span><a href="tel:+918895267838">+91-88952-67838</a></span>
                                <p>Contact us for photo licensing, pricing, purchase assistance, and customer support.</p>
                            </div>
                        </div>

                    </div>


                    <div class="contact-form-wrapper">

                        <h2>Contact Form</h2>
                        <p class="form-intro">
                            Fill out the form below and we will get back to you soon.
                        </p>

                        <form class="contact-form">

                            <div class="form-row">

                                <div class="form-group">
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
                                            errors.name
                                                ? FORM_ERROR_STYLE
                                                : {}
                                        }
                                        required
                                        error={
                                            errors.name
                                        }
                                    />
                                </div>

                                <div class="form-group">
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

                            </div>

                            <div class="form-group">
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
                                        errors.mobile
                                            ? FORM_ERROR_STYLE
                                            : {}
                                    }
                                    required
                                    error={
                                        errors.mobile
                                    }
                                />
                            </div>

                            <div class="form-group">
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
                                        errors.subject
                                            ? FORM_ERROR_STYLE
                                            : {}
                                    }
                                    required
                                    error={
                                        errors.subject
                                    }
                                />
                            </div>

                            <div class="form-group">
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
                                        errors.message
                                            ? FORM_ERROR_STYLE
                                            : {}
                                    }
                                />
                            </div>

                            <button 
                                type="button" 
                                class="btn custom-btn btn-primary contact-btn"
                                onClick={onSendMessage}
                                >
                                Send Message

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


        </>
    )
}
