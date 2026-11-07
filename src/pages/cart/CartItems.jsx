import React from 'react'
import { Link } from 'react-router-dom'

export default function CartItems({
    item, 
    deleteCartItem,
    handleDecrement, 
    handleIncrement, 
    handleImageLoad,
    handleImageError
}) {
    return (
       <>
        <tr 
            className="cart_item"
            key={item.productId}
            >
                                       
            <td className="product-remove">
                <button
                    type="button"
                    className="remove-btn"
                    aria-label={`Remove ${item.productName || "product"} from cart`}
                    onClick={() => deleteCartItem(item.productId)}
                >
                    <span aria-hidden="true">&times;</span>
                </button>
            </td>
            <td className="product-thumbnail">
                <Link 
                    to={`/product-details/${item.productId}/variants/${item.variantId}`}>
                    <img 
                        decoding="async" 
                        width="200" 
                        src={item?.thumbnail} 
                        onLoad={() => handleImageLoad(item.productId)}
                        onError={() => handleImageError(item.productId)}
                        />
                </Link>
            </td>
            <td className="product-name" data-title="Product">
                <Link to={`/product-details/${item.productId}/variants/${item.variantId}`}>{item?.name}</Link>
            </td>
            <td 
                className="product-price" 
                data-title="Price">
                <span 
                    className="woocommerce-Price-amount">
                    <bdi>
                        <span className="woocommerce-Price-currencySymbol">&#8377;</span>{Number(item?.price).toFixed(2)}
                    </bdi>
                </span>
            </td>
            <td className="product-quantity" data-title="Quantity">
                <div className="quantity d-inline-flex align-items-center quantity-control">
                    <button
                        type="button"
                        className="quantity-btn quantity-minus d-none"
                        onClick={()=>handleDecrement(item.productId)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>

                    <input
                        type="number"
                        className="quantity-input"
                        value={item.quantity}
                        min="1"
                        max="10000"
                        step="1"
                        readOnly
                        aria-label="Product quantity"
                    />

                    <button
                        type="button"
                        className="quantity-btn quantity-plus d-none"
                        onClick={()=>handleIncrement(item.productId)}
                        disabled={item.quantity >= 10000}
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            </td>
            <td className="product-subtotal" data-title="Total">
                <span className="woocommerce-Price-amount">
                    <bdi>
                        <span className="woocommerce-Price-currencySymbol">&#8377;</span>
                        {(Number(item?.price) * Number(item?.quantity)).toFixed(2)}
                    </bdi>
                </span>                        
            </td>
        </tr>
       </>
    )
}
