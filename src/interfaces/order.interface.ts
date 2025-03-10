// es el que va ser enviado a supabase por eso se le puso input
export interface OrderInput {

    // para guardar la direccion
	address: {
		addressLine1: string;
		addressLine2?: string;
		city: string;
		state: string;
		postalCode?: string;
		country: string;
	};

    // necesitamos formatear todo para poder crear la orden y añadirlo detalles de la orden 
	cartItems: {
		variantId: string;
		quantity: number;
		price: number;
	}[];
	totalAmount: number;
}