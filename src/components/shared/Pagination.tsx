interface Props{
 totalItems:number;
 page:number;
 setPage:React.Dispatch<React.SetStateAction<number>>;   
}


export const Pagination=({totalItems, page, setPage}:Props)=>{
    const handleNextPage=()=>{
        setPage(page + 1);
    }
    const handlePrevPage=()=>{
        setPage(prevPage=>Math.max(prevPage-1, 1));
    };

    const itemsPerPage=10;
    const totalPages =totalItems
    ? Math.ceil(totalItems/itemsPerPage)
    :1;//total de páginas
    const isLastPage=page >= totalPages;//evaluar si la página actual supera el número total de elementos
    const startItem = (page - 1) * itemsPerPage+1;// va ser el numero de productos por el cual va a empezar
    const endItem=Math.min(page*itemsPerPage,totalItems);//el total de items esta ahi, para asegurar que no soprepase el total de productos
    // y se toma el valor menor
    return (<div className='flex justify-between items-center'>
        <p className='text-xs font-medium'>
            Mostrando{' '}
            <span className='font-bold'>
                {startItem} - {endItem}
            </span>{' '}
            de <span className='font-bold'> {totalItems}</span> productos
        </p>

        <div className='flex gap-3'>
            <button
                className='btn-paginated'
                onClick={handlePrevPage}
                disabled={page === 1}
            >
                Anterior
            </button>

            <button
                className='btn-paginated'
                onClick={handleNextPage}
                disabled={isLastPage}
            >
                Siguiente
            </button>
        </div>
    </div>
    );
}