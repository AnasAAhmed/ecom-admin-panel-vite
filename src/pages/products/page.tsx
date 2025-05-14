import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import ProductSearch from "../../components/custom ui/ProductSearch";
import { ScalableDataTable } from "../../components/custom ui/ScalableDataTable";
import { columns } from "../../components/products/ProductColumns";
import NotFound from "../../components/custom ui/NotFound";
import { API_BASE } from "../../App";


type ProductResponse = {
  data: ProductType[];
  totalPages: number;
  totalProducts: number;
};

const fetchProducts = async (key: string, query: string, page: number, sort: string, sortField: string) => {

  const res = await fetch(`${API_BASE}/api/admin/products?key=${key}&query=${query}&page=${page}&sort=${sort}&sortField=${sortField}`, {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json() as Promise<ProductResponse>;
};

const Products = () => {
  const [searchParams] = useSearchParams();

  const key = searchParams.get("key") || "";
  const query = searchParams.get("query") || "";
  const sortField = searchParams.get("sortField") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 0;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", key, query, page, sort, sortField],
    queryFn: () => fetchProducts(key, query, page, sort, sortField),
  });

  if (typeof data === 'string' || isError) return <NotFound errorMessage={JSON.stringify(data) + ' ' + error?.message} />



  return (
    <div className="px-2 md:px-10 ">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h1 className="text-xl sm:text-3xl font-semibold">
          Products ({data ? data.totalProducts : 0}) {query && <span>Results for &quot;{query}&quot;</span>}
        </h1>
        <Link className="flex items-center" to={'/products/new'}>
          <Button variant={'default'} size={'sm'}>
            Create Prodcut
          </Button>
        </Link>
      </div>

      <Separator className="bg-gray-800 my-4" />

      <ProductSearch item="products" />

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

export default Products;
