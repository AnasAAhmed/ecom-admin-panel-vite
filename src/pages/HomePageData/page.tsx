import { useQuery } from "@tanstack/react-query";
import HomePageDataForm from "../../components/homePageData/HomePageDataForm"
import NotFound from "../../components/custom ui/NotFound";
import Loader from "../../components/custom ui/Loader";
import { fetchHomePageData } from "../../lib/api";

const HomePageData = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["home-page"],
        queryFn: () => fetchHomePageData(),
    });
    
    if (isLoading) return <Loader />;
    if (typeof data === 'string' || isError) return <NotFound statusCode={error?.stack +error?.message!} errorMessage={JSON.stringify(data) + ' ' + error?.message} />
    
    return (
        <HomePageDataForm initialData={data} />
    )
}

export default HomePageData
