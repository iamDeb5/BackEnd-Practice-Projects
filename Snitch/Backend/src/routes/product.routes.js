import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validator.js";
import { getSellerProducts } from "../controllers/product.controller.js";

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 1024 * 1024 * 5, // 5MB limit
	},
});

const router = express.Router();

/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller Only)
 */
router.post(
	"/",
	authenticateSeller,
	upload.array("images", 7),
	createProductValidator,
	createProduct,
);

/**
 * @route GET /api/products/seller
 * @description Get all products of authenticated seller
 * @access Private (Seller Only)
 */
router.get("/seller", authenticateSeller, getSellerProducts);

export default router;
