import React from 'react'

export default function CartItems({
    item
}) {
    return (
       <>
        <tr 
            class="cart_item"
            key={item.productId}
            >
                                       
            <td class="product-remove">
                <a href="#" class="remove" aria-label="" data-product_id="" data-product_sku="">&times;</a>
            </td>
            <td class="product-thumbnail">
                <a href="#">
                    <img 
                        decoding="async" 
                        width="200" 
                        src={item?.thumbnail} />
                </a>
            </td>
            <td class="product-name" data-title="Product">
                <a href="#">{item?.name}</a>
            </td>
            <td 
                class="product-price" 
                data-title="Price">
                <span 
                    class="woocommerce-Price-amount">
                    <bdi>
                        <span class="woocommerce-Price-currencySymbol">&#8377;</span>{Number(item?.price).toFixed(2)}</bdi></span>
            </td>
            <td class="product-quantity" data-title="Quantity">
                <div class="quantity">
                    <span class="input-button minus"></span>
                    <input 
                        type="number" 
                        id="quantity_6abe3a9bb90ea" 
                        class="input-text qty text form-control" 
                        name="" 
                        value={item.quantity} 
                        aria-label="Product quantity" 
                        size="4" 
                        min="0" 
                        max="10000" 
                        step="1" 
                        placeholder="" 
                        inputmode="numeric" 
                        autocomplete="off" 
                    />
                    <span class="input-button plus"></span>
                </div>
            </td>
            <td class="product-subtotal" data-title="Total">
                <span class="woocommerce-Price-amount">
                    <bdi>
                        <span class="woocommerce-Price-currencySymbol">&#8377;</span>
                        {(Number(item?.price) * Number(item?.quantity)).toFixed(2)}
                    </bdi>
                </span>                        
            </td>
        </tr>
       </>
    )
}
