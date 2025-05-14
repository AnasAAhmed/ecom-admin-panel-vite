import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NotFound from "../components/custom ui/NotFound";
import { Separator } from "../components/ui/separator";
import ProductSearch from "../components/custom ui/ProductSearch";
import { ScalableDataTable } from "../components/custom ui/ScalableDataTable";
import { columns } from "../components/customers/CustomerColumns";
import { API_BASE } from "../App";
import { toast } from "sonner";



type CustomerResponse = {
  data: CustomerType[];
  totalPages: number;
  totalCustomers: number;
};

const fetchCustomers = async (key: string, query: string, page: number): Promise<CustomerResponse> => {
 

  const res = await fetch(`${API_BASE}/api/admin/customers?key=${key}&query=${query}&page=${page}`, {
    method: 'GET',
    credentials:'include'
  });
  if (!res.ok) {
    toast.error(await res.text())
    throw new Error(await res.text());
  }
  return res.json();
};

const Customers = () => {
  const [searchParams] = useSearchParams();
  const key = searchParams.get("key") || "";
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 0;

  const { data, isLoading, isError,error} = useQuery({
    queryKey: ["customers", key, query, page],
    queryFn: () => fetchCustomers(key, query, page),
  });

  if (typeof data ==='string' || isError) return <NotFound errorMessage={JSON.stringify(data) + error?.message} />

  return (
    <div className="px-10">
      <p className="text-xl sm:text-3xl font-semibold">
        Customers ({data ? data.totalCustomers : 0}){" "}
        {query && <span>Results for &quot;{query}&quot;</span>}
      </p>

      <Separator className="bg-gray-8-- my-4" />

      <ProductSearch item="customers" />

      <ScalableDataTable
        columns={columns}
        data={data?.data!||[]}
        isLoading={isLoading}
        currentPage={page}
        totalPage={data?.totalPages!}
      />
    </div>
  );
};

export default Customers;
