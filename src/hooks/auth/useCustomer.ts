import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../../actions';

export const useCustomer = (userId: string) => {
	const { data, isLoading } = useQuery({
		queryKey: ['customer', userId],
		queryFn: () => getUserData(userId),
		enabled: !!userId,
		retry: false,
        //actualiza los datos automáticamente cuando el usuario vuelve a la pestaña.
		refetchOnWindowFocus: true,
	});

	return {
		data,
		isLoading,
	};
};