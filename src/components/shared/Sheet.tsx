import React, { useRef } from 'react'
import { useGlobalStore } from '../../store/global.store'
import { Cart } from './Cart';
import { Search } from './Search';
import { useEffect } from 'react';

export const Sheet = () => {
     const sheetContent= useGlobalStore(state=>state.sheetContent);
    const closeSheett= useGlobalStore(state=>state.closeSheet);

   /*  useRef es acceder y manipular directamente elementos del DOM. 
    Puedes usarlo para realizar tareas como establecer el enfoque en un campo de entrada, 
    desplazarte a un elemento o cambiar manualmente estilos. */
    const sheetRef=useRef<HTMLDivElement | null> (null);
   
    useEffect(() => {
		document.body.style.overflow = 'hidden';

		// Función para manejar clics fuera del Sheet
		const handleOutsideClick = (event:MouseEvent) => {
			if (
				sheetRef.current &&
				!sheetRef.current.contains(event.target as Node)
			) {
				closeSheett();
			}
		};

		// Agregar event Listener
		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.body.style.overflow = 'unset';
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [closeSheett]);





    const renderContent=()=>{

   
    switch (sheetContent) {
        case 'cart':
         return <Cart/>
        case 'search':
        return <Search/>       
        default:
           return null
    }
} 
    return (
		<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end animate-fade-in'>
			<div
				ref={sheetRef}
				className='bg-white text-black h-screen w-[500px] shadow-lg animate-slide-in'
			>
			{renderContent()}
			</div>
		</div>
	);
}
