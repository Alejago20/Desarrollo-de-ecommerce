import { useQuery } from '@tanstack/react-query';
import { getSession } from '../../actions';

export const useUser = () => {
    const {data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => getSession(),
    //  controla cuántas veces se reintentará una consulta si falla.
    retry: false,
    //controla si la consulta se vuelve a ejecutar automáticamente cuando el usuario cambia de ventana (por ejemplo, minimiza y luego vuelve a la pestaña).
    refetchOnWindowFocus:true,
  });

  return {
    session: data?.session,
    isLoading,
  };
};