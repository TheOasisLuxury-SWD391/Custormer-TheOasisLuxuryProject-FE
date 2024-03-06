// ConfirmedOrders.js
import React from 'react';
import OrderCard from './OrderCard';

const ConfirmedOrders = ({ orders }) => {
    return (
        <div className=" justify-center items-center w-2/3 mx-auto">
            <h2 className="text-lg font-bold mb-4 text-cyan-700">Total Confirmed Orders: {orders.length}</h2>
            {orders.map((order, index) => (
                <div className=" p-2">
                    <OrderCard key={order._id} order={order} index={index} />
                </div>
            ))}
        </div>
    );
};

export default ConfirmedOrders;
