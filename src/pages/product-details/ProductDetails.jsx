import React, { lazy, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { service } from '../../api/service';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';


const SimilarProducts = lazy(()=>import('./SimilarProducts'));
const Spinner = lazy(()=>import('../../components/Spinner'));


export default function ProductDetails() {
    const {id, variantId} =  useParams();
    const [productDetails, setProductDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState(true);
    const [thumbnailLoading, setThumbnailLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const getProductDetailsById = async(productId, variantId )=>{
        try {
            setLoading(true);
            setImageLoading(true);
            setThumbnailLoading(true);

            if (!productId || !variantId) {
                return;
            }
            const response = await service.product.getById(
                Number(productId), Number(variantId)
            );
            setProductDetails(response.data?.data ?? {});
            const price = Number(response.data?.data?.price) || 0;
            const quantityPrice = 1;
            setTotalPrice(price * quantityPrice);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setImageLoading(false);
            setThumbnailLoading(false);
        }
    }

    useState(()=>{
        if(id && variantId) {
            getProductDetailsById(id, variantId);
        }
       
    }, [id, variantId]);

    const updateProduct = (productId, variantId)=>{
       if(productId && variantId) {
            getProductDetailsById(productId, variantId);
            navigate(`/product-details/${productId}/variants/${variantId}`, {
                replace : true
            })
            
       }
        
    }

    const handleQuantityIncrement = ()=>{
        const updateQty = quantity+1;
        const price = Number(productDetails?.price) || 0;
        setTotalPrice(price * updateQty);
        setQuantity(updateQty);
    }  

    const handleQuantityDecrement  = ()=>{
        if(quantity > 1) {
            const updateQty = quantity-1;
            const price = Number(productDetails?.price) || 0;
            setTotalPrice(price * updateQty);
            setQuantity(updateQty);
        }
    }

    const onHandleAddToCart = ()=>{
        const preparingCart = {
            productId: id,
            variantId : variantId,
            quantity : 1,
            name : productDetails?.name,
            price : Number(totalPrice).toFixed(2),
            full_image : productDetails?.image?.src,
            thumbnail : productDetails?.image?.thumbnail,
        };
        dispatch(addToCart(preparingCart));
        navigate(`/cart`);
    }

    if (loading) {
        return (
            <div className="row">
                {" "}
                <div className="col-12" style={{ minHeight: "300px" }}>
                    {" "}
                    <Spinner
                        centered
                        label="Loading product..."
                        color="success"
                    />{" "}
                </div>{" "}
            </div>
        );
    }
    
    return (
        <>
            {
                !loading && 
                    <section className="rs-list-details mt-4">
                    <div 
                        className="container">
                        
                        <div 
                            className="row"
                            style={{minHeight:"300px"}}
                            >
                        
                            <div className="col-12">
                                <div className="rs-list-details-wrap">
                                    <div className="header-col-left">
                                        <img src={productDetails?.image?.src}/>
                                        <div className='rs-stats'>
                                                    <a href='#' className='rs-like'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-suit-heart" viewBox="0 0 16 16">
                                                        <   path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                                                        </svg>
                                                        <span>1</span>
                                                    </a>
                                                    <div className='rs-view'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                                                        </svg>
                                                        <span>75</span>
                                                    </div>
                                            </div>
                                    </div>
                                    <div className="header-col-right">
                                        <h1 className="p-heading">{productDetails?.name}</h1>
                                        <p className="p-description">
                                            { productDetails?.description }
                                            
                                        </p>
                                        <h3 className="p-price">₹{Number(totalPrice).toFixed(2)}</h3>
                                        <div className="table-responsive">
                                            <table className="table table-borderless p-table">
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">Location</th>
                                                        <td>Koraput, Odisha, India</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Date taken</th>
                                                        <td>25 July 2026</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Category</th>
                                                        <td>Tribal Culture</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">File Format</th>
                                                        <td>JPG</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Dimensions</th>
                                                        <td>6000 × 4000</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">File Size</th>
                                                        <td>12.4 MB</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Orientation</th>
                                                        <td>Landscape</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">License</th>
                                                        <td>Commercial</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <button 
                                            className="btn btn-primary btn-buy-now"
                                            onClick={()=>onHandleAddToCart()} 
                                            >
                                            <span>Buy Now</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                                            </svg>
                                        </button>
                                        <p className="p-question">Have a question about this photo?</p>
                                        <h3 className="p-phone">+91-88952-67838</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
            
            {
                !loading && <SimilarProducts
                    productId = {id}
                    onClick={(productId, variantId) =>
                        updateProduct(productId, variantId)
                    }
                />
            }
            
        </>
    )
}
