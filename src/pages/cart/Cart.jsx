import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { replace, useNavigate } from 'react-router-dom';
import { clearCart } from '../../features/cart/cartSlice';
import CartItems from './CartItems';

export default function Cart() {

    const {totalQuantity, totalAmount, itmes} =  useSelector((state)=> state.cart);
    
    const navigate = useNavigate();
    const dispatch =  useDispatch();

    useEffect(()=>{
        if(totalQuantity === 0) {
            dispatch(clearCart());
            navigate("/", 
                { replace: true }
            );
        }
    }, []);

    return (
       <>
         <section className='shopping-cart-page'>
                <div className='container'>
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
                                                />
                                            )
                                        })
                                    }
                                    
                                    
                                </tbody>
                            </table>
                            <div className='btn-group-cart'>
                                <a className='btn btn-light' href='#'>Clear Shopping Cart</a>
                                <a className='btn btn-dark' href='#'>Continue Shopping</a>
                                <a className='btn btn-primary' href='#'>Update Cart</a>
                            </div>
                            <div className='checkout-card shadow'>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                        <td>Subtotal</td>
                                        <td>&#8377;999.00</td>
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
                                        <td>&#8377;999.00</td>
                                    </tr>
                                  </tbody>
                                    
                                </table>
                                <a href='#' className='btn btn-primary w-100'>Proceed to checkout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
       </>
    )
}
