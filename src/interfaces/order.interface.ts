import { useCustomer } from '../hooks/auth/useCustomer';
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
export interface OrderItemSingle {
	//Ítem de Orden Única
	created_at: string;
	id: number;
	status: string;
	total_amount: number;
}
export interface OrderWithCustomer{
	id:number;
	status:string;
	total_amount:number;
	created_at:string;
	customers:{
		full_name:string;
		email:string;
	} | null;
}