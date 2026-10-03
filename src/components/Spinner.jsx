import React from "react";

export default function Spinner({
  size = "md", // "sm" | "md" | "lg"
  variant = "border", // "border" | "grow"
  color = "primary",
  opacity = 1,
  className = "",
  label = "",
  centered = false,
}) {
  const sizeClass = size === "sm" ? `spinner-${variant}-sm` : "";

  const spinnerClass = [
    `spinner-${variant}`,
    sizeClass,
    `text-${color}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const spinner = (
    <div
      className={spinnerClass}
      role="status"
      aria-label={label}
      aria-live="polite"
      style={{ opacity }}
    >
      <span className="visually-hidden">{label}</span>
    </div>
  );

  if (centered) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center w-100 h-100"
        role="status"
        aria-live="polite"
      >
        {spinner}

        <div className={`text-${color} mt-2`}>
          {label}
        </div>
      </div>
    );
  }

  return spinner;
}