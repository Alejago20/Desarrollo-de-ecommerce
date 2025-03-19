import { useQuery } from "@tanstack/react-query"
import { getProducts } from "../../actions"


export const useProducts=({ page = 1 }: { page?: number })=>{


//para manejar toda la lógica de la consulta de productos de manera centralizada y reutilizable.
const {data, isLoading}=useQuery({
    
    //ponemos el identificador de la peticion
    //al agregarle page va a actualizar los datos al intentar hacer la paginacion 
    queryKey:['products',page],
    //funcion que quiero que ejecute
    queryFn: ()=> getProducts(page),

    //los datos seránobsoletos (rancio)después de eso
    staleTime:1000*60*5, //1 hora

});

return {
    products: data?.products,
    isLoading,
    totalProducts: data?.count ?? 0,
};

}

