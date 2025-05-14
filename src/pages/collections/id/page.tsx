import { useParams } from 'react-router-dom';
import CollectionForm from '../../../components/collections/CollectionForm'
import { useQuery } from '@tanstack/react-query';
import { fetchSingleCollection } from '../../../lib/api';
import NotFound from '../../../components/custom ui/NotFound';
import Loader from '../../../components/custom ui/Loader';

const EditCollection = () => {
        const {id} = useParams();
    
     const { data, isLoading, isError ,error} = useQuery({
        queryKey: ["collection",id],
        queryFn: () => fetchSingleCollection(id),
    });
    if (isLoading) return <Loader/>;
  if (typeof data ==='string' || isError) return <NotFound errorMessage={JSON.stringify(data) + error?.message} />

    return (
        <CollectionForm initialData={data}/>
    )
}

export default EditCollection
