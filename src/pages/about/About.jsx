import React from 'react'

export default function About() {
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
                                    <tr class="cart_item">
                                        <td class="product-remove">
                                            <a href="#" class="remove" aria-label="" data-product_id="" data-product_sku="">&times;</a>
                                        </td>
                                        <td class="product-thumbnail">
                                            <a href="#"><img decoding="async" width="200" src='https://rabisankar.com/staging/wp-content/uploads/2026/09/869547895210-300x300.jpg' /></a>
                                        </td>
                                        <td class="product-name" data-title="Product">
                                            <a href="#">Birhor Tribal Performers Celebrating Culture</a>
                                        </td>
                                        <td class="product-price" data-title="Price">
                                            <span class="woocommerce-Price-amount"><bdi><span class="woocommerce-Price-currencySymbol">&#8377;</span>999.00</bdi></span>
                                        </td>
                                        <td class="product-quantity" data-title="Quantity">
                                            <div class="quantity">
                                                <span class="input-button minus"></span>
                                                <input type="number" id="quantity_6abe3a9bb90ea" class="input-text qty text form-control" name="" value="1" aria-label="Product quantity" size="4" min="0" max="10000" step="1" placeholder="" inputmode="numeric" autocomplete="off" />
                                                <span class="input-button plus"></span>
                                            </div>
                                        </td>
                                        <td class="product-subtotal" data-title="Total">
                                            <span class="woocommerce-Price-amount"><bdi><span class="woocommerce-Price-currencySymbol">&#8377;</span>999.00</bdi></span>                        </td>
                                    </tr>
                                    <tr class="cart_item">
                                        <td class="product-remove">
                                            <a href="#" class="remove" aria-label="" data-product_id="" data-product_sku="">&times;</a>
                                        </td>
                                        <td class="product-thumbnail">
                                            <a href="#"><img decoding="async" width="200" src='https://rabisankar.com/staging/wp-content/uploads/2026/09/365745895210-300x300.jpg' /></a>
                                        </td>
                                        <td class="product-name" data-title="Product">
                                            <a href="#">Traditional Birhor Dance and Tribal Culture</a>
                                        </td>
                                        <td class="product-price" data-title="Price">
                                            <span class="woocommerce-Price-amount"><bdi><span class="woocommerce-Price-currencySymbol">&#8377;</span>999.00</bdi></span>
                                        </td>
                                        <td class="product-quantity" data-title="Quantity">
                                            <div class="quantity">
                                                <span class="input-button minus"></span>
                                                <input type="number" id="quantity_6abe3a9bb90ea" class="input-text qty text form-control" name="" value="1" aria-label="Product quantity" size="4" min="0" max="10000" step="1" placeholder="" inputmode="numeric" autocomplete="off" />
                                                <span class="input-button plus"></span>
                                            </div>
                                        </td>
                                        <td class="product-subtotal" data-title="Total">
                                            <span class="woocommerce-Price-amount"><bdi><span class="woocommerce-Price-currencySymbol">&#8377;</span>999.00</bdi></span>                        </td>
                                    </tr>
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
