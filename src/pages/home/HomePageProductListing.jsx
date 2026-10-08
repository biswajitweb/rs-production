import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pagination } from '../../api/pagination';
import { service } from '../../api/service';
import Spinner from '../../components/Spinner';

export default function HomePageProductListing() {

    const [params, setParams] = useState(pagination.HOME_PAGE);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(
        pagination.HOME_PAGE.page
    );
    const [loading, setLoading] = useState(false);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);

    const getShopProduct = async (page = 1, loadMore = false) => {
        try {
            if (loadMore) {
                setLoadMoreLoading(true);
            } else {
                setLoading(true);
            }

            const requestParams = {
                ...params,
                page
            };

            const response = await service.product.getAll(requestParams);

            const productData = response?.data;

            const newProducts = Array.isArray(productData?.data)
                ? productData.data
                : [];

            const totalRecords = Number(
                productData?.meta?.total_records ?? 0
            );

            const pages = Number(
                productData?.meta?.total_pages ?? 0
            );

            setTotal(totalRecords);
            setTotalPages(pages);

            if (loadMore) {
                setProducts(previousProducts => [
                    ...previousProducts,
                    ...newProducts
                ]);
            } else {
                setProducts(newProducts);
            }

            // Update current page only after successful API response
            setCurrentPage(page);

        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            if (loadMore) {
                setLoadMoreLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const firstPage = pagination.HOME_PAGE.page;

        setCurrentPage(firstPage);
        setProducts([]);

        getShopProduct(firstPage, false);

    }, [params]);

    const handleLoadMore = () => {

        if (loading || loadMoreLoading) {
            return;
        }

        if (currentPage >= totalPages) {
            return;
        }

        const nextPage = currentPage + 1;

        getShopProduct(nextPage, true);
    };

    const hasMoreProducts =
        currentPage < totalPages;

    return (
        <section className="rs-listing-area">
            <div className="container">
                <div className="row">
                    <div
                        className="col-12"
                        style={{ minHeight: '300px' }}
                    >

                        {/* Initial Loading */}
                        {loading && (
                            <Spinner
                                centered={true}
                                label="Loading products..."
                                color="success"
                            />
                        )}

                        {/* Product Grid */}
                        <div
                            className="rs-grid"
                            style={{
                                opacity: loading ? 0.2 : 1
                            }}
                        >
                            {products.length > 0 &&
                                products.map((item, index) => (
                                    <Link
                                        to={`/product-details/${item.id}/variants/${item.variant_id}`}
                                        className="rs-card"
                                        key={item.id ?? index}
                                    >
                                        <img
                                            src={item?.image?.src}
                                            alt={item?.name || 'Product'}
                                            loading="lazy"
                                        />

                                        <figcaption>
                                            {item?.name}
                                        </figcaption>
                                    </Link>
                                ))
                            }
                        </div>

                        {/* Load More Loading */}
                        {loadMoreLoading && (
                            <div className="mt-4">
                                <Spinner
                                    centered={true}
                                    color="primary"
                                    label="Loading more products..."
                                />
                            </div>
                        )}

                        {/* Load More Button */}
                        {!loading &&
                            !loadMoreLoading &&
                            products.length > 0 &&
                            hasMoreProducts && (
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        className="btn rs-grid-loader"
                                        onClick={handleLoadMore}
                                    >
                                        Load more
                                    </button>
                                </div>
                            )}

                        {/* No Products */}
                        {!loading &&
                            !loadMoreLoading &&
                            products.length === 0 && (
                                <div className="text-center py-5">
                                    <p className="mb-0">
                                        No products found.
                                    </p>
                                </div>
                            )}

                    </div>
                </div>
            </div>
        </section>
    );
}