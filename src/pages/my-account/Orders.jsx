import React, { lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { decryptData } from "../../utils/encryption";
import { service } from "../../api/service";
import { pagination } from "../../api/pagination";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";


const Offcanvas = lazy( ()=>
    import('../../components/Offcanvas') 
);

const Spinner = lazy(()=>
    import('../../components/Spinner')
);


export default function Orders() {

    const { authToken } = useSelector((state) => state.user);

    const [userInfo, setUserInfo] = useState(null);
    const [orderList, setOrderList] = useState([]);

    const navigate = useNavigate();

    const [params, setParams] = useState({
        ...pagination.ORDER_BY_USER,
    });

    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(
        pagination.ORDER_BY_USER.page
    );

    const [loader, setLoader] = useState(false);
    const [error, setError] = useState("");
    const [orderDetailsLoader, setOrderDetailsLoader] = useState(false);
    const [orderDetails, setOrderDetails] = useState({});

    const [offcanvasId, setoffcanvasId] = useState('offcanvasRight');

    /**
     * Decrypt logged-in user
     */
    useEffect(() => {

        if (!authToken) {
            setUserInfo(null);
            return;
        }

        const loadUser = async () => {
            try {
                const response = await decryptData(authToken);

                setUserInfo(response?.data || null);

            } catch (error) {
                console.error("User decrypt error:", error);
                setUserInfo(null);
            }
        };

        loadUser();

    }, [authToken]);


    /**
     * Get orders by customer
     */
    useEffect(() => {

        const customerId = userInfo?.id;

        if (!customerId) {
            return;
        }

        const getOrders = async () => {

            try {

                setLoader(true);
                setError("");

                const payload = {
                    customer_id: customerId,
                    ...params,
                    page: currentPage,
                };

                const response = await service.order.byCustomer(payload);

                const orderResponse = response?.data;

                setOrderList(
                    Array.isArray(orderResponse?.data)
                        ? orderResponse.data
                        : []
                );

                // Update pagination information
                setTotal(orderResponse?.total || 0);
                setTotalPages(orderResponse?.pagination?.total_pages || 0);

            } catch (error) {

                console.error("Get orders error:", error);

                setOrderList([]);
                setError(
                    error?.message ||
                    "Unable to load orders. Please try again."
                );

            } finally {

                setLoader(false);

            }

        };

        getOrders();

    }, [userInfo?.id, params, currentPage]);


    /**
     * Handle page change
     */
    const handlePageChange = (page) => {

        if (
            page < 1 ||
            (totalPages > 0 && page > totalPages) ||
            page === currentPage
        ) {
            return;
        }

        setCurrentPage(page);

        setParams((prev) => ({
            ...prev,
            page,
        }));
    };

    const onHandleOrderView = async(id)=>{
        if (!id) {
            console.log("Order ID is missing");
            return;
        }
        
        try {
            setOrderDetailsLoader(true);
            const response = await service.order.single(id);
            const orderDetailsReponse = response.data;
            setOrderDetails( orderDetailsReponse || {} );
        } catch (error) {
            if(error) {
                console.log(error.message);
            }
        } finally {
            setOrderDetailsLoader(false);
        }
           
        
    }


    /**
     * Render order status badge
     */
    const renderStatus = (status) => {

        const statusClass = {
            pending: "bg-warning text-dark",
            processing: "bg-info text-dark",
            completed: "bg-success",
            cancelled: "bg-danger",
            refunded: "bg-secondary",
            failed: "bg-danger",
        };

        return (
            <span
                className={`badge ${
                    statusClass[status?.toLowerCase()] ||
                    "bg-secondary"
                }`}
            >
                {status || "Unknown"}
            </span>
        );
    };


    return (
        <>
            <div>

                {/* Orders Table */}
                <div className="table-responsive">

                    <table className="table table-hover align-middle mb-0">

                        <thead className="table-light">
                            <tr>
                                <th>Order Number</th>
                                <th>Status</th>
                                <th>Total</th>
                                <th>Payment Method</th>
                                <th>Created At</th>
                                <th className="text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {/* Loading */}
                            {loader && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-5"
                                    >
                                        <Spinner
                                            centered={true}
                                            color="primary"
                                            label="Loading orders..."
                                        />
                                    </td>
                                </tr>
                            )}


                            {/* Error */}
                            {!loader && error && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center text-danger py-4"
                                    >
                                        {error}
                                    </td>
                                </tr>
                            )}


                            {/* Empty */}
                            {!loader &&
                                !error &&
                                orderList.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center text-muted py-4"
                                        >
                                            No orders found.
                                        </td>
                                    </tr>
                                )}


                            {/* Orders */}
                            {!loader &&
                                !error &&
                                orderList.length > 0 &&
                                orderList.map((item) => (

                                    <tr key={item.id}>

                                        <td>
                                            <strong>
                                                #{item.order_number}
                                            </strong>
                                        </td>

                                        <td className="text-capitalize">
                                            {renderStatus(item.status)}
                                        </td>

                                        <td>
                                            <strong>
                                                ₹{item.total}
                                            </strong>
                                        </td>

                                        <td className="text-uppercase">
                                            {item.payment_method || "-"}
                                        </td>

                                        <td>
                                            {item.created_at
                                                ? formatDate(item.created_at)
                                                : "-"}
                                        </td>

                                        <td className="text-center">

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target={`#${offcanvasId}`}
                                                aria-controls={offcanvasId}
                                                onClick={()=>onHandleOrderView(item.id)}
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                        </tbody>

                    </table>

                </div>

                {/* Pagination */}
                {!loader &&
                    !error &&
                    totalPages > 1 && (

                        <div className="d-flex justify-content-between align-items-center mt-4">

                            <div className="text-muted">
                                Total Orders: <strong>{totalPages}</strong>
                            </div>

                            <nav>
                                <ul className="pagination mb-0">

                                    {/* Previous */}
                                    <li
                                        className={`page-item ${
                                            currentPage === 1
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                        >
                                            Previous
                                        </button>
                                    </li>


                                    {/* Pages */}
                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) => index + 1
                                    ).map((page) => (

                                        <li
                                            key={page}
                                            className={`page-item ${
                                                currentPage === page
                                                    ? "active"
                                                    : ""
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                className="page-link"
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                            >
                                                {page}
                                            </button>
                                        </li>

                                    ))}


                                    {/* Next */}
                                    <li
                                        className={`page-item ${
                                            currentPage === totalPages
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                        >
                                            Next
                                        </button>
                                    </li>

                                </ul>
                            </nav>

                        </div>

                    )}

            </div>

            <Offcanvas
                id={offcanvasId}
                title={`Order Details #${orderDetails?.order_number || ""}`}
                placement="end"
                width="1000px"
            >
                {orderDetailsLoader ? (
                    <Spinner 
                        centered={true}
                        color="success"
                        label="Loading order details..."   
                    />
                ) : orderDetails ? (
                    <div className="container-fluid">

                        {/* Order Header */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                                    <div>
                                        <h5 className="mb-1">
                                            Order #{orderDetails.order_number}
                                        </h5>

                                        <small className="text-muted">
                                            {formatDate(orderDetails.created_at)}
                                        </small>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-warning text-dark text-capitalize">
                                            {orderDetails.status}
                                        </span>

                                        <span className="badge bg-light text-dark">
                                            {orderDetails.payment_method_title}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white">
                                <h6 className="mb-0">
                                    Customer Information
                                </h6>
                            </div>

                            <div className="card-body">
                                <div className="row g-3">

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">
                                            Customer Name
                                        </small>

                                        <strong>
                                            {orderDetails.customer?.first_name}{" "}
                                            {orderDetails.customer?.last_name}
                                        </strong>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">
                                            Email
                                        </small>

                                        <span>
                                            {orderDetails.customer?.email || "-"}
                                        </span>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">
                                            Phone
                                        </small>

                                        <span>
                                            {orderDetails.customer?.phone || "-"}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Billing & Shipping */}
                        <div className="row g-4 mb-4">

                            {/* Billing */}
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-header bg-white">
                                        <h6 className="mb-0">
                                            Billing Address
                                        </h6>
                                    </div>

                                    <div className="card-body">

                                        <h6 className="mb-2">
                                            {orderDetails.billing?.first_name}{" "}
                                            {orderDetails.billing?.last_name}
                                        </h6>

                                        {orderDetails.billing?.company && (
                                            <p className="mb-1">
                                                {orderDetails.billing.company}
                                            </p>
                                        )}

                                        <p className="mb-1">
                                            {orderDetails.billing?.address_1}
                                        </p>

                                        {orderDetails.billing?.address_2 && (
                                            <p className="mb-1">
                                                {orderDetails.billing.address_2}
                                            </p>
                                        )}

                                        <p className="mb-1">
                                            {orderDetails.billing?.city},{" "}
                                            {orderDetails.billing?.state} -{" "}
                                            {orderDetails.billing?.postcode}
                                        </p>

                                        <p className="mb-1">
                                            {orderDetails.billing?.country}
                                        </p>

                                        <hr />

                                        <p className="mb-1">
                                            <strong>Email:</strong>{" "}
                                            {orderDetails.billing?.email}
                                        </p>

                                        <p className="mb-0">
                                            <strong>Phone:</strong>{" "}
                                            {orderDetails.billing?.phone}
                                        </p>

                                    </div>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="col-md-6">
                                <div className="card border-0 shadow-sm h-100">

                                    <div className="card-header bg-white">
                                        <h6 className="mb-0">
                                            Shipping Address
                                        </h6>
                                    </div>

                                    <div className="card-body">

                                        <h6 className="mb-2">
                                            {orderDetails.shipping?.first_name}{" "}
                                            {orderDetails.shipping?.last_name}
                                        </h6>

                                        {orderDetails.shipping?.company && (
                                            <p className="mb-1">
                                                {orderDetails.shipping.company}
                                            </p>
                                        )}

                                        <p className="mb-1">
                                            {orderDetails.shipping?.address_1}
                                        </p>

                                        {orderDetails.shipping?.address_2 && (
                                            <p className="mb-1">
                                                {orderDetails.shipping.address_2}
                                            </p>
                                        )}

                                        <p className="mb-1">
                                            {orderDetails.shipping?.city},{" "}
                                            {orderDetails.shipping?.state} -{" "}
                                            {orderDetails.shipping?.postcode}
                                        </p>

                                        <p className="mb-0">
                                            {orderDetails.shipping?.country}
                                        </p>

                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Order Items */}
                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white">
                                <h6 className="mb-0">
                                    Order Items
                                </h6>
                            </div>

                            <div className="card-body p-0">

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-light">
                                            <tr>
                                                <th className="ps-3">
                                                    Product
                                                </th>

                                                <th>
                                                    Price
                                                </th>

                                                <th>
                                                    Quantity
                                                </th>

                                                <th>
                                                    Subtotal
                                                </th>

                                                <th className="text-end pe-3">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {orderDetails.items?.map((item) => (
                                                <tr key={item.item_id}>

                                                    <td className="ps-3">
                                                        <div className="d-flex align-items-center gap-3">

                                                            {item.product?.image && (
                                                                <img
                                                                    src={item.product.image}
                                                                    alt={item.name}
                                                                    width="60"
                                                                    height="60"
                                                                    className="rounded border object-fit-cover"
                                                                />
                                                            )}

                                                            <div>
                                                                <h6 className="mb-1">
                                                                    {item.name}
                                                                </h6>

                                                                {item.product?.sku && (
                                                                    <small className="text-muted">
                                                                        SKU: {item.product.sku}
                                                                    </small>
                                                                )}
                                                            </div>

                                                        </div>
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            item.product?.price || 0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td>
                                                        {item.quantity}
                                                    </td>

                                                    <td>
                                                        ₹
                                                        {Number(
                                                            item.subtotal || 0
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td className="text-end pe-3 fw-semibold">
                                                        ₹
                                                        {Number(
                                                            item.total || 0
                                                        ).toFixed(2)}
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>

                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="row justify-content-end mb-4">

                            <div className="col-md-5">

                                <div className="card border-0 shadow-sm">

                                    <div className="card-header bg-white">
                                        <h6 className="mb-0">
                                            Order Summary
                                        </h6>
                                    </div>

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between mb-2">
                                            <span>
                                                Subtotal
                                            </span>

                                            <span>
                                                ₹
                                                {Number(
                                                    orderDetails.subtotal || 0
                                                ).toFixed(2)}
                                            </span>
                                        </div>

                                        

                                        

                                        <div className="d-flex justify-content-between mb-2">
                                            <span>
                                                Tax
                                            </span>

                                            <span>
                                                ₹
                                                {Number(
                                                    orderDetails.tax_total || 0
                                                ).toFixed(2)}
                                            </span>
                                        </div>

                                        <hr />

                                        <div className="d-flex justify-content-between">
                                            <strong>
                                                Total
                                            </strong>

                                            <strong className="text-primary fs-5">
                                                ₹
                                                {Number(
                                                    orderDetails.total || 0
                                                ).toFixed(2)}
                                            </strong>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Payment Information */}
                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-header bg-white">
                                <h6 className="mb-0">
                                    Payment Information
                                </h6>
                            </div>

                            <div className="card-body">

                                <div className="row">

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">
                                            Payment Method
                                        </small>

                                        <strong>
                                            {orderDetails.payment_method_title}
                                        </strong>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">
                                            Currency
                                        </small>

                                        <strong>
                                            {orderDetails.currency}
                                        </strong>
                                    </div>

                                    <div className="col-md-4">
                                        <small className="text-muted d-block">
                                            Payment Status
                                        </small>

                                        <span className="badge bg-warning text-dark text-capitalize">
                                            {orderDetails.status}
                                        </span>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center text-muted py-5">
                        <i className="bi bi-receipt fs-1 d-block mb-3"></i>

                        <p className="mb-0">
                            No order details found.
                        </p>
                    </div>
                )}
            </Offcanvas>
        </>
        
    );
}