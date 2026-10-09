import React, { useEffect, useState } from "react";
import { service } from "../../api/service";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function SimilarProducts({ productId, onClick }) {
    const [similarLoader, setSimilarLoader] = useState(false);
    const [similarProductData, setSimilarProductData] = useState([]);

    const getAllSimilarProducts = async () => {
        try {
            setSimilarLoader(true);

            const response = await service.product.getRelated(
                productId,
                8
            );

            setSimilarProductData(response.data?.data || []);
        } catch (error) {
            console.error("Error fetching similar products:", error.message);
            setSimilarProductData([]);
        } finally {
            setSimilarLoader(false);
        }
    };

    useEffect(() => {
        if (productId) {
            getAllSimilarProducts();
        }
    }, [productId]);

    return (
        <section className="rs-listing-area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h3>Similar Images</h3>

                        {/* Display loader around the entire grid */}
                        <LoadingOverlay loading={similarLoader}>
                            <div className="rs-grid">
                                {similarProductData.map((item, index) => (
                                    <button
                                        className="rs-card"
                                        key={item.id ?? index}
                                        onClick={()=>onClick(item?.id, item?.id)}
                                    >
                                        <img
                                            src={item.image.src || ""}
                                            alt={item.name.src || "No image"}
                                            loading="lazy"
                                        />

                                        <figcaption>
                                            {item.name || "Similar image"}
                                        </figcaption>
                                    </button>
                                ))}

                                {!similarLoader &&
                                    similarProductData.length === 0 && (
                                        <p>No similar images found.</p>
                                    )}
                            </div>
                        </LoadingOverlay>
                    </div>
                </div>
            </div>
        </section>
    );
}
