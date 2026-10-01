import React, { lazy, useEffect, useState } from 'react'
import {STATIC_IMAGE} from '../../utils/staticImage'
import { Link } from 'react-router-dom'
import { pagination } from '../../api/pagination';
import { service } from '../../api/service';
import Spinner from '../../components/Spinner';



export default function HomePageProductListing() {

    const [params, setParams] = useState(pagination.HOME_PAGE);
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(pagination.HOME_PAGE.page);
    const [loading, setLoading] = useState(false);
    const [loadMoreLoading, setLoadMoreLoading] = useState(false);

    const getShopProduct = async(page = 1, loadMore = false)=>{
        try {
            if(loadMore) {
                setLoadMoreLoading(true);
            } else {
                setLoading(true);
            }
            const requestParams  = {
                ...params,
                page : page
            }
           const response = await service.product.getAll(requestParams);
           const productData = response.data;
           const newProducts = productData?.data ?? [];
           // Set pagination information
           setTotal(productData.meta.total_records ? productData.meta.total_records : 0);
           setTotalPages(productData.meta.total_pages ? productData.meta.total_pages : 0);
           if(loadMore) {
                // Append new products
                setProducts(previousProduct=>[
                    ...previousProduct,
                    ...newProducts
                ]);
            } else {
                // First load / filter change
                setProducts(newProducts);
            }
            
        } catch (error) {
            if(error) {
                console.log(error);
            }
        } finally {
            setLoading(false);
            setLoadMoreLoading(false);
        }
       
    }

    useEffect(()=>{
        getShopProduct(pagination.HOME_PAGE.page, false);
        setCurrentPage(pagination.HOME_PAGE.page);
    }, [params]);

    const handleLoadMore = ()=>{
        if(loadMoreLoading) return;
        if(currentPage >= totalPages) return;
        const nextPage = currentPage+1;
        setCurrentPage(nextPage);
        getShopProduct(nextPage, true);
    }

    return (
        <>
            <section className="rs-listing-area">
                <div className="container">
                    <div className="row">
                        <div 
                            className="col-12"
                            style={{minHeight: "300px"}}
                            >
                            {
                                loading && <Spinner
                                    centered= {true}
                                    label="Loading products..." 
                                    color= "success"
                                />
                            }
                            <div 
                                className="rs-grid">
                                    {
                                        (Array.isArray(products) && products.length > 0) &&
                                        products.map((item, index)=>{
                                            return(
                                                <>
                                                
                                                <Link 
                                                    to="/product-details" 
                                                    className="rs-card"
                                                    style={{
                                                        opacity : loading ? "0.2": ""
                                                    }}
                                                    key={index}
                                                >
                                                <img src={item.image.src}
                                                        alt="Tribal Life" loading="lazy"/>
                                                    <figcaption>{item.name}</figcaption>
                                                </Link>
                                                
                                                </>
                                            )
                                        })
                                    }
                                    
                               </div>
                          
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}
