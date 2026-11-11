import { useQuery } from "@tanstack/react-query"
import { service } from "../api/service"

export const useSliders = ()=>{

    return useQuery({
        queryKey : ['sliders'],
        queryFn : async()=>{
            const response = await service.other.getSlider();
            const sliderResponse = response.data;
            return sliderResponse?.data;
        },
        staleTime : 5 * 60 * 1000
    })

}