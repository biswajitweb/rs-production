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

                                        <div className='action-area'>
                                            <figcaption>
                                                {item?.name}
                                            </figcaption>
                                            <div className='btn-buy-icon'>
                                                <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall mui-4defme-downloadIcon" focusable="false" aria-hidden="true" viewBox="0 0 32 32" aria-label="download-icon"><path d="M24.933 15.733l-1.867-1.867-5.733 5.733V3.332h-2.667v16.267l-5.733-5.733-1.867 1.867 8.933 8.933 8.933-8.933zm-22.266 11.6V30h26.667v-2.667H2.667z"></path></svg>
                                            </div>
                                        </div>
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
