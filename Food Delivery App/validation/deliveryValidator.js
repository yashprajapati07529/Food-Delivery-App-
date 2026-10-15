import {body} from 'express-validator';

const deliveryValidator = [
    body("deliveryName").notEmpty().withMessage("Delivery name is required"),
    body("deliveryEmail").isEmail().withMessage("Invalid email address"),
    body("deliveryPhone").notEmpty().withMessage("Delivery phone number is required"),
    body("deliveryVehicleNumber").notEmpty().withMessage("Delivery vehicle number is required"),
    body("deliveryVehicleType").isIn(["bike", "scooter", "car"]).withMessage("Invalid delivery vehicle type"),
    body("deliveryLicenseNumber").notEmpty().withMessage("Delivery license number is required"),
    body("deliveryIsActive").isBoolean().withMessage("Delivery active status must be a boolean value"),
    body("deliveryCurrentLocation.latitude").isFloat({ min: -90, max: 90 }).withMessage("Delivery latitude must be between -90 and 90"),
    body("deliveryCurrentLocation.longitude").isFloat({ min: -180, max: 180 }).withMessage("Delivery longitude must be between -180 and 180"),
    body("deliveryProfileImage").optional().isURL().withMessage("Delivery profile image must be a valid URL")
]

export default deliveryValidator;