import {
	createProduct,
	getSellerProducts,
	getAllProducts,
} from "../services/product.api";
import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts } from "../state/product.slice.js";

export const useProduct = () => {
	const dispatch = useDispatch();
	const handleCreateProduct = async (formData) => {
		const data = await createProduct(formData);
		return data.product;
	};

	const handleGetSellerProducts = async () => {
		const data = await getSellerProducts();
		dispatch(setSellerProducts(data.products));
		return data.products;
	};

	const handleGetAllProducts = async () => {
		const data = await getAllProducts();
		dispatch(setProducts(data.products));
		// return data.products;
	};

	return { handleCreateProduct, handleGetSellerProducts, handleGetAllProducts };
};
