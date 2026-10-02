import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, replace, useNavigate } from 'react-router-dom';
import { clearCart, decreaseQuantity, increaseQuantity, removeFromCart } from '../../features/cart/cartSlice';
import CartItems from './CartItems';
import { calculateTax } from '../../utils/calculateTax';

export default function Cart() {

    const {totalQuantity, totalAmount, itmes} =  useSelector((state)=> state.cart);
    
    const navigate = useNavigate();
    const dispatch =  useDispatch();


    const taxWithAmount = calculateTax(totalAmount);
    

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
        }
    }

    const removeAllItemsFromCart = ()=>{
        dispatch(clearCart())
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
                                            <Link to="/" className="btn btn-primary">
                                                Continue Shopping
                                            </Link>

                                            <Link to="/" className="btn btn-light">
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
                                    <table className='table'>
                                        <thead>
                                            <tr>
                                                <th class="product-remove"><span class="screen-reader-text">&nbsp;</span></th>
                                                <th class="product-thumbnail"><span class="screen-reader-text">Image</span></th>
                                                <th class="product-name">Product</th>
                                                <th class="product-price">Price</th>
                                                <th class="product-quantity">Quantity</th>
                                                <th class="product-subtotal">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                (Array.isArray(itmes) && itmes.length > 0) &&
                                                itmes.map((item, index)=>{
                                                    return (
                                                        <CartItems 
                                                            item = {item}
                                                            key={index}
                                                            deleteCartItem= {deleteCartItem}
                                                            handleIncrement = {handleIncrement}
                                                            handleDecrement= {handleDecrement}
                                                        />
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
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
                                        <a href='#' className='btn btn-primary w-100'>Proceed to checkout</a>
                                    </div>
                                </div>
                            </div>
                            </>
                        )
                    }
                    
                </div>
        </section>
       </>
    )
}
