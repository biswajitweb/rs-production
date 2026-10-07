
import React from "react";

export default function TextareaField({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    rows = 4,
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

            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                className={`form-control ${
                    error ? "is-invalid" : ""
                }`}
            />

            {error && (
                <div className="text-danger small mt-1">
                    {error}
                </div>
            )}

        </div>
    );
}
