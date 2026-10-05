import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { calculateTax } from '../../utils/calculateTax';
import { decryptData } from '../../utils/encryption';
import { service } from '../../api/service';
import { clearCart } from '../../features/cart/cartSlice';


const Spinner = lazy(()=>import('../../components/Spinner'));

export default function Checkout() {

    const {authToken} =  useSelector((state)=>state.user);
    const {totalQuantity, totalAmount, itmes} =  useSelector((state)=> state.cart);
    const taxWithAmount = calculateTax(totalAmount);
    const navigate = useNavigate();
    const  dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState({});
    const [orderLoader, setOrderLoader] = useState(false);
    
    useEffect(()=>{
        if (!authToken || !itmes || itmes.length === 0) {
            navigate(`/`);
        }
    }, [authToken, itmes, navigate]);

    const decryptAuth = async () => {
        if (!authToken) {
            return;
        }
        try {
            const userDecrypt = await decryptData(authToken);
            setUserInfo(userDecrypt?.data);
            
        } catch (error) {
            console.error("Decrypt error:", error);
        }
    };

     useEffect(() => {
        decryptAuth();
    }, [authToken]);

    const onPlaceOrder = async()=>{
        if(userInfo) {
            const result = itmes.map(({ productId, quantity }) => ({
                product_id : productId,
                quantity
            }));
            let orderData = {
                customer_id : userInfo.id,
                payment_method : "cod",
                payment_method_title : "Cash on Delivery",
                tax_rate : 18,
                billing : userInfo?.billing,
                shipping : userInfo?.shipping,
                line_items : result
            };
            try {
                setOrderLoader(true);
                const response = await service.order.create(orderData);
                const orderResponse = response.data;
                const orderId = orderResponse?.data?.id;
                if(orderId > 0 ) {
                    
                    navigate(`/order-success`, {
                        replace : true
                    });
                    //dispatch(clearCart());

                }
            } catch (error) {
                if(error) {

                }
            } finally {
                setOrderLoader(false);
            }
            
        }
    }


    return (
        <>
            <section className='checkout-page'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <h1 className='page-heading'>Checkout</h1>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <h3 className='mb-4'>Billing details</h3>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div class="mb-3">
                                            <label for="fname" class="form-label">First Name <span class="text-danger" aria-hidden="true">*</span></label>
                                            <div></div>
                                                <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    id="fname" 
                                                />
                                            </div>
                                        </div>
                                         <div className='col-md-6'>
                                            <div class="mb-3">
                                            <label for="lname" class="form-label">Last Name <span class="text-danger" aria-hidden="true">*</span></label>
                                            <div></div>
                                                <input 
                                                    type="text" 
                                                    class="form-control" 
                                                    id="lname" 
                                                />
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div class="mb-3">
                                            <label for="lname" class="form-label">Country <span class="text-danger" aria-hidden="true">*</span></label>
                                            <div></div>
                                            <select class="form-select" aria-label="Default select example">
                                                <option selected>Select</option>
                                                <option value="1">India</option>
                                                <option value="2">USA</option>
                                                <option value="3">UK</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div class="mb-3">
                                            <label for="lname" class="form-label">State <span class="text-danger" aria-hidden="true">*</span></label>
                                            <div></div>
                                            <select class="form-select" aria-label="Default select example">
                                                <option selected>Select</option>
                                                <option value="1">Odisha</option>
                                                <option value="2">Maharastra</option>
                                                <option value="3">Gujarat</option>
                                                </select>
                                            </div>
                                        </div>
                                         <div className='col-md-12'>
                                            <div class="mb-3">
                                            <label for="city" class="form-label">Town / City <span class="text-danger" aria-hidden="true">*</span></label>
                                            <input type="text" class="form-control" id="city" />
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div class="mb-3">
                                            <label for="city" class="form-label">PIN Code <span class="text-danger" aria-hidden="true">*</span></label>
                                            <input type="text" class="form-control" id="city" />
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div class="mb-3">
                                            <label for="city" class="form-label">Phone <span class="text-danger" aria-hidden="true">*</span></label>
                                            <input type="text" class="form-control" id="city" />
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div class="mb-3">
                                            <label for="city" class="form-label">Email address <span class="text-danger" aria-hidden="true">*</span></label>
                                            <input type="text" class="form-control" id="city" />
                                            </div>
                                        </div>
                                        <div className='col-md-12'>
                                            <div class="mb-3">
                                            <label for="city" class="form-label">Order notes (optional)</label>
                                            <textarea className='form-control'></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    (Array.isArray(itmes) && itmes.length > 0) &&  
                                    <div className='col-md-6'>
                                        <h3 className='mb-4'>Your order</h3>
                                        <div className='card'>
                                            <div className='card-body'>
                                                <table className='table'>
                                            <thead>
                                                <tr>
                                                    <th class="product-name">Product</th>
                                                    <th class="product-total">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    itmes.map((item, index)=>{
                                                        return(
                                                            <>
                                                             <tr key={index}>
                                                                <td>{item.name}</td>
                                                                <td>&#8377; {item.price}</td>
                                                            </tr>
                                                            </>
                                                        )
                                                    })
                                                }
                                               <tr>
                                                    <td>Subtotal</td>
                                                    <td>&#8377; {totalAmount}</td>
                                                </tr>
                                               <tr>
                                                    <td>Tax</td>
                                                    <td>18%</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Total</b></td>
                                                    <td><b>&#8377; {taxWithAmount.total}</b>  </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                            <button 
                                                className='btn btn-primary'
                                                onClick={onPlaceOrder}
                                                disabled ={orderLoader}
                                                >
                                                {
                                                    orderLoader  && <Spinner
                                                        size='sm'
                                                        color='white'
                                                    />
                                                }
                                                Place Order
                                            </button>
                                            </div>
                                        </div>
                                    
                                    </div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
