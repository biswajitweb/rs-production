const PageLoader = () => {
    return (
        <div
            className="page-loader d-flex justify-content-center align-items-center"
            role="status"
            aria-label="Loading page"
        >
            <div className="spinner-border" aria-hidden="true" />
            <span className="visually-hidden">
                Loading page...
            </span>
        </div>
    );
};

export default PageLoader;