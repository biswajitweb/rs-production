import React from "react";

const Offcanvas = ({
    id,
    title,
    placement = "end",
    width,
    height,
    children,
}) => {

    const style = {};

    if (width) {
        style.width = width;
    }

    if (height) {
        style.height = height;
    }

    return (
        <div
            className={`offcanvas offcanvas-${placement}`}
            tabIndex="-1"
            id={id}
            aria-labelledby={`${id}Label`}
            style={style}
        >
            <div className="offcanvas-header">
                <h5
                    className="offcanvas-title"
                    id={`${id}Label`}
                >
                    {title}
                </h5>

                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                />
            </div>

            <div className="offcanvas-body">
                {children}
            </div>
        </div>
    );
};

export default Offcanvas;