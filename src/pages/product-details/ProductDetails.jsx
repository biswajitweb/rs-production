import React, { lazy, useEffect, useOptimistic, useState, useTransition } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DOMPurify from "dompurify";


import { service } from '../../api/service';
import { addToCart } from '../../features/cart/cartSlice';
import { REDIRECT_DELAY } from '../../utils/staticImage';
import { getDeviceId } from '../../utils/deviceFingerprint';




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

const PostStats = lazy(()=>
    import('./PostStats')
);

export default function ProductDetails() {
    const { id, variantId } = useParams();

    const {store} = useSelector(state=> state.site.info);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

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

    const [serverLikes, setServerLikes] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [optimisticLikes, setOptimisticLikes] = useOptimistic(
        serverLikes,
        (currentLikes, nextLikes)=> nextLikes
    );

    

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
                Number(variantId),
                
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
     * Set like count 
    */

    useEffect(()=>{
        setServerLikes(Number(productDetails?.like) || 0);
    }, [productDetails?.id, productDetails?.like]);

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
     * Like / unlike product.
     *
     * Optimistically updates the UI, updates React Query cache
     * after API success, and refetches server data.
    */
    const onHandleLike = async(productId) =>{
        if(!productId) return;
        startTransition(async()=>{
            const previousLikes = serverLikes;
            const nextLikes = previousLikes === 1 ? 0 : 1;
            // Update the UI immediately.
            setOptimisticLikes(nextLikes);
            try {
            
                const deviceId = await getDeviceId();
                let requestData = {
                    id : productId,
                    device_id : deviceId
                };
                await service.product.updateLikeCount(requestData);
                
                // Update the React Query cache.
                queryClient.setQueryData(
                    ['product', Number(id), Number(variantId)],
                    (oldData) => {
                        if (!oldData) return oldData;

                        return {
                            ...oldData,
                            likes: nextLikes,
                            like: nextLikes,
                        };
                    }
                );
                // Save the confirmed state after API success.
                setServerLikes(nextLikes);
                // Refresh the product data from the server.
                await queryClient.invalidateQueries({
                    queryKey: ['product', Number(id), Number(variantId)],
                    exact: true,
                });
            } catch (error) {
                if(error) {
                    showToast(
                        error.message,
                        "error"
                    );
                }
            }
        })
       
    }

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

                                    <PostStats 
                                        likes={optimisticLikes}
                                        views={75}
                                        productId = {productDetails.id}
                                        onLike={ ()=>onHandleLike(productDetails.id) }
                                    />
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
                                                {productDetails?.image_meta &&
                                                    Object.entries(productDetails.image_meta).filter(
                                                        ([key, value]) =>
                                                            value !== "" &&
                                                            value !== null &&
                                                            value !== undefined
                                                    ).length > 0 ? (
                                                        Object.entries(productDetails.image_meta)
                                                            .filter(
                                                                ([key, value]) =>
                                                                    value !== "" &&
                                                                    value !== null &&
                                                                    value !== undefined
                                                            )
                                                            .map(([key, value]) => (
                                                                <tr key={key}>
                                                                    <th scope="row">
                                                                        {key
                                                                            .replace(/_/g, " ")
                                                                            .replace(/\b\w/g, char => char.toUpperCase())}
                                                                    </th>
                                                                    <td>{value}</td>
                                                                </tr>
                                                            ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="2" className="text-center text-muted">
                                                                No additional image information to display.
                                                            </td>
                                                        </tr>
                                                    )}
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
                                    {store?.woocommerce_pos_store_phone && (
                                        <h3 className="p-phone">
                                            {store.woocommerce_pos_store_phone}
                                        </h3>
                                    )}
                                    

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