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


    const getProductDetailsById = async()=>{
        try {
            setLoading(true);
            setImageLoading(true);
            setThumbnailLoading(true);

            if (!id || !variantId) {
                return;
            }
            const response = await service.product.getById(
                Number(id), Number(variantId)
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
            getProductDetailsById();
        }
       
    }, [id, variantId]);

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
                                            className="btn btn-buy-now"
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
                !loading && <SimilarProducts/>
            }
            
        </>
    )
}
