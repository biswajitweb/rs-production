const ProductSkeleton = () => {
    return (
        <div className="row g-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div className="col-6 col-md-4 col-lg-3" key={index}>
                    <div className="product-skeleton">
                        <div className="skeleton-image" />

                        <div className="skeleton-line" />

                        <div className="skeleton-line short" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSkeleton;