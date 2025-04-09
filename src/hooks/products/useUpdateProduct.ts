import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateProduct } from "../../actions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ProductInput } from "../../interfaces";

export const useUpdatePrduct = (productId: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ProductInput) => updateProduct(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      }),
        toast.success("Producto actualizado", {
          position: "bottom-right",
        });
      navigate("/dashboard/productos");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Ocurrio un error al actaulizar el producto", {
        position: "bottom-right",
      });
    },
  });

  return {
    mutate,
    isPending,
  };
};
