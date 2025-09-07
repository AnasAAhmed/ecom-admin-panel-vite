import Loader from "../../../components/custom ui/Loader";
import { Link, useParams } from "react-router-dom";
import OrderManagement from "../../../components/orders/OrderManagment";
import NotFound from "../../../components/custom ui/NotFound";
import { MoveLeftIcon } from "lucide-react";
import { fetchSingleOrder } from "../../../lib/api";
import { useQuery } from "@tanstack/react-query";

const OrderDetails = () => {
    const params = useParams();
    function getStatusColor(status: string): string {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes("pending")) return "#d97706";
        if (lowerStatus.includes("shipped") || lowerStatus.includes("processing")) return "#2563eb";
        if (lowerStatus.includes("delivered")) return "#16a34a";
        if (lowerStatus.includes("canceled") || lowerStatus.includes("cancelled")) return "#dc2626";
        if (lowerStatus.includes("refunded")) return "#7c3aed";

        return "#374151";
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["single-order", params.id!],
        queryFn: () => fetchSingleOrder(params.id!),
    });

    if (typeof data === 'string' || isError) return <NotFound errorMessage={JSON.stringify(data) + error?.message} />

    if (isLoading) {
        return <Loader />;
    }
    if (!data) {
        return null;
    }
    return (
        <div className="flex flex-col p-10 gap-3">
            <Link to={'/orders'} className="text-accent-foreground font-medium text-lg" title="Back"><MoveLeftIcon /></Link>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <p>
                        <span className="font-medium text-gray-600">Order ID:</span>{' '}
                        <span className="text-gray-900">{data?._id}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Placed on:</span>{' '}
                        <span className="text-gray-900">{new Date(data?.createdAt).toLocaleDateString()}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Customer Email:</span>{' '}
                        <span className="text-gray-900">{data?.customerEmail}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Phone:</span>{' '}
                        <span className="text-gray-900">{data?.customerPhone}</span>
                    </p>
                    <p className="sm:col-span-2">
                        <span className="font-medium text-gray-600">Shipping Address:</span>{' '}
                        <span className="text-gray-900 block">
                            {data?.shippingAddress.street}, {data?.shippingAddress.city}, {data?.shippingAddress.state},{' '}
                            {data?.shippingAddress.postalCode}, {data?.shippingAddress.country}
                            <br />
                            Phone: {data?.shippingAddress.phone || 'N/A'}
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Exchange Rate:</span>{' '}
                        <span className="text-gray-900">{data?.exchangeRate}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Payment Method:</span>{' '}
                        <span className="text-gray-900">{data?.method.toUpperCase()}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Currency:</span>{' '}
                        <span className="text-gray-900">{data?.currency}</span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Total {!data?.status.startsWith('COD') && 'Paid'}:</span>{' '}
                        <span className="text-gray-900">
                            ${data?.totalAmount} ({data?.exchangeRate} x {data?.totalAmount} ={' '}
                            {(data?.totalAmount * data?.exchangeRate).toFixed(2)} {data?.currency})
                        </span>
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Shipping Rate:</span>{' '}
                        <span className="text-gray-900">
                            ({data?.currency}) {data?.shippingRate}
                        </span>
                    </p>
                    <p
                        className='font-semibold'
                        style={{ color: getStatusColor(data?.status) }}
                    >
                        <span className="font-medium text-gray-600">Status:</span> {data?.status}
                    </p>
                    <p>
                        <span className="font-medium text-gray-600">Products:</span>{' '}
                        <span className="text-gray-900">{data?.products.length}</span>
                    </p>
                    <div className="bg-white sm:col-span-2 print:hidden p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status History</h2>
                        <div className="relative pl-6">
                            <div className="absolute top-0 left-2 w-0.5 h-full bg-gray-200"></div>
                            {data?.statusHistory.map((statusItem) => (
                                <div key={statusItem._id} className="relative flex items-start gap-4 mb-6 last:mb-0">

                                    <div style={{ backgroundColor: getStatusColor(statusItem.status) }} className="absolute left-0 w-4 h-4 rounded-full border-2 "></div>
                                    <div className="pl-6">
                                        <p className={`text-sm font-medium ${statusItem.status.includes('Canceled') ? 'text-red-600' : 'text-gray-900'}`}>
                                            {statusItem.status}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(statusItem.changedAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <OrderManagement orderId={data?._id} currentStatus={data?.status} />
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-gray-900">
                    <thead className="bg-gray-50 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b">Image</th>
                            <th className="p-4 border-b">Product</th>
                            <th className="p-4 border-b">Size</th>
                            <th className="p-4 border-b">Color</th>
                            <th className="p-4 border-b">Quantity</th>
                            <th className="p-4 border-b">Price (USD)</th>
                            <th className="p-4 border-b">Exchange Rate</th>
                            <th className="p-4 border-b">Price ({data?.currency})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.products.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors border-b last:border-b-0">
                                <td className="p-4 w-24">
                                    {item.product?.media?.[0] ? (
                                        <img
                                            src={item.product.media[0]}
                                            alt={item.product.title}
                                            className="w-16 h-16 object-cover rounded-md border border-gray-100"
                                        />
                                    ) : (
                                        <div className="text-xs text-red-500">Image not available</div>
                                    )}
                                </td>
                                <td className="p-4 font-medium">
                                    <Link to={'/products/edit/' + item.product?.title + '?id=' + item.product._id}>
                                        {item.product?.title || <span className="text-red-500">Product deleted</span>}
                                    </Link>
                                </td>
                                <td className="p-4">{item.size || 'N/A'}</td>
                                <td className="p-4">{item.color || 'N/A'}</td>
                                <td className="p-4">{item.quantity}</td>
                                <td className="p-4">{item.product ? `$${item.product.price}` : '-'}</td>
                                <td className="p-4">{data?.exchangeRate}</td>
                                <td className="p-4">
                                    {item.product ? `${(item.product.price * data?.exchangeRate).toFixed(2)}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default OrderDetails;
