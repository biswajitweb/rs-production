export default function NoProductsFound() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="text-center py-4">
                        {/* Icon */}
                        <div className="mb-3">
                            <div
                                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                style={{
                                    width: "90px",
                                    height: "90px",
                                }}
                            >
                                <i
                                    className="bi bi-bag-x text-secondary"
                                    style={{ fontSize: "2.5rem" }}
                                ></i>
                            </div>
                        </div>
                        {/* Content */}
                        <h5 className="fw-semibold mb-2">
                            No Products Found
                        </h5>

                        <p className="text-muted small mb-4 mx-auto">
                            We couldn't find any products matching your
                            search or selected filters.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}