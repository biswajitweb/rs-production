import React from 'react'
import { useParams } from 'react-router-dom'

export default function OrdersDetails() {
    const {orderId } = useParams();
    return (
        <>
            Order Details: {orderId}
        </>
    )
}
