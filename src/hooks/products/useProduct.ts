import { useQuery } from '@tanstack/react-query';
import { getProductBySlug } from '../../actions';

 export const useProduct = (slug: string) => {
	const {
		data: product,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ['product', slug],
		queryFn: () => getProductBySlug(slug),
		retry: false,
	});

	return {
		product,
		isError,
		isLoading,
	};
}; 

/* export const useProduct = (slug: string) => {
	const {
	  data: products = [], // ✅ Siempre un array
	  isLoading,
	  isError,
	} = useQuery({
	  queryKey: ["product", slug],
	  queryFn: () => getProductBySlug(slug),
	  retry: false,
	});
  
	console.log("🛍️ Productos obtenidos:", products); // ✅ Ver si recibe un array
  
	return {
	  products, // ✅ Debe ser un array
	  isError,
	  isLoading,
	};
  }; */
  


