import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";


export interface CounterState{
    count:number;
    increment:()=>void;
    decrement:()=>void;
}

//es una función que define cómo se crea y organiza el estado de la tienda.
const storeApi: StateCreator<CounterState>=set=>({

    count:1,
    increment: ()=>{
        set(state=>({count:state.count+1}));
    },

    decrement: ()=>{
        set(state=>({count: Math.max(1, state.count -1)}));
    },

});

//El hook que proporciona acceso al estado y las acciones
export const useCounterStore=create<CounterState>()(
    devtools(storeApi)
);
