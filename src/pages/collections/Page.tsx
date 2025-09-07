import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { columns } from "../../components/collections/CollectionColumns";
import { fetchCollections } from "../../lib/api";
import NotFound from "../../components/custom ui/NotFound";
import { ScalableDataTable } from "../../components/custom ui/ScalableDataTable";
import ProductSearch from "../../components/custom ui/ProductSearch";


const Collections = () => {
    const [searchParams] = useSearchParams();
    const searchKey = searchParams.toString()|| "";
    const key = searchParams.get("key") || "";
    const query = searchParams.get("query") || "";
    const page = Number(searchParams.get("page")) || 0;
    const sort = searchParams.get("sort") || '';
    const field = searchParams.get("sortField") || '';
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['collections', searchKey],
        queryFn: () => fetchCollections(key, query, page, sort, field),
    });
    if (typeof data === 'string' || isError) return <NotFound errorMessage={JSON.stringify(data) + error?.message} />

    return (
        <div className="px-10">
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <h1 className="text-xl sm:text-3xl font-semibold">
                    Collections ({data ? data.totalCollections : 0})
                    {query &&
                        <>
                            <span>Results for &quot;{query}&quot;</span>
                            <span><Link to={'/collections'}>&times;</Link></span>
                        </>
                    }
                </h1>
                <Link className="flex items-center" to={'/collections/new'}>
                    <Button variant={'default'} size={'sm'}>
                        Create Collection
                    </Button>
                </Link>
            </div>
            <Separator className="bg-gray-800 my-4" />
            <ProductSearch item="collections" />
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

export default Collections;
