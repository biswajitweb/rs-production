import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, replace, useLocation, useNavigate } from 'react-router-dom';
import { clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from '../../features/cart/cartSlice';
import CartItems from './CartItems';
import { calculateTax } from '../../utils/calculateTax';

const Toast = lazy(()=>
    import('../../components/Toast')
);

const Spinner = lazy(() => 
    import("../../components/Spinner")
);

export default function Cart() {

    const {totalQuantity, totalAmount, itmes} =  useSelector((state)=> state.cart);
    
    const navigate = useNavigate();
    const dispatch =  useDispatch();
    const location = useLocation();
    const {authToken} =  useSelector((state)=>state.user);
    const [isLoading, setIsLoading] = useState(true);
    
    const taxWithAmount = calculateTax(totalAmount);

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
     * Cart initialization
    */
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, []);
    

    useEffect(()=>{
        if(totalQuantity === 0) {
            dispatch(clearCart());
            navigate("/", 
                { replace: true }
            );
        }
    }, []);

    const deleteCartItem = (productId)=>{
        if(productId) {
            dispatch(removeFromCart(productId));
            showToast(
                "Item removed from your cart successfully!",
                "success"
            );
        }
    }

    const removeAllItemsFromCart = ()=>{
        dispatch(clearCart())
        showToast(
            "All items have been removed from your cart!",
            "success"
        );
    }

    const handleIncrement = (productId)=>{
        if(productId) {
            dispatch(increaseQuantity(productId));
        }
    }

    const handleDecrement = (productId)=>{
        if(productId) {
            dispatch(decreaseQuantity(productId));
        }
    }

    const onHandlePageRequest = ()=>{
        const pageRequest = (authToken === null) ? "/sign-in" : "/checkout";
        navigate(pageRequest, {
            state: {
                from: location.pathname
            }
        });

    }

    if (isLoading) {
        return (
            <section className="shopping-cart-page">
                <div className="container">
                    <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{ minHeight: "400px" }}
                    >
                        <Spinner
                            centered={true}
                            label="Loading cart..."
                            color="primary"
                        />
                    </div>
                </div>
            </section>
        );
    }

    return (
       <>
        <section className='shopping-cart-page'>
                <div className='container'>
                    {
                        totalQuantity === 0 ? (
                            <>
                                <div className="row">
                                    <div className="col-12 text-center py-5">
                                        <h2>Your Cart is Empty</h2>
                                        <p className="text-muted mb-4">
                                            You haven't added any products to your cart yet.
                                        </p>

                                        <div className="d-flex justify-content-center gap-2">
                                            <Link to="/" className="btn custom-btn btn-primary">
                                                Continue Shopping
                                            </Link>

                                            <Link to="/" className="btn custom-btn btn-light">
                                                Go to Home
                                            </Link>
                                        </div>
                                    </div>
                                </div>   
                            </>
                        ) : (
                            <>
                            <div className='row'>
                                <div className='col-12'>
                                    <h1 className='page-heading'>Shopping Cart</h1>
                                        <div className='table-responsive'>
                                            <table className='table'>
                                                <thead>
                                                    <tr>
                                                        <th className="product-remove"><span className="screen-reader-text">&nbsp;</span></th>
                                                        <th className="product-thumbnail"><span className="screen-reader-text">Image</span></th>
                                                        <th className="product-name">Product</th>
                                                        <th className="product-price">Price</th>
                                                        <th className="product-quantity">Quantity</th>
                                                        <th className="product-subtotal">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        (Array.isArray(itmes) && itmes.length > 0) &&
                                                        itmes.map((item, index) => {
                                                            return (
                                                                <CartItems
                                                                    item={item}
                                                                    key={index}
                                                                    deleteCartItem={deleteCartItem}
                                                                    handleIncrement={handleIncrement}
                                                                    handleDecrement={handleDecrement}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                   
                                    <div className='btn-group-cart'>
                                        <button 
                                            className='btn btn-light'
                                            onClick={removeAllItemsFromCart}
                                            >
                                                Clear Shopping Cart
                                        </button>
                                        <Link className='btn btn-dark' to='/'>Continue Shopping</Link>
                                    </div>
                                    <div className='checkout-card shadow'>
                                            <div className='table-responsive'>
                                                <table className='table'>
                                                    <thead>
                                                        <tr>
                                                            <td>Subtotal</td>
                                                            <td>&#8377;{Number(totalAmount || 0).toFixed(2)}</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Shipping</td>
                                                            <td>Free shipping</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Tax</td>
                                                            <td>18%</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Total</td>
                                                            <td>&#8377;{taxWithAmount.total}</td>
                                                        </tr>
                                                    </tbody>

                                                </table>
                                            </div>
                                        
                                        <button 
                                            onClick={onHandlePageRequest}
                                            className='btn custom-btn btn-primary w-100'>
                                                Proceed to checkout
                                        </button>
                                    </div>
                                </div>
                            </div>
                            </>
                        )
                    }
                    
                </div>
        </section>
        <Toast
            show={toast.show}
            message={toast.message}
            type={toast.type}
            duration={3000}
            onClose={closeToast}
        />
       </>
    )
}
