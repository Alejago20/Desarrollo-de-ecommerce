import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createProduct } from '../../actions';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useCreatorProduct = () => {
  const queryClient = useQueryClient();
  const navigate=useNavigate();


  const { mutate, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
      navigate('/dashboard/productos');
    },
    onError:error=>{
       toast.error('Ocurrio un error al crear el producto') 
       console.log(error);
    }
  });

  return {
    mutate,
    isPending,
  };
};