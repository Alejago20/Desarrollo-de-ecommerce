//TODAS LAS FUNCIONES QUE INTERACTUA CON SUPABASE

import { extractFilePath } from "../helpers";
import { ProductInput } from "../interfaces";
import { supabase } from "../supabase/client";

//nota la funcion no esta siendo llamada cuando tenemos que hacer todo
//lo del estado asincrono, llamar a peticion y luego ponerle un estado en react
//luego por ejemplo renderizar un estado de carga o llamar un error si hay

//---Todo eso lo hace React query

//traer los productos y va ordenarlo por fecha de creacion
//acceder productos de la base de datos

// vamos a traerlo los productos y traerlo por paginacion
export const getProducts = async (page: number) => {
  const itemsPerPage = 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const {
    data: products,
    error,
    count,
  } = await supabase
    .from("products")
    .select("*, variants(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { products, count };
};

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
    .from("products")
    .select("*, variants(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (brands.length > 0) {
    query = query.in("brand", brands);
  }

  const { data, error, count } = await query;

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  return { data, count };
};

export const getRecentProducts = async () => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, variants(*)")
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return products;
};

export const getRandomProducts = async () => {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, variants(*)")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }

  //seleccionar 4 productos al azar
  const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 4);
  return randomProducts;
};

//traer productos por el slu
export const getProductBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*, variants(*)")
    .eq("slug", slug)
    .single();

  console.log("HOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  console.log(slug);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return data;
};

// busca los productos por el nombre

export const searchProducts = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*, variants(*)")
    .ilike("name", `%${searchTerm}%`); //Buscar productos cuyo nombre contenga el termino de busqueda

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return data;
};

/*
 ********** ADMINISTRADOR************
 ************************************ */
export const createProduct = async (productInput: ProductInput) => {
  try {
    // 1.Crear el producto para obtenert el ID
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: productInput.name,
        brand: productInput.brand,
        slug: productInput.slug,
        features: productInput.features,
        description: productInput.description,
        images: [],
      })
      .select()
      .single();
    if (productError) throw new Error(productError.message);

    //2. Subir las imagenes al bucket dentro una carpeta que se creará a partir del producto ID
    //Necesitamos nombrar la carpeta donde se va guardar las imagenes de cada producto
    const folderName = product.id;
    const uploadedImages = await Promise.all(
      //significa vamos a resolver un arreglo de promesasentonces necesitamos
      //agrupar todas las promesas y ponerlo dentro del parentisis

      productInput.images.map(async (image) => {
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(`${folderName}/${product.id}-${image.name}`, image);

        if (error) throw new Error(error.message);

        //obtener la url de imagen subida para que luego sea devuelta en una arreglo de string
        const imageUrl = `${
          supabase.storage.from("product-images").getPublicUrl(data.path).data
            .publicUrl
        }`;

        return imageUrl;
      })
    );
    // Actualizar el producto con las imagenes subidas
    const { error: updatedError } = await supabase
      .from("products")
      .update({
        images: uploadedImages,
      })
      .eq("id", product.id);

    if (updatedError) throw new Error(updatedError.message);

    //Crear las variantes del productos
    const variants = productInput.variants.map((variant) => ({
      product_id: product.id, // Se asigna el ID del producto a cada variante
      stock: variant.stock, // Se asigna la cantidad en stock de la variante
      price: variant.price, // Se asigna el precio de la variante
      storage: variant.storage, // Se asigna la capacidad de almacenamiento
      color: variant.color, // Se asigna el color
      color_name: variant.colorName, // Se asigna el nombre del color
    }));
    const { error: variantsError } = await supabase
      .from("variants")
      .insert(variants);

    if (variantsError) throw new Error(variantsError.message);

    return product;
  } catch (error) {
    console.log(error);
    throw new Error("Error inesperado,vuelve a intentarlo");
  }
};

//ELIMINAR UN PRODUCTO
export const deleteProduct = async (productId: string) => {
  //1. Eliminar las variantes del producto
  const { error: variantsError } = await supabase
    .from("variants")
    .delete()
    .eq("product_id", productId);

  if (variantsError) throw new Error(variantsError.message);

  // 2. Obtener las imagenes del producto(en el bucket) antes de eliminarlo
  // Se debe hacer este paso porque para no dejar nada de basura en nuestro almacenamiento
  // de prodcutos que se han borrado,
  const { data: productImages, error: productImagesError } = await supabase
    .from("products")
    .select("images")
    .eq("id", productId)
    .single();

  if (productImagesError) throw new Error(productImagesError.message);

  // 3. Eliminar el producto+
  const { error: productDeleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (productDeleteError) throw new Error(productDeleteError.message);

  // 4.Eliminar las imagenes del bucket
  if (productImages.images.length > 0) {
    const folderName = productId;

    const paths = productImages.images.map((image) => {
      const fileName = image.split("/").pop();

      return `${folderName}/${fileName}`;
    });

    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove(paths);

    if (storageError) throw new Error(storageError.message);
  }
  return true;
};

// ACTUALIZAR UN PRODUCTO
export const updateProduct = async (
  productId: string,
  productInput: ProductInput
) => {
  // 1. Obtener las imagenes actuales del producto
  const { data: currentProduct, error: currentProductError } = await supabase
    .from("products")
    .select("images")
    .eq("id", productId)
    .single();
  if (currentProductError) throw new Error(currentProductError.message);

  const existingImages = currentProduct.images || [];

  //2. Actualizar la información del producto
  const { data: updatedProduct, error: productError } = await supabase
    .from("products")
    .update({
      name: productInput.name,
      brand: productInput.brand,
      slug: productInput.slug,
      features: productInput.features,
      description: productInput.description,
    })
    .eq('id',productId)
    .select()
    .single();

    if ( productError) throw new Error(productError.message);

    // 3. Manejo de imagenes(SUBIR NUEVAS Y ELIMINAR ANTIGUAS SI ES NECESARIO)
    const folderName=productId;

    const validImages=productInput.images.filter(image=>image);

    //3.1 Identificar las imagenes que hans sido eliminadas
    const imagesToDelete=existingImages.filter(
      image=> !validImages.includes(image)
    );

    // // 3.2 Obtener los paths de los archivos a eliminar
	const filesToDelete = imagesToDelete.map(extractFilePath);

  // 3.3 Eliminar las imagenes del bucket
  if (filesToDelete.length > 0) {
    const {error: deleteImagesError}=await supabase.storage
    .from('product-images')
    .remove(filesToDelete);

    if (deleteImagesError) {
      console.log(deleteImagesError);
      throw new Error(deleteImagesError.message)
    } else {
      console.log(`Imagenes eliminadas: ${filesToDelete.join(', ')}`);
    }
    
  }

  // 3.4 Subir las nuevas imágenes y construir el array de imágenes actualizado
  const uploadedImages = await Promise.all(
		validImages.map(async image => {
			if (image instanceof File) {
				// Si la imagen no es una URL (es un archivo), entonces subela al bucket
				const { data, error } = await supabase.storage
					.from('product-images')
					.upload(`${folderName}/${productId}-${image.name}`, image);

				if (error) throw new Error(error.message);

				const imageUrl = supabase.storage
					.from('product-images')
					.getPublicUrl(data.path).data.publicUrl;

				return imageUrl;
			} else if (typeof image === 'string') {
				return image;
			} else {
				throw new Error('Tipo de imagen no soportado');
			}
		})
	);

  //Actualizar el productos con las imagenes actualizadas
  const {error:updateImagesError}=await supabase
  .from('products')
  .update({images: uploadedImages})
  .eq('id',productId)

  if (updateImagesError)  throw new Error(updateImagesError.message);

  // 5.Actualizar las variantes del producto
  //Recordemos que tenemos variantes ya creadas y si queremos actualizar una variantr ya creada
  //hay que hacer un proceso en especifico
  //Pero si queremos añadir una variante o eliminar una variante que ya ha sido creada
  //debdemos controlar esas excepciones

  const existingVariants=productInput.variants.filter(v=>v.id)
  const newVariants =productInput.variants.filter(v=> !v.id);

  // 5.1 Modificar las variantes existentes
  //si existe la variante y hay un cambio
  if (existingImages.length >0 ) {
    const {error: updateVariantsError}=await supabase
    .from('variants')
    //.upsert te ahorra el trabajo de comprobar manualmente si un registro existe antes de decidir si insertarlo o actualizarlo.
    .upsert(
      existingVariants.map(variant=>({
        id: variant.id,
					product_id: productId,
					stock: variant.stock,
					price: variant.price,
					storage: variant.storage,
					color: variant.color,
					color_name: variant.colorName,
      })),

      {
        onConflict:'id'
      }


    );
    if (updateVariantsError)
			throw new Error(updateVariantsError.message);
  }

  // 5.2 Crear y guardar las nuevas variantes
  let newVariantIds: string[] = [];
  if (newVariants.length >0 ) {
    const {data, error: insertVariantsError} =await supabase
    .from('variants')
    .insert(
     newVariants.map(variant=>({
      product_id: productId,
					stock: variant.stock,
					price: variant.price,
					storage: variant.storage,
					color: variant.color,
					color_name: variant.colorName,
     }))


    )
    .select();
    if (insertVariantsError)
			throw new Error(insertVariantsError.message);

		newVariantIds = data.map(variant => variant.id);
  }
// 5.3 Combinar los IDs de las variantes existentes y nuevas
const currentVariantIds=[
  ...existingVariants.map(v=> v.id),
  ...newVariantIds,
];

// 5.4 Eliminar las variantes que no están en la lista de IDs
const {error:deleteVariantsError}=await supabase
.from('variants')
.delete()
.eq('product_id',productId)
.not(
  'id',
  'in',
  `(${currentVariantIds ? currentVariantIds.join(',') : 0})` // (UIWE2030230-2230000, UIWE2030230-2230001, ...)
);

if (deleteVariantsError)
  throw new Error(deleteVariantsError.message);

return updatedProduct;
};


