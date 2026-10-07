import React from "react";

export default function SelectField({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = "Select",
    required = false,
    error = "",
    disabled = false
}) {
    return (
        <div className="mb-3">

            <label
                htmlFor={name}
                className="form-label"
            >
                {label}

                {required && (
                    <span className="text-danger ms-1">
                        *
                    </span>
                )}
            </label>

            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`form-select ${
                    error ? "is-invalid" : ""
                }`}
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>

            {error && (
                <div className="text-danger small mt-1">
                    {error}
                </div>
            )}

        </div>
    );
}
