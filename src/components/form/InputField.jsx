import React from 'react'
import { FORM_ERROR_STYLE } from '../../utils/formStyles'

export default function InputField({
    label,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder = "",
    required = false,
    error = "",
    disabled = false,
    className = "",
    style = {}
}) {
    return (
        <>
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
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`form-control ${
                        error ? "is-invalid" : ""
                    } ${className}`}
                    style={style}
                />
                {error && (
                    <div className="text-danger small mt-1">
                        {error}
                    </div>
                )}
            </div>
        </>
    )
}
