import { body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRegisterUser = [
  body("email").isEmail().withMessage("Invalid Email Format"),
  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .matches(/^[0-9]{10}$/)
    .withMessage("Contact must be a 10-digit number"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullName")
    .notEmpty()
    .withMessage("Full Name is required")
    .isLength({ min: 3 })
    .withMessage("Full Name must be at least 3 characters long"),
  body("isSeller").isBoolean().withMessage("isSeller must be a boolean"),
  validateRequest,
];
