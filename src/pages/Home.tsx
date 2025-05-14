
import { useQuery } from "@tanstack/react-query";
import {
    CircleDollarSign,
    LucideEdit,
    ShoppingBag,
    UserCheck,
    UserRound,
} from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import SalesChart from "../components/custom ui/SalesChart";
import { fetchAdminData } from "../lib/api";
import NotFound from "../components/custom ui/NotFound";
import Loader from "../components/custom ui/Loader";


export default function Home() {
    const { data, isLoading, isError,error } = useQuery({
        queryKey: ["adminData"],
        queryFn: fetchAdminData,
    });

    if (isLoading) return <Loader />;
  if (typeof data ==='string' || isError) return <NotFound errorMessage={JSON.stringify(data)+' ' + error?.message} />

    const {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalUsers,
        // salesPerMonth,
    } = data.countMetrics;

    return (
        <div className="px-8 pb-10">
            <p className="text-xl sm:text-3xl font-semibold">Dashboard</p>
            <Separator className="bg-gray-800 my-5" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Total Revenue</CardTitle>
                        <CircleDollarSign className="max-sm:hidden" />
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                        <p title="Pakistani Rupees" className="text-lg cursor-pointer font-semibold">{totalRevenue*270} <small>Rs</small></p>
                        <p title="US Dollars" className="text-lg cursor-pointer font-semibold">${totalRevenue}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Total Products</CardTitle>
                        <ShoppingBag className="max-sm:hidden" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">{totalProducts}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Total Orders</CardTitle>
                        <LucideEdit className="max-sm:hidden" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">{totalOrders}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Users Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                            {/* Total Customers */}
                            <div title="Total Customers who placed atleast One Order" className="flex cursor-pointer items-center gap-2">
                                <UserCheck className="text-muted-foreground" />
                                <p className="text-lg font-semibold">{totalCustomers}</p>
                            </div>

                            {/* Total Users */}
                            <div title="Total Users who signed-up" className="flex cursor-pointer items-center gap-2">
                                <UserRound className="text-muted-foreground" />
                                <p className="text-lg font-semibold">{totalUsers}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            <Card className="mt-10 mx-0 px-0">
                <CardHeader>
                    <CardTitle>Sales Chart ($)</CardTitle>
                </CardHeader>
                <CardContent className="p-0 m-0">
                    <SalesChart data={data.graphData} />
                </CardContent>
            </Card>
        </div>
    );
}
