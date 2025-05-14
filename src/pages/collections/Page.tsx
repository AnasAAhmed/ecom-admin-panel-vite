import { useQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "../../components/ui/separator";
import { DataTable } from "../../components/custom ui/DataTable";
import { columns } from "../../components/collections/CollectionColumns";
import { fetchCollections } from "../../lib/api";
import NotFound from "../../components/custom ui/NotFound";


const Collections = () => {
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['collections'],
        queryFn: fetchCollections,
    });
  if (typeof data ==='string' || isError) return <NotFound errorMessage={JSON.stringify(data) + error?.message} />

    return (
        <div className="px-10">
            <div className="flex flex-col sm:flex-row items-center justify-between">
                <h1 className="text-xl sm:text-3xl font-semibold">Collections</h1>
                <Link className="flex items-center" to={'/collections/new'}>
                    <Button variant={'default'} size={'sm'}>
                        Create Collection
                    </Button>
                </Link>
            </div>
            <Separator className="bg-gray-800 my-4" />
           <DataTable isLoading={isLoading} columns={columns} data={data||[]} searchKeys={["title",'_id']} />

        </div>
    );
};

export default Collections;
