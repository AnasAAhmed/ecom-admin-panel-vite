import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "../../components/ui/separator";
import ProductSearch from "../../components/custom ui/ProductSearch";
import { ScalableDataTable } from "../../components/custom ui/ScalableDataTable";
import NotFound from "../../components/custom ui/NotFound";
import { columns } from "../../components/orders/OrderColumns";
import { fetchOrders } from "../../lib/api";

const Orders = () => {
    const [searchParams] = useSearchParams();
    const searchKey = searchParams.toString();
    const key = searchParams.get("key") || "";
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 0;
    const sort = searchParams.get("sort") || '';
    const field = searchParams.get("sortField") || '';

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["orders", searchKey],
        queryFn: () => fetchOrders(key, query, page, sort, field),
    });

    if (typeof data === 'string' || isError) return <NotFound errorMessage={JSON.stringify(data) + error?.message} />


    return (
        <div className="px-10">
            <h3 className="text-xl sm:text-3xl font-semibold">
                Orders ({data ? data.totalOrders : 0})
                {query &&
                    <>
                        <span>Results for &quot;{query}&quot;</span>
                        <span><Link to={'/orders'}>&times;</Link></span>
                    </>
                }
            </h3>


            <Separator className="bg-gray-900 my-4" />

            <ProductSearch item="orders" />

            <ScalableDataTable
                columns={columns}
                isLoading={isLoading}
                data={data?.data! || []}
                currentPage={page}
                totalPage={data?.totalPages!}
            />
        </div>
    );
};

export default Orders;
