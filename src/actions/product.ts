//TODAS LAS FUNCIONES QUE INTERACTUA CON SUPABASE

import { supabase } from "../supabase/client"



//nota la funcion no esta siendo llamada cuando tenemos que hacer todo
//lo del estado asincrono, llamar a peticion y luego ponerle un estado en react
//luego por ejemplo renderizar un estado de carga o llamar un error si hay

//---Todo eso lo hace React query 

//traer los productos y va ordenarlo por fecha de creacion
//acceder productos de la base de datos
export const getProducts =async () => {
    const{data: products,error }=await supabase
    .from('products')
    .select('*, variants(*)')
    .order('created_at', {ascending: false});

    if (error) {
        console.log(error.message);
        throw new Error(error.message);
    }

    return products;
}

// FILTRADO DE PRODUCTO POR PAGINACION
export const getFilteredProducts = async ({
	page = 1,
	brands = [],
}: {
	page: number;
	brands: string[];
}) => {
	const itemsPerPage = 10;
	const from = (page - 1) * itemsPerPage;
	const to = from + itemsPerPage - 1;

	let query = supabase
		.from('products')
		.select('*, variants(*)', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(from, to);

	if (brands.length > 0) {
		query = query.in('brand', brands);
	}

	const { data, error, count } = await query;

	if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}

	return { data, count };
};


export const getRecentProducts=async () => {
	const {data:products,error}=await supabase
	.from('products')
	.select('*, variants(*)')
	.order('created_at',{ascending:false})
	.limit(4);

if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}
	return products;
}

export const getRandomProducts=async () => {
	const {data:products,error}=await supabase
	.from('products')
	.select('*, variants(*)')
	.order('created_at',{ascending:false})
	.limit(20);

if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}

	//seleccionar 4 productos al azar
	const randomProducts=products
	.sort(()=>0.5-Math.random())
	.slice(0,4)
	return randomProducts;
}

//traer productos por el slu
export const getProductBySlug=async (slug:string) => {
	const {data,error}=await supabase
	.from('products')
	.select('*, variants(*)')
	.eq('slug',slug)
	.single();

	if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}
	return data;
}

// busca los productos por el nombre

export const searchProducts=async (searchTerm:string) => {
	const {data, error}= await supabase
	.from('products')
	.select('*, variants(*)')
	.ilike('name', `%${searchTerm}%`); //Buscar productos cuyo nombre contenga el termino de busqueda

	if (error) {
		console.log(error.message);
		throw new Error(error.message);
	}
	return data;
	};