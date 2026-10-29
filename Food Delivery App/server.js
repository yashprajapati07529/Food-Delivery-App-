import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import cors from 'cors'
import mongoose from "mongoose";
import authMiddleware from './middleware/errorHandler.js'
import Customer from "./models/CustomerModels.js";
import DeliveryPartner from "./models/DeliveryPartnerModels.js";
import Food from "./models/FoodModels.js";
import Order from "./models/OrderModels.js";
import Restaurant from "./models/RestaurantModels.js";

import customerRoutes from "./routes/customerRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { getAdminStatus, loginAdmin, logoutAdmin } from "./controllers/adminAuthController.js";

dotenv.config()

const app = express();

app.use(cors({
  origin: '*'
}));

app.set('view engine' , 'ejs')

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/uploads' , express.static("uploads"))

app.get("/api/health", (req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;
  return res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    status: databaseConnected ? "online" : "offline",
    database: databaseConnected ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
  });
});
app.get("/api/admin/session", getAdminStatus);
app.post("/api/admin/login", loginAdmin);
app.post("/api/admin/logout", logoutAdmin);
app.use("/admin-api", adminRoutes);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

app.get("/", async (req, res) => {
  const [customers, orders, restaurants, foods, deliveryPartners] = await Promise.all([
    Customer.countDocuments(),
    Order.countDocuments(),
    Restaurant.countDocuments(),
    Food.countDocuments(),
    DeliveryPartner.countDocuments(),
  ]);

  const allowedPages = ["customers", "orders", "restaurants", "foods", "delivery"];
  const page = allowedPages.includes(req.query.page) ? req.query.page : "dashboard";
  const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
  const filters = {
    search,
    sort: typeof req.query.sort === "string" ? req.query.sort : "newest",
    city: typeof req.query.city === "string" ? req.query.city.trim().slice(0, 80) : "",
    status: typeof req.query.status === "string" ? req.query.status : "",
    vehicleType: typeof req.query.vehicleType === "string" ? req.query.vehicleType : "",
    restaurantId: typeof req.query.restaurantId === "string" ? req.query.restaurantId : "",
    availability: typeof req.query.availability === "string" ? req.query.availability : "",
    paymentMethod: typeof req.query.paymentMethod === "string" ? req.query.paymentMethod : "",
  };
  const searchRegex = search ? new RegExp(escapeRegex(search), "i") : null;
  let records = [];

  if (page === "customers") {
    const filter = {};
    if (searchRegex) {
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { city: searchRegex },
      ];
    }
    if (filters.city) filter.city = new RegExp(escapeRegex(filters.city), "i");
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name: { name: 1 },
      city: { city: 1 },
    };
    records = await Customer.find(filter)
      .select("name email phone city profileImage createdAt")
      .sort(sortOptions[filters.sort] || sortOptions.newest)
      .limit(100)
      .lean();
  } else if (page === "orders") {
    const filter = {};
    if (searchRegex) {
      const [matchingCustomers, matchingRestaurants] = await Promise.all([
        Customer.find({ $or: [{ name: searchRegex }, { email: searchRegex }] }).distinct("_id"),
        Restaurant.find({ name: searchRegex }).distinct("_id"),
      ]);
      filter.$or = [
        { customerId: { $in: matchingCustomers } },
        { restaurantId: { $in: matchingRestaurants } },
      ];
    }
    if (["placed", "preparing", "out_for_delivery", "delivered", "cancelled"].includes(filters.status)) {
      filter.status = filters.status;
    }
    if (["cash", "card", "upi"].includes(filters.paymentMethod)) {
      filter.paymentMethod = filters.paymentMethod;
    }
    records = await Order.find(filter)
      .populate("customerId", "name")
      .populate("restaurantId", "name")
      .populate("foodItems.foodId", "title")
      .sort(filters.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 })
      .limit(100)
      .lean();
  } else if (page === "restaurants") {
    const filter = {};
    if (searchRegex) {
      filter.$or = [
        { name: searchRegex },
        { ownerName: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
      ];
    }
    if (filters.city) filter.city = new RegExp(escapeRegex(filters.city), "i");
    if (filters.status === "active" || filters.status === "inactive") {
      filter.isActive = filters.status === "active";
    }
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name: { name: 1 },
      rating: { rating: -1 },
    };
    records = await Restaurant.find(filter)
      .sort(sortOptions[filters.sort] || sortOptions.newest)
      .limit(100)
      .lean();
  } else if (page === "foods") {
    const filter = {};
    if (searchRegex) {
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }
    if (filters.restaurantId) {
      filter.restaurantId = /^[a-f\d]{24}$/i.test(filters.restaurantId)
        ? filters.restaurantId
        : null;
    }
    if (filters.availability === "available" || filters.availability === "unavailable") {
      filter.isAvailable = filters.availability === "available";
    }
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name: { title: 1 },
      price: { price: 1 },
      rating: { rating: -1 },
    };
    records = await Food.find(filter)
      .populate("restaurantId", "name")
      .sort(sortOptions[filters.sort] || sortOptions.newest)
      .limit(100)
      .lean();
  } else if (page === "delivery") {
    const filter = {};
    if (searchRegex) {
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { vehicleNumber: searchRegex },
      ];
    }
    if (filters.status === "active" || filters.status === "inactive") {
      filter.isActive = filters.status === "active";
    }
    if (["bike", "scooter", "car"].includes(filters.vehicleType)) {
      filter.vehicleType = filters.vehicleType;
    }
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      name: { name: 1 },
      vehicle: { vehicleType: 1 },
    };
    records = await DeliveryPartner.find(filter)
      .select("-licenseNumber")
      .sort(sortOptions[filters.sort] || sortOptions.newest)
      .limit(100)
      .lean();
  }

  const [restaurantsForSelect, customersForSelect, foodsForSelect] = await Promise.all([
    ["foods", "orders"].includes(page) ? Restaurant.find().select("name").sort({ name: 1 }).lean() : [],
    page === "orders" ? Customer.find().select("name").sort({ name: 1 }).lean() : [],
    page === "orders" ? Food.find().select("title").sort({ title: 1 }).lean() : [],
  ]);

  res.render("dashbord", {
    dashboardCounts: { customers, orders, restaurants, foods, deliveryPartners },
    page,
    records,
    filters,
    restaurantsForSelect,
    customersForSelect,
    foodsForSelect,
    environment: process.env.NODE_ENV || "Development",
  });
});

app.use("/api/customers", customerRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliverypartners", deliveryRoutes);

app.use(authMiddleware);


const startServer = async () => {
  await connectDB();
  app.listen(PORT, (err) => {
    if (err) {
      console.error(err);
      process.exitCode = 1;
      return;
    }

    console.log(`Server Start : http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Server could not start:", error);
  process.exitCode = 1;
});