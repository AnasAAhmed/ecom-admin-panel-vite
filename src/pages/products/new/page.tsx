import ProductForm from '../../../components/products/ProductForm'
import { useQuery } from '@tanstack/react-query';
import { fetchCollections } from '../../../lib/api';

const NewProduct = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["collections"],
        queryFn: fetchCollections,
    });

    if (typeof data ==='string' || isError) return <p className="p-4 text-red-500">Error Collections {JSON.stringify(data)}</p>;

    return (
        <ProductForm collections={data} isLoading={isLoading} error={isError ? JSON.stringify(data) : ''} />
    )
}

export default NewProduct
