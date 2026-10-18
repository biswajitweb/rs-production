import React, { lazy, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import DOMPurify from "dompurify";


import { service } from '../../api/service';
import { addToCart } from '../../features/cart/cartSlice';
import { REDIRECT_DELAY } from '../../utils/staticImage';


const SimilarProducts = lazy(() => 
    import('./SimilarProducts')
);
const Spinner = lazy(() => 
    import('../../components/Spinner')
);
const Toast = lazy(()=>
    import('../../components/Toast')
);

const SEO = lazy(()=>
    import('../../components/SEO')
);

export default function ProductDetails() {
    const { id, variantId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({
            show: true,
            message,
            type,
        });
    };

    const closeToast = () => {
        setToast((prev) => ({
            ...prev,
            show: false,
        }));
    };

    

    /**
     * Fetch product details
     */
    const {
        data: productDetails = {},
        isLoading,
        isError,
        error,
        isFetching,
    } = useQuery({
        queryKey: ['product', Number(id), Number(variantId)],

        queryFn: async () => {
            const response = await service.product.getById(
                Number(id),
                Number(variantId)
            );

            return response.data?.data ?? {};
        },

        enabled: Boolean(id && variantId),

        staleTime: 5 * 60 * 1000,

        retry: 2,
    });

    /**
     * Update total price whenever
     * product price or quantity changes
     */
    useEffect(() => {
        const price = Number(productDetails?.price) || 0;

        setTotalPrice(price * quantity);
    }, [productDetails?.price, quantity]);

    /**
     * Reset quantity when variant changes
     */
    useEffect(() => {
        setQuantity(1);
    }, [id, variantId]);

    /**
     * Change product / variant
     */
    const updateProduct = (productId, newVariantId) => {
        if (!productId || !newVariantId) {
            return;
        }

        navigate(
            `/product-details/${productId}/variants/${newVariantId}`,
            {
                replace: true,
            }
        );
    };

    /**
     * Increase quantity
     */
    const handleQuantityIncrement = () => {
        setQuantity((previousQuantity) => previousQuantity + 1);
    };

    /**
     * Decrease quantity
     */
    const handleQuantityDecrement = () => {
        setQuantity((previousQuantity) =>
            Math.max(1, previousQuantity - 1)
        );
    };

    /**
     * Add product to cart
     */
    const onHandleAddToCart = () => {
        if (!productDetails?.id) {
            return;
        }

        const preparingCart = {
            productId: Number(id),
            variantId: Number(variantId),
            quantity,
            name: productDetails?.name,
            price: Number(productDetails?.price || 0).toFixed(2),
            full_image: productDetails?.image?.src,
            thumbnail: productDetails?.image?.thumbnail,
            product_code : productDetails?.product_code || ''
        };

        dispatch(addToCart(preparingCart));
        showToast(
            "Added to cart successfully!",
            "success"
        );

        setTimeout(() => {
            navigate('/cart');     
        }, REDIRECT_DELAY);

       
    };

    /**
     * Loading state
     */
    if (isLoading) {
        return (
            <div className="row">
                <div
                    className="col-12"
                    style={{ minHeight: '300px' }}
                >
                    <Spinner
                        centered
                        label="Loading product..."
                        color="primary"
                    />
                </div>
            </div>
        );
    }

    /**
     * Error state
     */
    if (isError) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <h5>Unable to load product</h5>

                    <p className="mb-0">
                        {error?.message ||
                            'Something went wrong while loading the product.'}
                    </p>
                </div>
            </div>
        );
    }

    /**
     * Product not found
     */
    if (!productDetails?.id) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning">
                    Product not found.
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={productDetails?.name}
                description={
                    productDetails?.short_description ||
                    productDetails?.description ||
                    "Explore product details and pricing."
                }
                canonical={`/product-details/${id}/variants/${variantId}`}
                image={productDetails?.image?.src}
                noIndex={!productDetails}
                type="product"
            />
            <section className="rs-list-details mt-4">
                <div className="container">
                    <div
                        className="row"
                        style={{ minHeight: '300px' }}
                    >
                        <div className="col-12">
                            <div className="rs-list-details-wrap">

                                {/* Product Image */}
                                <div className="header-col-left">
                                    <img
                                        src={productDetails?.image?.src}
                                        alt={productDetails?.name || 'Product'}
                                    />

                                    <div className="rs-stats">

                                        <a
                                            href="#"
                                            className="rs-like"
                                            onClick={(event) =>
                                                event.preventDefault()
                                            }
                                        >
                                            <i className="bi bi-suit-heart" />
                                            <span>1</span>
                                        </a>

                                        <div className="rs-view">
                                            <i className="bi bi-eye" />
                                            <span>75</span>
                                        </div>

                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="header-col-right">

                                    <h1 className="p-heading">
                                        {productDetails?.name}
                                    </h1>

                                    
                                        <div
                                            className="p-description"
                                            dangerouslySetInnerHTML={{
                                                __html: DOMPurify.sanitize(productDetails?.description || ""),
                                            }}
                                        />

                                    <h3 className="p-price">
                                        ₹{Number(totalPrice).toFixed(2)}
                                    </h3>

                                    <div className="table-responsive">
                                        <table className="table table-borderless p-table">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        Location
                                                    </th>
                                                    <td>
                                                        Koraput, Odisha, India
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        Date taken
                                                    </th>
                                                    <td>
                                                        25 July 2026
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        Category
                                                    </th>
                                                    <td>
                                                        Tribal Culture
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        File Format
                                                    </th>
                                                    <td>
                                                        JPG
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        Dimensions
                                                    </th>
                                                    <td>
                                                        6000 × 4000
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        File Size
                                                    </th>
                                                    <td>
                                                        12.4 MB
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        Orientation
                                                    </th>
                                                    <td>
                                                        Landscape
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">
                                                        License
                                                    </th>
                                                    <td>
                                                        Commercial
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Quantity */}
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={handleQuantityDecrement}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>

                                        <span className="px-3">
                                            {quantity}
                                        </span>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={handleQuantityIncrement}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Buy Now */}
                                    <button
                                        type="button"
                                        className="btn custom-btn btn-primary btn-buy-now"
                                        onClick={onHandleAddToCart}
                                    >
                                        <span>Buy Now</span>

                                        <i className="bi bi-arrow-right ms-2" />
                                    </button>

                                    <p className="p-question">
                                        Have a question about this photo?
                                    </p>

                                    <h3 className="p-phone">
                                        +91-88952-67838
                                    </h3>

                                    {/* Optional background refetch indicator */}
                                    {isFetching && !isLoading && (
                                        <small className="text-muted">
                                            Updating product...
                                        </small>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            
            <SimilarProducts
                productId={id}
                onClick={(productId, newVariantId) =>
                    updateProduct(productId, newVariantId)
                }
            />

            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                duration={3000}
                onClose={closeToast}
            />
        </>
    );
}