import ProductForm from '../../../components/products/ProductForm'
import { useQuery } from '@tanstack/react-query';
import { fetchSingleProduct } from '../../../lib/api';
import { useSearchParams } from 'react-router-dom';
import NotFound from '../../../components/custom ui/NotFound';
import Loader from '../../../components/custom ui/Loader';

const EditProduct = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id")

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchSingleProduct(id!),
    });

    if (isLoading) return <Loader />;
    if (typeof data === 'string' || isError) return <NotFound errorMessage={JSON.stringify(data) + error?.message} />

    return (
        <ProductForm initialData={data} />
    )
}

export default EditProduct
