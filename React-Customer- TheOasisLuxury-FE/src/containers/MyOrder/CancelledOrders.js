// CancelledOrders.js
import React from 'react';
import OrderCard from './OrderCard';

const CancelledOrders = ({ orders }) => {
    return (
        <div className="flex flex-wrap justify-center items-center w-2/3 mx-auto">
            {orders.map((order, index) => (
                <div className="w-1/2 p-2">
                    <OrderCard key={order._id} order={order} index={index} />
                </div>
            ))}
        </div>
    );
};

export default CancelledOrders;
