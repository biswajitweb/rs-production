
import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { service } from "../../api/service";
import { FORM_ERROR_STYLE } from "../../utils/formStyles";
import { allAddressList } from "../../features/address/addressSlice";
import { decryptData } from "../../utils/encryption";

const CommonModal = lazy(() =>
    import("../../components/CommonModal")
);

const InputField = lazy(() =>
    import("../../components/form/InputField")
);

const TextareaField = lazy(() =>
    import("../../components/form/TextareaField")
);

const CheckboxField = lazy(() =>
    import("../../components/form/CheckboxField")
);

const SelectField = lazy(() =>
    import("../../components/form/SelectField")
);

const Spinner = lazy(() =>
    import("../../components/Spinner")
);

const defaultAddress = {
    label: "Home",
    first_name: "",
    last_name: "",
    phone: "",
    address_1: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
    is_default: false,
};

const initialTouched = {
    label: false,
    first_name: false,
    last_name: false,
    phone: false,
    address_1: false,
    city: false,
    state: false,
    postcode: false,
    country: false,
    is_default: false,
};

const ADDRESS_LABEL_OPTIONS = [
    { value: "Home", label: "Home" },
    { value: "Office", label: "Office" },
];

const REQUIRED_FIELDS = [
    "first_name",
    "last_name",
    "phone",
    "address_1",
    "city",
    "state",
    "postcode",
];

const FIELD_ERRORS = {
    first_name: "First name is required.",
    last_name: "Last name is required.",
    phone: "Please provide a contact number.",
    address_1: "Address is required.",
    city: "City is required.",
    state: "Please select a state.",
    postcode: "Postcode is required.",
};

export default function Addresses() {
    const { address = [] } = useSelector(
        (state) => state.address || {}
    );

    const { authToken } = useSelector(
        (state) => state.user || {}
    );

    const dispatch = useDispatch();

    // Modal state
    const [showModal, setShowModal] = useState(false);

    // null = Add mode; address ID = Edit mode
    const [editingAddressId, setEditingAddressId] =
        useState(null);

    const isEditMode = editingAddressId !== null;

    // Form state
    const [formData, setFormData] = useState({
        ...defaultAddress,
    });

    const [touched, setTouched] = useState({
        ...initialTouched,
    });

    const [errors, setErrors] = useState({});
    const [states, setStates] = useState([]);

    // Loading and error states
    const [loader, setLoader] = useState(false);
    const [addressLoading, setAddressLoading] = useState(true);
    const [userId, setUserId] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [defaultAddressLoadingId, setDefaultAddressLoadingId] = useState(false);

    const countryCode = "IN";

    /*
     * Decrypt logged-in user
     */
    useEffect(() => {
        let cancelled = false;

        const decryptAuth = async () => {
            if (!authToken) {
                setUserId(0);
                setAddressLoading(false);
                return;
            }

            try {
                const userDecrypt = await decryptData(authToken);
                const userData = userDecrypt?.data;

                if (!cancelled) {
                    setUserId(Number(userData?.id) || 0);
                }
            } catch (error) {
                console.error("Decrypt error:", error);

                if (!cancelled) {
                    setUserId(0);
                    setAddressLoading(false);
                }
            }
        };

        decryptAuth();

        return () => {
            cancelled = true;
        };
    }, [authToken]);

    /*
     * Fetch address book
     */
    useEffect(() => {
        if (!userId) {
            return;
        }

        let cancelled = false;

        const getAddressBooks = async () => {
            setAddressLoading(true);

            try {
                await dispatch(allAddressList(userId));
            } catch (error) {
                console.error(
                    "Error fetching addresses:",
                    error?.message
                );
            } finally {
                if (!cancelled) {
                    setAddressLoading(false);
                }
            }
        };

        getAddressBooks();

        return () => {
            cancelled = true;
        };
    }, [userId, dispatch]);

    /*
     * Fetch states based on country
     */
    useEffect(() => {
        let cancelled = false;

        const getAllStates = async () => {
            try {
                const response =
                    await service.customer.states(countryCode);

                const stateResponse = response?.data;

                const stateList = Array.isArray(
                    stateResponse?.states
                )
                    ? stateResponse.states
                    : [];

                const stateOptions = stateList.map((state) => ({
                    value: state.code,
                    label: state.name,
                }));

                if (!cancelled) {
                    setStates(stateOptions);
                }
            } catch (error) {
                console.error(
                    "Error fetching states:",
                    error?.message
                );

                if (!cancelled) {
                    setStates([]);
                }
            }
        };

        getAllStates();

        return () => {
            cancelled = true;
        };
    }, []);

    /*
     * Validate an individual field
     */
    const validateField = (name, value) => {
        if (!REQUIRED_FIELDS.includes(name)) {
            return "";
        }

        if (
            typeof value !== "string" ||
            !value.trim()
        ) {
            return FIELD_ERRORS[name] || "This field is required.";
        }

        return "";
    };

    /*
     * Validate complete form
     */
    const validateForm = (data) => {
        const newErrors = {};

        REQUIRED_FIELDS.forEach((name) => {
            const error = validateField(name, data[name]);

            if (error) {
                newErrors[name] = error;
            }
        });

        return newErrors;
    };

    /*
     * Handle input changes
     */
    const onAddressChange = (event) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        const fieldValue =
            type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        if (touched[name]) {
            const error = validateField(name, fieldValue);

            setErrors((prev) => {
                const updatedErrors = { ...prev };

                if (error) {
                    updatedErrors[name] = error;
                } else {
                    delete updatedErrors[name];
                }

                return updatedErrors;
            });
        }
    };

    /*
     * Validate when leaving a field
     */
    const handleBlur = (event) => {
        const { name, value } = event.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        const error = validateField(name, value);

        setErrors((prev) => {
            const updatedErrors = { ...prev };

            if (error) {
                updatedErrors[name] = error;
            } else {
                delete updatedErrors[name];
            }

            return updatedErrors;
        });
    };

    /*
     * Open Add Address modal
     */
    const handleAddAddress = () => {
        setEditingAddressId(null);
        setFormData({ ...defaultAddress });
        setTouched({ ...initialTouched });
        setErrors({});
        setErrorMessage("");
        setShowModal(true);
    };

    /*
     * Open Edit Address modal
     */
    const handleEditAddress = (item) => {
        setEditingAddressId(item.id);

        setFormData({
            ...defaultAddress,
            ...item,
        });

        setTouched({ ...initialTouched });
        setErrors({});
        setErrorMessage("");
        setShowModal(true);
    };

    /*
     * Close modal and reset form
     */
    const onClose = () => {
        if (loader) {
            return;
        }

        setShowModal(false);
        setEditingAddressId(null);
        setFormData({ ...defaultAddress });
        setTouched({ ...initialTouched });
        setErrors({});
        setErrorMessage("");
    };

    /*
     * Add or update address
     */
    const handleSubmit = async () => {
        setErrorMessage("");

        const validationErrors = validateForm(formData);

        const allTouched = {
            ...initialTouched,
        };

        REQUIRED_FIELDS.forEach((field) => {
            allTouched[field] = true;
        });

        setTouched(allTouched);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        if (!userId) {
            setErrorMessage(
                "Unable to identify the logged-in user. Please log in again."
            );
            return;
        }

        try {
            setLoader(true);

            const payload = {
                user_id: userId,
                ...(isEditMode && { id: editingAddressId }),
                address: {
                    ...formData,
                    country: countryCode,
                },
            };

            const response = isEditMode
                ? await service.address.update(
                   payload
                )
                : await service.address.save(payload);

            const addressResponse = response?.data;

            if (addressResponse?.success === true) {
                await dispatch(allAddressList(userId));
                // Close only after successful save/update
                setShowModal(false);
                setEditingAddressId(null);
                setFormData({ ...defaultAddress });
                setTouched({ ...initialTouched });
                setErrors({});
                setErrorMessage("");
            } else {
                setErrorMessage(
                    addressResponse?.message ||
                    `Unable to ${isEditMode ? "update" : "save"} address.`
                );
            }
        } catch (error) {
            console.error(
                "Address submission error:",
                error
            );

            setErrorMessage(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoader(false);
        }
    };

    const handleSetDefaultAddress = async(item)=>{
        try {
            setDefaultAddressLoadingId(true);
            if(item.id) {
                let payloadForSetDefault = {
                    user_id : userId,
                    id : item.id
                };
                const response = await service.address.default(payloadForSetDefault);
                const defaultResponse = response?.data;
                if(defaultResponse.success === true) {
                    // Wait for 1.5 seconds before refreshing the address list
                    await new Promise((resolve) => setTimeout(resolve, 1500));

                    await dispatch(allAddressList(userId));
                  
                }
            }
        } catch (error) {
            if(error) {
                console.log(error.message);
            }
        } finally {
            setDefaultAddressLoadingId(false);
        }
    }

    return (
        <>
            {/* Page Header */}
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
                    onClick={handleAddAddress}
                >
                    <i className="bi bi-plus-lg me-2" />
                    Add Address
                </button>
            </div>

            {/* Address List */}
            {addressLoading ? (
                <div className="text-center w-100 py-5">
                    <Spinner
                        centered={true}
                        color="primary"
                        label="Loading addresses..."
                    />
                </div>
            ) : !Array.isArray(address) ||
              address.length === 0 ? (
                <div className="text-center w-100 py-5 px-3">
                    <div className="mb-3">
                        <i
                            className="bi bi-geo-alt"
                            style={{
                                fontSize: "48px",
                                color: "#6c757d",
                            }}
                            aria-hidden="true"
                        />
                    </div>

                    <h4 className="mb-2">
                        No Address Found
                    </h4>

                    <p className="text-muted mb-4">
                        You haven't added any delivery address yet.
                        Add an address to make checkout faster and easier.
                    </p>

                    <button
                        type="button"
                        className="custom-btn btn-primary"
                        onClick={handleAddAddress}
                    >
                        <i className="bi bi-plus-lg me-2" />
                        Add Your First Address
                    </button>
                </div>
            ) : (
                
                <div className="account-card p-3 p-md-4">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                        <div>
                            <h5 className="mb-1 fw-semibold">Saved Addresses</h5>
                            <p className="text-muted small mb-0">
                                Manage your delivery addresses
                            </p>
                        </div>

                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-2">
                            {address.length} {address.length === 1 ? "Address" : "Addresses"}
                        </span>
                    </div>

                    <div className="row g-3">
                        {address.map((item) => {
                            const isDefault =
                                item.is_default === true ||
                                item.is_default === 1 ||
                                item.is_default === "1";

                            const isOffice = item.label === "Office";

                            return (
                                <div className="col-12 col-md-6" key={item.id}>
                                    <div
                                        className={`h-100 border rounded-3 p-3 ${
                                            isDefault
                                                ? "border-success bg-success-subtle"
                                                : "bg-white"
                                        }`}
                                    >
                                        {/* Card Header */}
                                        <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    className={`rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 ${
                                                        isDefault
                                                            ? "bg-white text-success"
                                                            : "bg-light text-secondary"
                                                    }`}
                                                    style={{
                                                        width: "42px",
                                                        height: "42px",
                                                    }}
                                                >
                                                    <i
                                                        className={`bi ${
                                                            isOffice
                                                                ? "bi-building"
                                                                : "bi-house-door"
                                                        } fs-5`}
                                                        aria-hidden="true"
                                                    />
                                                </div>

                                                <div>
                                                    <h6 className="mb-1 fw-semibold">
                                                        {item.label || "Address"}
                                                    </h6>

                                                    <div className="small text-muted">
                                                        {isOffice
                                                            ? "Work address"
                                                            : "Personal address"}
                                                    </div>
                                                </div>
                                            </div>

                                            {isDefault && (
                                                <span className="badge rounded-pill bg-success text-white px-2 py-2 flex-shrink-0">
                                                    <i className="bi bi-check2 me-1" />
                                                    Default
                                                </span>
                                            )}
                                        </div>

                                        {/* Recipient */}
                                        <div className="mb-3">
                                            <div className="fw-semibold text-dark mb-2">
                                                {item.first_name} {item.last_name}
                                            </div>

                                            <div className="d-flex align-items-start gap-2 mb-2">
                                                <i
                                                    className="bi bi-geo-alt text-muted mt-1"
                                                    aria-hidden="true"
                                                />

                                                <div className="small text-secondary text-break">
                                                    <div>{item.address_1}</div>
                                                    <div>
                                                        {item.city}, {item.state}
                                                    </div>
                                                    <div>
                                                        {item.country === "IN"
                                                            ? "India"
                                                            : item.country}{" "}
                                                        - {item.postcode}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center gap-2 small text-secondary">
                                                <i
                                                    className="bi bi-telephone text-muted"
                                                    aria-hidden="true"
                                                />
                                                <span>{item.phone}</span>
                                            </div>
                                        </div>

                                        <hr className="border-secondary-subtle my-3" />

                                        {/* Card Actions */}
                                        <div className="d-flex align-items-center gap-2 flex-wrap">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary rounded-2 px-3"
                                                onClick={() => handleEditAddress(item)}
                                                disabled={loader}
                                            >
                                                <i className="bi bi-pencil me-1" />
                                                Edit
                                            </button>

                                            {!isDefault && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-success rounded-2 px-3"
                                                    onClick={() =>
                                                        handleSetDefaultAddress(item)
                                                    }
                                                    disabled={Boolean(
                                                        defaultAddressLoadingId
                                                    )}
                                                >
                                                    {defaultAddressLoadingId === item.id ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-1"
                                                                aria-hidden="true"
                                                            />
                                                            Updating
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-check-circle me-1" />
                                                            Set as default
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            )}

            {/* Add/Edit Address Modal */}
            <CommonModal
                show={showModal}
                title={
                    isEditMode
                        ? "Edit Address"
                        : "Add Address"
                }
                onClose={onClose}
                onSubmit={handleSubmit}
                submitText={
                    isEditMode
                        ? "Update Address"
                        : "Save Address"
                }
                closeText="Cancel"
                loading={loader}
                errorMessage={errorMessage}
            >
                <div className="row g-3">
                    {/* Address Type */}
                    <div className="col-12">
                        <label className="form-label fw-semibold mb-2">
                            Address Type
                            <span className="text-danger ms-1">
                                *
                            </span>
                        </label>

                        <div
                            className="d-flex gap-2"
                            role="group"
                            aria-label="Address type"
                        >
                            {ADDRESS_LABEL_OPTIONS.map(
                                (option) => {
                                    const isSelected =
                                        formData.label === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={`btn btn-sm rounded-3 px-3 py-2 ${
                                                isSelected
                                                    ? "btn-primary"
                                                    : "btn-outline-secondary"
                                            }`}
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    label: option.value,
                                                }))
                                            }
                                            aria-pressed={isSelected}
                                        >
                                            <i
                                                className={`bi ${
                                                    option.value === "Home"
                                                        ? "bi-house-door"
                                                        : "bi-building"
                                                } me-2`}
                                                aria-hidden="true"
                                            />

                                            {option.label}

                                            {isSelected && (
                                                <i
                                                    className="bi bi-check2 ms-2"
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* First Name */}
                    <div className="col-6">
                        <InputField
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={onAddressChange}
                            onBlur={handleBlur}
                            placeholder="Enter your first name"
                            required
                            error={errors.first_name}
                            style={
                                touched.first_name &&
                                errors.first_name
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />
                    </div>

                    {/* Last Name */}
                    <div className="col-6">
                        <InputField
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={onAddressChange}
                            onBlur={handleBlur}
                            placeholder="Enter your last name"
                            required
                            error={errors.last_name}
                            style={
                                touched.last_name &&
                                errors.last_name
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />
                    </div>

                    {/* Country */}
                    <div className="col-md-6">
                        <label
                            htmlFor="country"
                            className="form-label"
                        >
                            Country
                        </label>

                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={onAddressChange}
                            className="form-select"
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
                            onBlur={handleBlur}
                            options={states}
                            placeholder="Select State"
                            required
                            error={errors.state}
                            style={
                                touched.state && errors.state
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />
                    </div>

                    {/* City */}
                    <div className="col-md-6">
                        <InputField
                            label="City"
                            name="city"
                            value={formData.city}
                            onChange={onAddressChange}
                            onBlur={handleBlur}
                            placeholder="Enter your city"
                            required
                            error={errors.city}
                            style={
                                touched.city && errors.city
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />
                    </div>

                    {/* PIN Code */}
                    <div className="col-md-6">
                        <InputField
                            label="PIN Code"
                            name="postcode"
                            value={formData.postcode}
                            onChange={onAddressChange}
                            onBlur={handleBlur}
                            placeholder="Enter your PIN code"
                            required
                            error={errors.postcode}
                            style={
                                touched.postcode &&
                                errors.postcode
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
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
                            onBlur={handleBlur}
                            placeholder="Enter your mobile number"
                            required
                            error={errors.phone}
                            style={
                                touched.phone && errors.phone
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />
                    </div>

                    {/* Address */}
                    <div className="col-12">
                        <TextareaField
                            label="Address"
                            name="address_1"
                            value={formData.address_1}
                            onChange={onAddressChange}
                            onBlur={handleBlur}
                            placeholder="Enter full address"
                            required
                            error={errors.address_1}
                            style={
                                touched.address_1 &&
                                errors.address_1
                                    ? FORM_ERROR_STYLE
                                    : {}
                            }
                        />
                    </div>

                    {/* Default Address */}
                    <div className="col-12">
                        <CheckboxField
                            label="Set as default address"
                            name="is_default"
                            checked={Boolean(formData.is_default)}
                            onChange={onAddressChange}
                        />
                    </div>
                </div>
            </CommonModal>
        </>
    );
}
