import { z } from "zod";

export const userRegisterSchema= z.object({
  email: z.string().email('Elc correo electronico no es valido'),
  password: z.string().min(6, 'La contraseña debde tener al menos 6 caracteres'),
  fullName: z.string().min(1, 'El nombre completo debe ser requerido'),
  phone: z.string().optional(),
});

export const addressSchema = z.object({
	addressLine1: z
		.string()
		.min(1, 'La dirección es requerida')
		.max(100, 'La dirección no debe exceder los 100 carácteres'),
	addressLine2: z
		.string()
		.max(100, 'La dirección no debe exceder los 100 carácteres')
		.optional(),
	city: z
		.string()
		.min(1, 'La ciudad es requerida')
		.max(50, 'La ciudad no debe exceder los 50 carácteres'),
	state: z
		.string()
		.min(1, 'El estado es requerido')
		.max(50, 'El estado no debe exceder los 50 carácteres'),
	postalCode: z
		.string()
		.max(10, 'El código postal no debe exceder los 10 carácteres')
		.optional(),
	country: z.string().min(1, 'El país es requerido'),
});
export type UserRegisterFormValue=z.infer<typeof userRegisterSchema>

export type AddressFormValues = z.infer<typeof addressSchema>;



