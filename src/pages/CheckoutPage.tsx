import { Link } from "react-router-dom"
import { useCartStore } from "../store/cart.store";
import { FormCheckout } from "../components/checkout/FormCheckout";
import { ItemsCheckout } from "../components/checkout/ItemsCheckout";


const CheckoutPage = () => {
    //total elementos que hay en el carrito
    const totalItems = useCartStore(state => state.totalItemsInCart);
  return (
    <div
      style={{minHeight:'calc(100vh-100px)',
        
      }}
      >
        <header className="h-[100px] bg-white flex items-center justify-center flex-col px-10 border-b border-slate-200">
        <Link to='/' className="text-4xl font-bold self-center tracking-tighter transition-all md:text-5xl md:self-start">
        <p>
            Celulares
            <span className="text-cyan-600 ">Baratos</span>
        </p>
        </Link>
     </header>

     <main className="w-full h-full flex relative">
     {totalItems === 0 ? (
					<div
						className='flex flex-col items-center justify-center gap-5 w-full'
						style={{
							height: 'calc(100vh - 100px)',
						}}
					>
						<p className='text-sm font-medium tracking-tight'>
							Su carro esta vacío
						</p>
						<Link
							to='/celulares'
							className='py-4 bg-black rounded-full text-white px-7 text-xs uppercase tracking-widest font-semibold'
						>
							Empezar a comprar
						</Link>
					</div>
				) : (
					<>
						<div className='w-full md:w-[50%] p-10'>
						<FormCheckout />
						</div>

						<div
							className='bg-stone-100 w-[50%] sticky top-0 right-0 p-10 hidden md:block'
							style={{
								minHeight: 'calc(100vh - 100px)',
							}}
						>
							{/* Elementos del carrito */}
							<ItemsCheckout/>
						</div>
					</>
				)}
			</main>
      </div>
  )
}

export default CheckoutPage