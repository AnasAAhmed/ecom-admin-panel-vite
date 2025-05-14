import ProductForm from '../../../components/products/ProductForm'
import { useQuery } from '@tanstack/react-query';
import { fetchCollections, fetchSingleProduct } from '../../../lib/api';
import { useParams } from 'react-router-dom';
import NotFound from '../../../components/custom ui/NotFound';
import Loader from '../../../components/custom ui/Loader';

const EditProduct = () => {
    const {id} = useParams();

    const { data:collections, isLoading:collectionLoading, isError:collectionIsError } = useQuery({
        queryKey: ["collections"],
        queryFn: fetchCollections,
    });
    const { data, isLoading, isError ,error} = useQuery({
        queryKey: ["product",id],
        queryFn: () => fetchSingleProduct(id),
    });
    if (isLoading) return <Loader/>;
  if (typeof data ==='string' || isError) return <NotFound errorMessage={JSON.stringify(data) + error?.message} />

    return (
        <ProductForm initialData={data} collections={collections} isLoading={collectionLoading} error={collectionIsError ? JSON.stringify(collections) : ''} />
    )
}

export default EditProduct
