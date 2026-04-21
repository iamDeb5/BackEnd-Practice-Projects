import { Router } from "express";
import { validateRegisterUser } from "../validator/auth.validator.js";
import { register, login } from "../controllers/auth.controller.js";
import { validateLoginUser } from "../validator/auth.validator.js";

const router = Router();

router.post("/register", validateRegisterUser, register);
router.post("/login", validateLoginUser, login);

export default router;
