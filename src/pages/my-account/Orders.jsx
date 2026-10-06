import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { decryptData } from "../../utils/encryption";
import { service } from "../../api/service";
import { pagination } from "../../api/pagination";
import { formatDate } from "../../utils/formatDate";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";

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

    const onHandleOrderView = (id)=>{
        if(id) {
            navigate(`/my-account/orders/${id}`, {
                replace : true
            });
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
                                            onClick={() => {
                                                onHandleOrderView(item.id)
                                            }}
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
    );
}