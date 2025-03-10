import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '../../actions';

export const useOrder= (orderId:number) => {
  const {
    data,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['order',orderId],
    queryFn: () => getOrderById(orderId),
    //llega un punto que el id puede ser nuloo o puede ser undefined
    // asi para evitar ese error podemos usar 
    enabled: !!orderId,
    retry:false
  });

  return {
    data,
    isError,
    isLoading,
  };
};