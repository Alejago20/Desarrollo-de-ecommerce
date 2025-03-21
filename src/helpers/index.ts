import { VariantProduct,Color, Product } from "../interfaces";

export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
};



// Función para preparar los productos - (CELULARES)
export const prepareProducts = (products: Product[]) => {
	return products.map(product => {
		// Agrupar las variantes por color
		const colors = product.variants.reduce(
			(acc: Color[], variant: VariantProduct) => {
				const existingColor = acc.find(
					item => item.color === variant.color
				);

				if (existingColor) {
					// Si ya existe el color, comparamos los precios
					existingColor.price = Math.min(
						existingColor.price,
						variant.price
					);
				} // Mantenemos el precio mínimo
				else {
					acc.push({
						color: variant.color,
						price: variant.price,
						name: variant.color_name,
					});
				}

				return acc;
			},
			[]
		);

		// Obtener el precio más bajo de las variantes agrupadas
		const price = Math.min(...colors.map(item => item.price));

		// Devolver el producto formateado
		return {
			...product,
			price,
			colors: colors.map(({ name, color }) => ({ name, color })),
			variants: product.variants,
		};
	});
};

// Función para formatear la fecha a formato 3 de enero de 2022
export const formatDateLong = (date: string): string => {
	const dateObject = new Date(date);

	return dateObject.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

// Función para formatear la fecha a formato dd/mm/yyyy
export const formatDate = (date: string): string => {
	const dateObject = new Date(date);
	return dateObject.toLocaleDateString('es-ES', {
		year: 'numeric',
		month: '2-digit',
		day: 'numeric',
	});
};


// Función para obtener el estado del pedido en español
export const getStatus = (status: string): string => {
	switch (status) {
		case 'Pending':
			return 'Pendiente';
		case 'Paid':
			return 'Pagado';
		case 'Shipped':
			return 'Enviado';
		case 'Delivered':
			return 'Entregado';
		default:
			return status;
	}
};
