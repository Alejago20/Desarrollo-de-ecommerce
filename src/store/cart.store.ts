import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ICartItem } from "../components/shared/CartItem";


export interface CartState{
    items: ICartItem[]; // Lista de ítems en el carrito
    totalItemsInCart: number; // Total de productos en el carrito
    totalAmount: number; // Precio total del carrito

  addItem:(item:ICartItem)=> void;
  removeItem:(variantId:string)=> void;
  updateQuantity:(variantId:string,quantity:number)=>void;
  cleanCart:()=>void;
}

//es una función que define cómo se crea y organiza el estado de la tienda.
const storeApi: StateCreator<CartState> = set => ({
items: [],
totalItemsInCart:0,
totalAmount:0,
addItem:(item)=>{
    set(state=>{
        const existingItemIndex = state.items.findIndex(
            //vamos a encontrar el indece del item existente
            i => i.variantId === item.variantId
        );
        let updatedItems;

        if (existingItemIndex >=0) {
           // Si el item ya existe en el carrito, actualizamos la cantidad
           updatedItems=state.items.map((i,index)=>
            index ===existingItemIndex
           ?{
            ...i,
            quantity: i.quantity + item.quantity,
           }
           : i
        );  
     } else{
          // Si el item no existe en el carrito, lo añadimos
          updatedItems=[...state.items,item]
      }

      const newTotalItems = updatedItems.reduce(
        (acc, i) => acc + i.quantity,
        0
    );

    const newTotalAmount = updatedItems.reduce(
        (acc, i) => acc + i.price * i.quantity,
        0
    );

    return {
        //seteando los nuevos valores
        items: updatedItems,
        totalAmount: newTotalAmount,
        totalItemsInCart: newTotalItems,
    };

    });
},
removeItem:(variantId)=>{
    set(state=>{
        const updatedItems = state.items.filter(
            i => i.variantId !== variantId
        );

        const newTotalItems = updatedItems.reduce(
            (acc, i) => acc + i.quantity,
            0
        );

        const newTotalAmount = updatedItems.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
        );

        return {
            items: updatedItems,
            totalAmount: newTotalAmount,
            totalItemsInCart: newTotalItems,
        };


    });
},
updateQuantity:(variantId,quantity)=>{
    set(state=>{
        const updatedItems = state.items.map(i =>
            i.variantId === variantId ? { ...i, quantity } : i
        );

        const newTotalItems = updatedItems.reduce(
            (acc, i) => acc + i.quantity,
            0
        );

        const newTotalAmount = updatedItems.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
        );

        return {
            items: updatedItems,
            totalAmount: newTotalAmount,
            totalItemsInCart: newTotalItems,
        };
    })
},

 
cleanCart: () => {
    set({ items: [], totalItemsInCart: 0, totalAmount: 0 });
},
});

//El hook que proporciona acceso al estado y las acciones
export const useCartStore = create<CartState>()(
	devtools(
		persist(storeApi, {
			name: 'cart-store',
		})
	)
);