import { useQuery } from "@tanstack/react-query"
import { getProducts } from "../../actions"


export const useProducts=()=>{


//para manejar toda la lógica de la consulta de productos de manera centralizada y reutilizable.
const {data, isLoading}=useQuery({
    
    //ponemos el identificador de la peticion
    queryKey:['products'],
    //funcion que quiero que ejecute
    queryFn: ()=> getProducts(),

    //los datos seránobsoletos (rancio)después de eso
    staleTime:1000*60*5, //1 hora

});

return{ products:data, isLoading};

}

