import express from "express";
import { body } from "express-validator";
import {
  registerCustomer,
  updateCustomerRecord,
  deleteCustomerRecord,
} from "../controllers/customerControllers.js";
import {
  registerPartner,
  updatePartner,
  deletePartner,
} from "../controllers/deliveryControllers.js";
import { addFood, updateFood, deleteFood } from "../controllers/foodControllers.js";
import { placeOrder, updateOrderStatus, cancelOrder } from "../controllers/orderControllers.js";
import {
  addRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantControllers.js";
import customerValidator from "../validation/customerValidator.js";
import deliveryValidator, { deliveryUpdateValidator } from "../validation/deliveryValidator.js";
import foodValidator from "../validation/foodValidator.js";
import orderValidator from "../validation/orderValidator.js";
import restaurantValidator from "../validation/restaurantValidator.js";
import validateRequest from "../validation/validateRequest.js";
import { requireAdminApi } from "../middleware/adminAuth.js";

const router = express.Router();
router.use(requireAdminApi);

router.post("/customers", customerValidator, validateRequest, registerCustomer);
router.put(
  "/customers/:id",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").trim().notEmpty().withMessage("Phone number is required"),
    body("address").trim().notEmpty().withMessage("Address is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("profileImage").optional({ values: "falsy" }).isURL().withMessage("Profile image must be a valid URL"),
  ],
  validateRequest,
  updateCustomerRecord
);
router.delete("/customers/:id", deleteCustomerRecord);

router.post("/deliverypartners", deliveryValidator, validateRequest, registerPartner);
router.put("/deliverypartners/:id", deliveryUpdateValidator, validateRequest, updatePartner);
router.delete("/deliverypartners/:id", deletePartner);

router.post("/restaurants", restaurantValidator, validateRequest, addRestaurant);
router.put("/restaurants/:id", restaurantValidator, validateRequest, updateRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);

router.post("/foods", foodValidator, validateRequest, addFood);
router.put("/foods/:id", foodValidator, validateRequest, updateFood);
router.delete("/foods/:id", deleteFood);

router.post("/orders", orderValidator, validateRequest, placeOrder);
router.put(
  "/orders/:id",
  [body("status").isIn(["placed", "preparing", "out_for_delivery", "delivered", "cancelled"])],
  validateRequest,
  updateOrderStatus
);
router.delete("/orders/:id", cancelOrder);

export default router;
