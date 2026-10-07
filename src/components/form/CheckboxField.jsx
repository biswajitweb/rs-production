import React from "react";

export default function CheckboxField({
    label,
    name,
    checked,
    onChange,
    disabled = false
}) {
    return (
        <div className="form-check mb-3">

            <input
                id={name}
                name={name}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="form-check-input"
            />

            <label
                htmlFor={name}
                className="form-check-label"
            >
                {label}
            </label>

        </div>
    );
}