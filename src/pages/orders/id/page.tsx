'use client'
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loader from "../../../components/custom ui/Loader";
import { Link, useParams } from "react-router-dom";
import OrderManagement from "../../../components/orders/OrderManagment";
import { DataTable } from "../../../components/custom ui/DataTable";
import { columns } from "../../../components/orderItems/OrderItemsColums";
import { API_BASE } from "../../../App";
import NotFound from "../../../components/custom ui/NotFound";
import { MoveLeftIcon } from "lucide-react";

type Lol = { street: string; city: string; state: string; postalCode: string; country: string; }
type Order = {
    _id: string
    customerEmail: String,
    products: [],
    shippingAddress: Lol,
    shippingRate: string,
    totalAmount: number,
    currency: string,
    status: string,
    exchangeRate: number,

}

const OrderDetails = () => {
    const params = useParams()
    const [orderDetails, setOrderDetails] = useState<Order>();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchOrderDetails = async () => {
      
            try {
               
                const order = await fetch(`${API_BASE}/api/admin/orders/${params.id}`, {
                    method: 'GET',
                   credentials:'include'
                });
                const data = await order.json();
                setOrderDetails(data);
            } catch (error) {
                console.error("Failed to fetch order details:", error);
                setError(JSON.stringify(error))
                toast.error("Failed to fetch order details:" + error)
            }
        };

        fetchOrderDetails();
    }, [params.orderId]);

    if (!orderDetails) {
        return <Loader />;
    }
    if (typeof orderDetails === 'string' || error) return <NotFound errorMessage={JSON.stringify(orderDetails) + error} />

    const shippingAddress = orderDetails.shippingAddress || {};
    const { street, city, state, postalCode, country } = shippingAddress;
    return (
        <div className="flex flex-col p-10 gap-3">
            <Link to={'/orders'} className="text-accent-foreground font-medium text-lg" title="Back"><MoveLeftIcon/></Link>
            <p className="text-accent-foreground font-medium text-lg">
                <strong>Order ID:</strong> {orderDetails._id}
            </p>
            <p className="text-accent-foreground font-medium text-lg">
                <strong>Currency:</strong> {orderDetails.currency}
            </p>
            <p className="text-accent-foreground font-medium text-lg">
                <strong>ExchangeRate:</strong> {orderDetails.exchangeRate}
            </p>
            <p className="text-accent-foreground font-medium text-lg">
                <strong>Customer Email:</strong> {orderDetails.customerEmail}
            </p>
            <p className="text-accent-foreground font-medium text-lg">
                <strong>Shipping address:</strong> {street}, {city}, {state}, {postalCode}, {country}
            </p>
            <p className="text-accent-foreground font-medium text-lg">
                <strong>Total Paid:</strong> ${orderDetails.totalAmount}
            </p>
            <p className="text-accent-foreground font-medium text-lg">
                <strong>Shipping rate ID:</strong> {orderDetails.shippingRate}
            </p>
            <p className="text-accent-foreground font-medium text-lg">
                <strong>Status:</strong> {orderDetails.status}
            </p>
            <OrderManagement orderId={orderDetails._id} currentStatus={orderDetails.status} />
            <DataTable isLoading={!orderDetails} columns={columns} data={orderDetails.products} searchKeys={["product", "color", "size", "quantity"]} />
        </div >
    );
};

export default OrderDetails;
