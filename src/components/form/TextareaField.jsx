import React from "react";

export default function TextareaField({
    label,
    name,
    value,
    onChange,
    onBlur,
    placeholder = "",
    rows = 4,
    required = false,
    error = "",
    disabled = false,
    style = {},
    max
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
                onBlur={onBlur}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                required={required}
                maxLength={max}
                className={`form-control ${
                    error ? "is-invalid" : ""
                }`}
                style={style}
            />

            {error && (
                <div className="text-danger small mt-1">
                    {error}
                </div>
            )}
        </div>
    );
}
